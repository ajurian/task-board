import { useTaskQuery } from "@/app/board/[uniqueName]/_providers/TaskQueryProvider";
import { TaskModel } from "@/schema/task";
import { faCheck, faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Draggable } from "@hello-pangea/dnd";
import { useClickOutside, useInputState, usePrevious } from "@mantine/hooks";
import { Box, IconButton, InputBase, Typography } from "@mui/material";
import {
    KeyboardEventHandler,
    useCallback,
    useLayoutEffect,
    useMemo,
    useState,
} from "react";
import { TaskContainer } from "./ui";
import TaskItemMenu from "./TaskItemMenu";

interface TaskItemProps extends TaskModel {}

export default function TaskItem({ id, order, title, details }: TaskItemProps) {
    const [focusedOn, setFocusedOn] = useState<"title" | "details" | null>(
        null
    );
    const previousFocusedOn = usePrevious(focusedOn);
    const ref = useClickOutside<HTMLElement>(() => setFocusedOn(null));
    const isFocused = focusedOn !== null;

    const initialTitle = useMemo(() => title.replace(/\\n/g, "\n"), [title]);
    const initialDetails = useMemo(
        () => details.replace(/\\n/g, "\n"),
        [details]
    );

    const [titleInput, setTitleInput] = useInputState(initialTitle);
    const [detailsInput, setDetailsInput] = useInputState(initialDetails);

    const { editTask } = useTaskQuery();

    const makeMutation = useCallback(() => {
        const isDataValid = titleInput.length > 0 && detailsInput.length > 0;
        const hasDataChanged =
            titleInput !== initialTitle || detailsInput !== initialDetails;

        if (isDataValid && hasDataChanged) {
            editTask({ id, title: titleInput, details: detailsInput });
            return;
        }

        setTitleInput(initialTitle);
        setDetailsInput(initialDetails);
    }, [
        id,
        initialTitle,
        initialDetails,
        titleInput,
        detailsInput,
        editTask,
        setTitleInput,
        setDetailsInput,
    ]);

    const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = (e) => {
        if (e.key === "Escape") {
            setFocusedOn(null);
            setTitleInput(initialTitle);
            setDetailsInput(initialDetails);
            return;
        }
    };

    useLayoutEffect(() => {
        // onBlur
        if (focusedOn === previousFocusedOn || previousFocusedOn === null) {
            return;
        }

        makeMutation();
    }, [focusedOn, previousFocusedOn, makeMutation]);

    return (
        <Draggable draggableId={id} index={order} isDragDisabled={isFocused}>
            {(
                { draggableProps, dragHandleProps, innerRef },
                { isDragging }
            ) => (
                <TaskContainer
                    {...draggableProps}
                    {...dragHandleProps}
                    ref={(node: HTMLElement) => {
                        innerRef(node);
                        ref.current = node;
                    }}
                    isDragging={isDragging}
                    isFocused={isFocused}
                    onKeyDown={handleKeyDown}
                >
                    <Box sx={{ display: "flex", alignItems: "start", gap: 2 }}>
                        <IconButton size="small" color="success" tabIndex={-1}>
                            <FontAwesomeIcon icon={faCheck} />
                        </IconButton>
                        {isFocused ? (
                            <InputBase
                                multiline
                                fullWidth
                                size="small"
                                autoFocus={focusedOn === "title"}
                                sx={(theme) => ({
                                    ...theme.typography.subtitle1,
                                    py: 0,
                                })}
                                onFocus={(e) =>
                                    previousFocusedOn === null &&
                                    e.currentTarget.select()
                                }
                                value={titleInput}
                                onChange={setTitleInput}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        setFocusedOn(null);
                                        makeMutation();
                                    }
                                }}
                            />
                        ) : (
                            <Typography
                                variant="subtitle1"
                                sx={{
                                    whiteSpace: "pre-wrap",
                                    wordWrap: "break-word",
                                    overflowWrap: "break-word",
                                    wordBreak: "break-word",
                                    flex: 1,
                                }}
                                onClick={() => setFocusedOn("title")}
                            >
                                {initialTitle}
                            </Typography>
                        )}
                        <TaskItemMenu
                            taskId={id}
                            onEditTask={() => setFocusedOn("title")}
                        />
                    </Box>
                    {isFocused ? (
                        <InputBase
                            multiline
                            fullWidth
                            size="small"
                            autoFocus={focusedOn === "details"}
                            sx={(theme) => ({
                                ...theme.typography.body2,
                                color: "text.secondary",
                                pl: 9,
                                py: 0,
                            })}
                            onFocus={(e) =>
                                previousFocusedOn === null &&
                                e.currentTarget.select()
                            }
                            value={detailsInput}
                            onChange={setDetailsInput}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    if (e.shiftKey) {
                                        return;
                                    }

                                    setFocusedOn(null);
                                    makeMutation();
                                }
                            }}
                        />
                    ) : (
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                whiteSpace: "pre-wrap",
                                wordWrap: "break-word",
                                overflowWrap: "break-word",
                                wordBreak: "break-word",
                                pl: 9,
                                pt: 0.75,
                            }}
                            onClick={() => setFocusedOn("details")}
                        >
                            {initialDetails}
                        </Typography>
                    )}
                </TaskContainer>
            )}
        </Draggable>
    );
}
