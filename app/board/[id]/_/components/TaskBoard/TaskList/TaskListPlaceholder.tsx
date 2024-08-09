import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useInputState } from "@mantine/hooks";
import { Tooltip, Typography } from "@mui/material";
import { useRef } from "react";
import { useTaskBoard } from "../../../providers/TaskBoardProvider";
import useContentEditable from "../hooks/useContentEditable";
import {
    TaskListPlaceholderContainer,
    TaskListPlaceholderInput,
    TaskListPlaceholderTextContainer,
} from "./ui";

interface TaskListPlaceholderProps {
    taskListCount: number;
}

export default function TaskListPlaceholder({
    taskListCount,
}: TaskListPlaceholderProps) {
    const [titleInput, setTitleInput] = useInputState("");
    const titleInputRef = useRef<HTMLTextAreaElement | null>(null);

    const {
        flowDirection,
        maxTaskLists,
        canUserCreateOrDeleteTaskList,
        addTaskList,
    } = useTaskBoard();

    const isEditDisabled = taskListCount >= maxTaskLists;

    const { ref, isFocused, contentEditableProps } =
        useContentEditable<HTMLDivElement>({
            isFocusable: !isEditDisabled,
            isEditDisabled,
            onFocusAfter: () => titleInputRef.current?.focus(),
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
        <Tooltip
            title={isEditDisabled ? "Maximum task lists is reached" : ""}
            followCursor
        >
            <TaskListPlaceholderContainer
                {...contentEditableProps}
                ref={ref}
                direction={flowDirection}
                isFocused={isFocused}
                isDisabled={isEditDisabled}
            >
                {isFocused && (
                    <TaskListPlaceholderInput
                        inputRef={titleInputRef}
                        value={titleInput}
                        onChange={setTitleInput}
                        inputProps={{ style: { padding: 0 } }}
                        placeholder="New list"
                        size="small"
                        fullWidth
                    />
                )}
                {!isFocused && (
                    <TaskListPlaceholderTextContainer>
                        <FontAwesomeIcon icon={faAdd} />
                        <Typography color="inherit">Add new list</Typography>
                    </TaskListPlaceholderTextContainer>
                )}
            </TaskListPlaceholderContainer>
        </Tooltip>
    );
}
