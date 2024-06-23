import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useInputState } from "@mantine/hooks";
import { Typography } from "@mui/material";
import { useRef } from "react";
import { useDirection } from "../../../providers/DirectionProvider";
import { useTaskQuery } from "../../../providers/TaskQueryProvider";
import useContentEditable from "../hooks/useContentEditable";
import {
    TaskListPlaceholderContainer,
    TaskListPlaceholderInput,
    TaskListPlaceholderTextContainer,
} from "./ui";

export default function TaskListPlaceholder() {
    const [titleInput, setTitleInput] = useInputState("");
    const titleInputRef = useRef<HTMLTextAreaElement | null>(null);

    const { direction } = useDirection();
    const { addTaskList } = useTaskQuery();

    const { ref, isFocused, contentEditableProps } =
        useContentEditable<HTMLDivElement>({
            onStateReset: () => setTitleInput(""),
            onEdit: () => {
                if (titleInput.length > 0) {
                    addTaskList({ title: titleInput });
                }

                return true;
            },
        });

    return (
        <TaskListPlaceholderContainer
            {...contentEditableProps}
            ref={ref}
            direction={direction}
            isFocused={isFocused}
        >
            {isFocused ? (
                <TaskListPlaceholderInput
                    inputRef={titleInputRef}
                    isContainerFocused={isFocused}
                    value={titleInput}
                    onChange={setTitleInput}
                    inputProps={{ style: { padding: 0 } }}
                    placeholder="New list"
                    size="small"
                    autoFocus
                    fullWidth
                />
            ) : (
                <TaskListPlaceholderTextContainer
                    isContainerFocused={isFocused}
                >
                    <FontAwesomeIcon icon={faAdd} />
                    <Typography color="inherit">Add new list</Typography>
                </TaskListPlaceholderTextContainer>
            )}
        </TaskListPlaceholderContainer>
    );
}
