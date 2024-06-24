import { useTaskBoard } from "@/board/[uniqueName]/_/providers/TaskBoardProvider";
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
}

export default function TaskItemPlaceholder({
    listId,
}: TaskItemPlaceholderProps) {
    const [titleInput, setTitleInput] = useInputState("");
    const [detailsInput, setDetailsInput] = useInputState("");
    const titleInputRef = useRef<HTMLTextAreaElement | null>(null);
    const detailsInputRef = useRef<HTMLTextAreaElement | null>(null);

    const { addTask } = useTaskBoard();

    const { ref, isFocused, contentEditableProps } = useContentEditable({
        onFocus: () => titleInputRef.current?.focus(),
        onStateReset: () => {
            setTitleInput("");
            setDetailsInput("");
        },
        onEdit: (e) => {
            if (
                e !== null &&
                e.target === detailsInputRef.current &&
                e.shiftKey
            ) {
                return false;
            }

            if (titleInput.length > 0 && detailsInput.length > 0) {
                addTask({
                    taskListId: listId,
                    title: titleInput,
                    details: detailsInput,
                    dueAt: null,
                });
            }

            return true;
        },
    });

    return (
        <TaskItemPlaceholderContainer
            {...contentEditableProps}
            ref={ref}
            isFocused={isFocused}
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
