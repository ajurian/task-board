import { TaskModel } from "@/_/common/schema/task";
import { useTaskBoard } from "@/board/[id]/_/providers/TaskBoardProvider";
import { faCheck, faCircleDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Draggable } from "@hello-pangea/dnd";
import { useInputState } from "@mantine/hooks";
import { Box, IconButton } from "@mui/material";
import {
    TransitionEventHandler,
    useCallback,
    useMemo,
    useRef,
    useState,
} from "react";
import useContentEditable from "../../hooks/useContentEditable";
import TaskItemMenu from "./TaskItemMenu";
import {
    TaskItemContainer,
    TaskItemDetailsInput,
    TaskItemDetailsText,
    TaskItemFade,
    TaskItemTitleContainer,
    TaskItemTitleInput,
    TaskItemTitleText,
} from "./ui";

export interface TaskItemProps extends Omit<TaskModel, "isDone"> {
    index: number;
}

export default function TaskItem({ index, id, title, details }: TaskItemProps) {
    const initialTitle = useMemo(() => title.replace(/\\n/g, "\n"), [title]);
    const initialDetails = useMemo(
        () => details.replace(/\\n/g, "\n"),
        [details]
    );

    const [titleInput, setTitleInput] = useInputState(initialTitle);
    const [detailsInput, setDetailsInput] = useInputState(initialDetails);

    const titleRef = useRef<HTMLSpanElement | null>(null);
    const detailsRef = useRef<HTMLSpanElement | null>(null);
    const titleInputRef = useRef<HTMLTextAreaElement | null>(null);
    const detailsInputRef = useRef<HTMLTextAreaElement | null>(null);

    const [actionAfterFade, setActionAfterFade] = useState<(() => void) | null>(
        null
    );
    const {
        canUserCreateOrDeleteTask,
        canUserUpdateTaskTitle,
        canUserUpdateTaskDetails,
        canUserCompleteTask,
        canUserReorderTask,
        editTask,
        deleteTask,
        searchQuery,
    } = useTaskBoard();

    const canUserEditTask = canUserUpdateTaskTitle || canUserUpdateTaskDetails;

    const { ref, isFocused, contentEditableProps } = useContentEditable({
        isEditDisabled: !canUserEditTask,
        onNodeIgnore: (node): boolean =>
            node !== titleRef.current &&
            node !== detailsRef.current &&
            node !== ref.current,
        onFocus: (node) => {
            if (node === detailsRef.current) {
                detailsInputRef.current?.focus();
                return;
            }

            titleInputRef.current?.focus();
        },
        onStateReset: () => {
            setTitleInput(initialTitle);
            setDetailsInput(initialDetails);
        },
        onEdit: () => {
            const hasDataChanged =
                titleInput !== initialTitle || detailsInput !== initialDetails;

            if (titleInput.length === 0 || !hasDataChanged) {
                return;
            }

            editTask({ id, title: titleInput, details: detailsInput });
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
        <Draggable
            key={id}
            draggableId={id}
            index={index}
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
                        ref={(node: HTMLElement | null) => {
                            innerRef(node);
                            ref.current = node;
                        }}
                        isDragging={isDragging}
                        isDragDisabled={isDragDisabled}
                        isFocused={isFocused}
                    >
                        <TaskItemTitleContainer>
                            {!canUserCompleteTask && (
                                <Box
                                    sx={(theme) => ({
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        boxSizing: "content-box",
                                        padding: "5px",
                                        width: theme.spacing(4.5),
                                        height: theme.spacing(4.5),
                                        color: theme.palette.text.secondary,
                                    })}
                                >
                                    <FontAwesomeIcon icon={faCircleDot} />
                                </Box>
                            )}
                            {canUserCompleteTask && (
                                <IconButton
                                    size="small"
                                    color="primary"
                                    tabIndex={isFocused ? 0 : -1}
                                    onClick={() =>
                                        setActionAfterFade(
                                            () => () =>
                                                editTask({ id, isDone: true })
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
                                placeholder="Title"
                                size="small"
                                multiline
                                fullWidth
                            />
                            <TaskItemTitleText
                                ref={titleRef}
                                isContainerFocused={isFocused}
                                variant="subtitle1"
                            >
                                {initialTitle}
                            </TaskItemTitleText>
                            {(canUserEditTask || canUserCreateOrDeleteTask) && (
                                <TaskItemMenu
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
                    </TaskItemContainer>
                </TaskItemFade>
            )}
        </Draggable>
    );
}