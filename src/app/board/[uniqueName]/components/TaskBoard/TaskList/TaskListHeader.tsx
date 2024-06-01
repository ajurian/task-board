import { useInputState } from "@mantine/hooks";
import { Box, InputBase, Typography } from "@mui/material";
import { useTaskQuery } from "../../../providers/TaskQueryProvider";
import useContentEditable from "../hooks/useContentEditable";
import TaskListMenu from "./TaskListMenu";
import {
    TaskListHeaderContainer,
    TaskListHeaderTitleInput,
    TaskListHeaderTitleText,
} from "./ui";
import { useRef } from "react";

interface TaskListHeaderProps {
    listId: string;
    title: string;
}

export default function TaskListHeader({ listId, title }: TaskListHeaderProps) {
    const [titleInput, setTitleInput] = useInputState(title);
    const titleInputRef = useRef<HTMLTextAreaElement | null>(null);

    const { renameTaskList } = useTaskQuery();

    const { ref, isFocused, contentEditableProps } = useContentEditable({
        onFocus: () => titleInputRef.current?.focus(),
        onStateReset: () => setTitleInput(title),
        onEdit: () => {
            if (titleInput.length > 0 && titleInput !== title) {
                renameTaskList({ id: listId, title: titleInput });
            }

            return true;
        },
    });

    return (
        <TaskListHeaderContainer>
            <Box
                {...contentEditableProps}
                ref={ref}
                tabIndex={-1}
                sx={{
                    overflowX: "auto",
                    flexGrow: isFocused ? 1 : 0,
                }}
            >
                <TaskListHeaderTitleInput
                    inputRef={titleInputRef}
                    isContainerFocused={isFocused}
                    value={titleInput}
                    onChange={setTitleInput}
                    onFocus={(e) => e.currentTarget.select()}
                    inputProps={{ style: { padding: 0 } }}
                    size="small"
                    fullWidth
                />
                <TaskListHeaderTitleText isContainerFocused={isFocused} noWrap>
                    {title}
                </TaskListHeaderTitleText>
            </Box>
            <TaskListMenu
                listId={listId}
                onRenameTitle={() => ref.current?.click()}
            />
        </TaskListHeaderContainer>
    );
}
