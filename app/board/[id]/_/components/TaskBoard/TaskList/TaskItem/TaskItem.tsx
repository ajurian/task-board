import {
    TASK_DETAILS_MAX_LEN,
    TASK_DETAILS_MIN_LEN,
    TASK_TITLE_MAX_LEN,
    TASK_TITLE_MIN_LEN,
} from "@/_/common/constants/constraints";
import { TaskModel } from "@/_/common/schema/task";
import { useTaskBoard } from "@/board/[id]/_/providers/TaskBoardProvider";
import {
    faCalendar,
    faCheck,
    faCircleDot,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Draggable } from "@hello-pangea/dnd";
import { mergeRefs, useInputState } from "@mantine/hooks";
import { IconButton } from "@mui/material";
import {
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

export interface TaskItemProps extends Omit<TaskModel, "isDone"> {}

export default function TaskItem({
    id,
    order,
    title,
    details,
    dueAt,
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

    const [actionAfterFade, setActionAfterFade] = useState<(() => void) | null>(
        null
    );
    const {
        canUserCreateOrDeleteTask,
        canUserUpdateTaskTitle,
        canUserUpdateTaskDetails,
        canUserCompleteTask,
        canUserScheduleTask,
        canUserReorderTask,
        editTask,
        deleteTask,
        searchQuery,
    } = useTaskBoard();

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
                detailsInputRef.current?.focus();
                return;
            }

            if (node === dueAtRef.current) {
                setTimeout(() => dueAtInputRef.current?.click());
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
                            isDragDisabled={isDragDisabled}
                            isFocused={isFocused}
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
                                <TaskItemTitleInput
                                    inputRef={titleInputRef}
                                    isContainerFocused={isFocused}
                                    value={titleInput}
                                    onChange={setTitleInput}
                                    onFocus={(e) => e.currentTarget.select()}
                                    onKeyDown={(e) =>
                                        e.key === "Enter" && e.preventDefault()
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
                                <TaskItemTitleText
                                    ref={titleRef}
                                    isContainerFocused={isFocused}
                                    variant="subtitle1"
                                    noWrap
                                >
                                    {initialTitle}
                                </TaskItemTitleText>
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
                            <TaskItemDetailsInput
                                inputRef={detailsInputRef}
                                isContainerFocused={isFocused}
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
                            <TaskItemDetailsText
                                ref={detailsRef}
                                isContainerFocused={isFocused}
                                variant="body2"
                            >
                                {initialDetails}
                            </TaskItemDetailsText>
                            {dueAt !== null && (
                                <TaskItemDueDateTagWrapper
                                    isContainerFocused={isFocused}
                                >
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
                                        {dueAt.toLocaleDateString()}
                                    </TaskItemDueDateTagText>
                                </TaskItemDueDateTagWrapper>
                            )}
                            <TaskItemDueDateSelectTriggerWrapper
                                isContainerFocused={isFocused}
                            >
                                <TaskItemDueDateSelectTrigger
                                    ref={dueAtInputRef}
                                    date={dueAtInput}
                                    onDateChange={setDueAtInput}
                                />
                            </TaskItemDueDateSelectTriggerWrapper>
                        </TaskItemContainer>
                    </TaskItemFade>
                )}
            </Draggable>
        </>
    );
}
