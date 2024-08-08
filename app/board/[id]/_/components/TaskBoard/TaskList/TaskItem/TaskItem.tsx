import {
    TASK_DETAILS_MAX_LEN,
    TASK_DETAILS_MIN_LEN,
    TASK_TITLE_MAX_LEN,
    TASK_TITLE_MIN_LEN,
} from "@/_/common/constants/constraints";
import { TaskModel } from "@/_/common/schema/task";
import { TaskBoardContextValue } from "@/board/[id]/_/providers/TaskBoardProvider/TaskBoardProviderTypes";
import {
    faCalendar,
    faCheck,
    faCircleDot,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Draggable } from "@hello-pangea/dnd";
import { mergeRefs, useInputState } from "@mantine/hooks";
import { IconButton } from "@mui/material";
import _ from "lodash";
import {
    memo,
    TransitionEventHandler,
    useCallback,
    useMemo,
    useRef,
    useState,
} from "react";
import useContentEditable from "../../hooks/useContentEditable";
import TaskItemDueDateSelectTrigger from "./TaskItemDueDateSelectTrigger";
import TaskItemMenuTrigger from "./TaskItemMenuTrigger";
import {
    TaskItemBulletPointWrapper,
    TaskItemContainer,
    TaskItemDetailsInput,
    TaskItemDetailsText,
    TaskItemDueDateSelectTriggerWrapper,
    TaskItemDueDateTagText,
    TaskItemDueDateTagWrapper,
    TaskItemFade,
    TaskItemTitleContainer,
    TaskItemTitleInput,
    TaskItemTitleText,
} from "./ui";
import dayjs from "@/_/common/lib/dayjs";

const INPUT_TYPE = {
    NONE: 0,
    TITLE: 1,
    DETIALS: 2,
    DUE_AT: 3,
} as const;

export interface TaskItemProps
    extends Omit<TaskModel, "isDone">,
        Pick<
            TaskBoardContextValue,
            | "canUserCreateOrDeleteTask"
            | "canUserUpdateTaskTitle"
            | "canUserUpdateTaskDetails"
            | "canUserCompleteTask"
            | "canUserScheduleTask"
            | "canUserReorderTask"
            | "editTask"
            | "deleteTask"
            | "searchQuery"
        > {}

