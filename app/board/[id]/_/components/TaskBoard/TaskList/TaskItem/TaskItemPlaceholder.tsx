import { useTaskBoard } from "@/board/[id]/_/providers/TaskBoardProvider";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useInputState } from "@mantine/hooks";
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

interface TaskItemPlaceholderProps {
    listId: string;
    taskCount: number;
}

export default function TaskItemPlaceholder({
    listId,
    taskCount,
}: TaskItemPlaceholderProps) {
    const [titleInput, setTitleInput] = useInputState("");
    const [detailsInput, setDetailsInput] = useInputState("");
    const titleInputRef = useRef<HTMLTextAreaElement | null>(null);
    const detailsInputRef = useRef<HTMLTextAreaElement | null>(null);

    const { maxTasks, canUserCreateOrDeleteTask, addTask } = useTaskBoard();

    const isEditDisabled = taskCount >= maxTasks;

    const { ref, isFocused, contentEditableProps } = useContentEditable({
        isEditDisabled,
        onFocus: () => titleInputRef.current?.focus(),
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
                <TaskItemTitleInput
                    inputRef={titleInputRef}
                    isContainerFocused={isFocused}
                    value={titleInput}
                    onChange={setTitleInput}
                    onFocus={(e) => e.currentTarget.select()}
                    onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
                    placeholder="Title"
                    size="small"
                    multiline
                    fullWidth
                />
                <TaskItemTitleText
                    isContainerFocused={isFocused}
                    variant="subtitle1"
                    sx={{ fontWeight: 500 }}
                >
                    Add new task
                </TaskItemTitleText>
            </TaskItemPlaceholderTitleContainer>
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
        </TaskItemPlaceholderContainer>
    );
}
