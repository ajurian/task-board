import {
    TASK_DETAILS_MAX_LEN,
    TASK_TITLE_MAX_LEN,
} from "@/_/common/constants/constraints";
import { TaskBoardContextValue } from "@/board/[id]/_/providers/TaskBoardProvider/TaskBoardProviderTypes";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useInputState } from "@mantine/hooks";
import { Tooltip } from "@mui/material";
import { useRef } from "react";
import useContentEditable from "../../hooks/useContentEditable";
import {
    TaskItemDetailsInput,
    TaskItemPlaceholderContainer,
    TaskItemPlaceholderTIconWrapper,
    TaskItemPlaceholderTitleContainer,
    TaskItemTitleInput,
    TaskItemTitleText,
} from "./ui";

interface TaskItemPlaceholderProps
    extends Pick<
        TaskBoardContextValue,
        "maxTasks" | "canUserCreateOrDeleteTask" | "addTask"
    > {
    listId: string;
    taskCount: number;
}

export default function TaskItemPlaceholder({
    listId,
    taskCount,
    maxTasks,
    canUserCreateOrDeleteTask,
    addTask,
}: TaskItemPlaceholderProps) {
    const [titleInput, setTitleInput] = useInputState("");
    const [detailsInput, setDetailsInput] = useInputState("");
    const titleInputRef = useRef<HTMLTextAreaElement | null>(null);
    const detailsInputRef = useRef<HTMLTextAreaElement | null>(null);

    const isEditDisabled = taskCount >= maxTasks;

    const { ref, isFocused, contentEditableProps } = useContentEditable({
        isEditDisabled,
        onFocusAfter: () => titleInputRef.current?.focus(),
        onStateReset: () => {
            setTitleInput("");
            setDetailsInput("");
        },
        onEdit: () => {
            if (titleInput.length === 0) {
                return;
            }

            addTask({
                taskListId: listId,
                title: titleInput,
                details: detailsInput,
                dueAt: null,
            });
        },
    });

    if (!canUserCreateOrDeleteTask) {
        return null;
    }

    return (
        <Tooltip
            title={isEditDisabled ? "Maximum tasks is reached" : ""}
            followCursor
        >
            <TaskItemPlaceholderContainer
                {...contentEditableProps}
                ref={ref}
                isFocused={isFocused}
                isDisabled={isEditDisabled}
            >
                <TaskItemPlaceholderTitleContainer>
                    <TaskItemPlaceholderTIconWrapper>
                        <FontAwesomeIcon icon={faAdd} />
                    </TaskItemPlaceholderTIconWrapper>
                    {isFocused && (
                        <TaskItemTitleInput
                            inputRef={titleInputRef}
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
                    )}
                    {!isFocused && (
                        <TaskItemTitleText
                            shouldClampLine={false}
                            variant="subtitle1"
                            sx={{ fontWeight: 500 }}
                        >
                            Add new task
                        </TaskItemTitleText>
                    )}
                </TaskItemPlaceholderTitleContainer>
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
            </TaskItemPlaceholderContainer>
        </Tooltip>
    );
}