const TaskItem = memo(function TaskItem({
    id,
    order,
    title,
    details,
    dueAt,
    canUserCreateOrDeleteTask,
    canUserUpdateTaskTitle,
    canUserUpdateTaskDetails,
    canUserCompleteTask,
    canUserScheduleTask,
    canUserReorderTask,
    editTask,
    deleteTask,
    searchQuery,
}: TaskItemProps) {
    const initialTitle = useMemo(() => title.replace(/\\n/g, "\n"), [title]);
    const initialDetails = useMemo(
        () => details.replace(/\\n/g, "\n"),
        [details]
    );
    const initialDueAt = useMemo(() => dueAt, [dueAt]);

    const [titleInput, setTitleInput] = useInputState(initialTitle);
    const [detailsInput, setDetailsInput] = useInputState(initialDetails);
    const [dueAtInput, setDueAtInput] = useState<Date | null>(initialDueAt);

    const titleRef = useRef<HTMLSpanElement | null>(null);
    const detailsRef = useRef<HTMLSpanElement | null>(null);
    const dueAtRef = useRef<HTMLParagraphElement | null>(null);
    const titleInputRef = useRef<HTMLTextAreaElement | null>(null);
    const detailsInputRef = useRef<HTMLTextAreaElement | null>(null);
    const dueAtInputRef = useRef<HTMLButtonElement | null>(null);
    const focusedRef = useRef<number>(INPUT_TYPE.NONE);

    const [actionAfterFade, setActionAfterFade] = useState<(() => void) | null>(
        null
    );

    const canUserEditTask =
        canUserUpdateTaskTitle &&
        canUserUpdateTaskDetails &&
        canUserScheduleTask;

    const { ref, isFocused, contentEditableProps } = useContentEditable({
        isEditDisabled: !canUserEditTask,
        onNodeIgnore: (node): boolean =>
            node !== titleRef.current &&
            node !== detailsRef.current &&
            node !== dueAtRef.current &&
            node !== ref.current,
        onFocus: (node) => {
            if (node === detailsRef.current) {
                focusedRef.current = INPUT_TYPE.DETIALS;
                return;
            }

            if (node === dueAtRef.current) {
                focusedRef.current = INPUT_TYPE.DUE_AT;
                return;
            }

            focusedRef.current = INPUT_TYPE.TITLE;
        },
        onFocusAfter: () => {
            const focused = focusedRef.current;

            if (focused === INPUT_TYPE.DETIALS) {
                detailsInputRef.current?.focus();
                return;
            }

            if (focused === INPUT_TYPE.DUE_AT) {
                dueAtInputRef.current?.click();
                return;
            }

            titleInputRef.current?.focus();
        },
        onStateReset: () => {
            setTitleInput(initialTitle);
            setDetailsInput(initialDetails);
            setDueAtInput(initialDueAt);
        },
        onEdit: () => {
            const hasTitleChanged = titleInput !== initialTitle;
            const hasDetailsChanged = detailsInput !== initialDetails;
            const hasDueAtChanged =
                dueAtInput?.getTime() !== initialDueAt?.getTime();
            const hasDataChanged =
                hasTitleChanged || hasDetailsChanged || hasDueAtChanged;

            if (
                titleInput.length < TASK_TITLE_MIN_LEN ||
                detailsInput.length < TASK_DETAILS_MIN_LEN ||
                !hasDataChanged
            ) {
                return;
            }

            editTask({
                id,
                title: hasTitleChanged ? titleInput : undefined,
                details: hasDetailsChanged ? detailsInput : undefined,
                dueAt: hasDueAtChanged ? dueAtInput : undefined,
            });
        },
    });

    const isDragDisabled =
        isFocused || searchQuery.length > 0 || !canUserReorderTask;

    const handleTransitionEnd: TransitionEventHandler<HTMLElement> =
        useCallback(
            (e) => {
                if (e.target !== e.currentTarget) {
                    return;
                }

                actionAfterFade?.();
                setActionAfterFade(null);
            },
            [actionAfterFade]
        );

    return (
        <>
            <Draggable
                key={id}
                draggableId={id}
                index={order}
                isDragDisabled={isDragDisabled}
            >
                {(
                    { draggableProps, dragHandleProps, innerRef },
                    { isDragging }
                ) => (
                    <TaskItemFade
                        shouldFadeOut={actionAfterFade !== null}
                        onTransitionEnd={handleTransitionEnd}
                    >
                        <TaskItemContainer
                            {...draggableProps}
                            {...dragHandleProps}
                            {...contentEditableProps}
                            ref={mergeRefs(innerRef, ref)}
                            isDragging={isDragging}
                            isFocused={isFocused}
                            isEditDisabled={!canUserEditTask}
                        >
                            <TaskItemTitleContainer>
                                {!canUserCompleteTask && (
                                    <TaskItemBulletPointWrapper>
                                        <FontAwesomeIcon icon={faCircleDot} />
                                    </TaskItemBulletPointWrapper>
                                )}
                                {canUserCompleteTask && (
                                    <IconButton
                                        size="small"
                                        color="primary"
                                        tabIndex={isFocused ? 0 : -1}
                                        onClick={() =>
                                            setActionAfterFade(
                                                () => () =>
                                                    editTask({
                                                        id,
                                                        isDone: true,
                                                    })
                                            )
                                        }
                                    >
                                        <FontAwesomeIcon icon={faCheck} />
                                    </IconButton>
                                )}
                                {isFocused && (
                                    <TaskItemTitleInput
                                        inputRef={titleInputRef}
                                        value={titleInput}
                                        onChange={setTitleInput}
                                        onFocus={(e) =>
                                            e.currentTarget.select()
                                        }
                                        onKeyDown={(e) =>
                                            e.key === "Enter" &&
                                            e.preventDefault()
                                        }
                                        inputProps={{
                                            style: { padding: 0 },
                                            maxLength: TASK_TITLE_MAX_LEN,
                                            "data-disable-multiline": true,
                                        }}
                                        placeholder="Title"
                                        size="small"
                                        multiline
                                        fullWidth
                                    />
                                )}
                                {!isFocused && (
                                    <TaskItemTitleText
                                        ref={titleRef}
                                        variant="subtitle1"
                                        noWrap
                                    >
                                        {initialTitle}
                                    </TaskItemTitleText>
                                )}
                                {(canUserEditTask ||
                                    canUserCreateOrDeleteTask) && (
                                    <TaskItemMenuTrigger
                                        onEdit={
                                            canUserEditTask
                                                ? () => ref.current?.click()
                                                : undefined
                                        }
                                        onDelete={
                                            canUserCreateOrDeleteTask
                                                ? () =>
                                                      setActionAfterFade(
                                                          () => () =>
                                                              deleteTask({ id })
                                                      )
                                                : undefined
                                        }
                                    />
                                )}
                            </TaskItemTitleContainer>
                            {isFocused && (
                                <TaskItemDetailsInput
                                    inputRef={detailsInputRef}
                                    value={detailsInput}
                                    onChange={setDetailsInput}
                                    onFocus={(e) => e.currentTarget.select()}
                                    inputProps={{
                                        style: { padding: 0 },
                                        maxLength: TASK_DETAILS_MAX_LEN,
                                    }}
                                    placeholder="Details"
                                    size="small"
                                    multiline
                                    fullWidth
                                />
                            )}
                            {!isFocused && (
                                <TaskItemDetailsText
                                    ref={detailsRef}
                                    variant="body2"
                                >
                                    {initialDetails}
                                </TaskItemDetailsText>
                            )}
                            {!isFocused && dueAt !== null && (
                                <TaskItemDueDateTagWrapper>
                                    <TaskItemDueDateTagText
                                        ref={dueAtRef}
                                        variant="button"
                                        color="warning.main"
                                    >
                                        <FontAwesomeIcon
                                            icon={faCalendar}
                                            style={{
                                                fontSize: "1em",
                                                marginRight: "8px",
                                                marginLeft: "-2px",
                                            }}
                                        />
                                        {dayjs().to(dueAt)}
                                    </TaskItemDueDateTagText>
                                </TaskItemDueDateTagWrapper>
                            )}
                            {isFocused && (
                                <TaskItemDueDateSelectTriggerWrapper>
                                    <TaskItemDueDateSelectTrigger
                                        ref={dueAtInputRef}
                                        date={dueAtInput}
                                        onDateChange={setDueAtInput}
                                    />
                                </TaskItemDueDateSelectTriggerWrapper>
                            )}
                        </TaskItemContainer>
                    </TaskItemFade>
                )}
            </Draggable>
        </>
    );
},
_.isEqual);

export default TaskItem;
