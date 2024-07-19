import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useInputState } from "@mantine/hooks";
import { Typography } from "@mui/material";
import { useRef } from "react";
import { useTaskBoard } from "../../../providers/TaskBoardProvider";
import useContentEditable from "../hooks/useContentEditable";
import {
    TaskListPlaceholderContainer,
    TaskListPlaceholderInput,
    TaskListPlaceholderTextContainer,
} from "./ui";

export default function TaskListPlaceholder() {
    const [titleInput, setTitleInput] = useInputState("");
    const titleInputRef = useRef<HTMLTextAreaElement | null>(null);

    const { flowDirection, canUserCreateOrDeleteTaskList, addTaskList } =
        useTaskBoard();

    const { ref, isFocused, contentEditableProps } =
        useContentEditable<HTMLDivElement>({
            onFocus: () => titleInputRef.current?.focus(),
            onStateReset: () => setTitleInput(""),
            onEdit: () => {
                if (titleInput.length === 0) {
                    return;
                }

                addTaskList({ title: titleInput });
            },
        });

    if (!canUserCreateOrDeleteTaskList) {
        return null;
    }

    return (
        <TaskListPlaceholderContainer
            {...contentEditableProps}
            ref={ref}
            direction={flowDirection}
            isFocused={isFocused}
        >
            <TaskListPlaceholderInput
                inputRef={titleInputRef}
                isContainerFocused={isFocused}
                value={titleInput}
                onChange={setTitleInput}
                inputProps={{ style: { padding: 0 } }}
                placeholder="New list"
                size="small"
                fullWidth
            />
            <TaskListPlaceholderTextContainer isContainerFocused={isFocused}>
                <FontAwesomeIcon icon={faAdd} />
                <Typography color="inherit">Add new list</Typography>
            </TaskListPlaceholderTextContainer>
        </TaskListPlaceholderContainer>
    );
}
