import { useInputState } from "@mantine/hooks";
import { Box, InputBase, Typography } from "@mui/material";
import { useTaskQuery } from "../../../providers/TaskQueryProvider";
import useContentEditable from "../hooks/useContentEditable";
import TaskListMenu from "./TaskListMenu";
import { TaskListTitleContainer } from "./ui";

interface TaskListTitleProps {
    listId: string;
    title: string;
}

export default function TaskListTitle({ listId, title }: TaskListTitleProps) {
    const [titleInput, setTitleInput] = useInputState(title);
    const { renameTaskList } = useTaskQuery();

    const { ref, isFocused, contentEditableProps } = useContentEditable({
        onCancel: () => setTitleInput(title),
        onEdit: () => {
            if (titleInput.length > 0 && titleInput !== title) {
                renameTaskList({ id: listId, title: titleInput });
            }

            return true;
        },
    });

    return (
        <TaskListTitleContainer>
            <Box
                {...contentEditableProps}
                ref={ref}
                tabIndex={-1}
                sx={{
                    overflowX: "auto",
                    flexGrow: isFocused ? 1 : 0,
                }}
            >
                {isFocused ? (
                    <InputBase
                        autoFocus
                        fullWidth
                        size="small"
                        inputProps={{ style: { padding: 0 } }}
                        onFocus={(e) => e.currentTarget.select()}
                        onChange={setTitleInput}
                        value={titleInput}
                    />
                ) : (
                    <Typography sx={{ cursor: "text" }} noWrap>
                        {title}
                    </Typography>
                )}
            </Box>
            <TaskListMenu
                listId={listId}
                onRenameTitle={() => ref.current?.click()}
            />
        </TaskListTitleContainer>
    );
}
