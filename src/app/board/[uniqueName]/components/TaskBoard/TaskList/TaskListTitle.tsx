import { useInputState } from "@mantine/hooks";
import { Box, InputBase, Typography } from "@mui/material";
import { KeyboardEventHandler } from "react";
import { useTaskQuery } from "../../../providers/TaskQueryProvider";

interface TaskListTitleProps {
    listId: string;
    title: string;
    isFocused: boolean;
    onFocus: () => void;
    onBlur: () => void;
}

export default function TaskListTitle({
    listId,
    title,
    isFocused,
    onFocus,
    onBlur,
}: TaskListTitleProps) {
    const { renameTaskList } = useTaskQuery();
    const [titleInput, setTitleInput] = useInputState(title);

    const makeMutation = () => {
        onBlur();

        if (titleInput.length > 0 && titleInput !== title) {
            renameTaskList({ id: listId, title: titleInput });
            return;
        }

        setTitleInput(title);
    };

    const handleKeyDown: KeyboardEventHandler<
        HTMLInputElement | HTMLTextAreaElement
    > = (e) => {
        if (e.key === "Escape") {
            onBlur();
            setTitleInput(title);
            return;
        }

        if (e.key === "Enter") {
            makeMutation();
            return;
        }
    };

    return (
        <Box
            sx={{
                overflowX: "auto",
                flexGrow: isFocused ? 1 : 0,
            }}
            onClick={onFocus}
            onBlur={makeMutation}
            tabIndex={-1}
        >
            {isFocused ? (
                <InputBase
                    autoFocus
                    fullWidth
                    size="small"
                    inputProps={{ style: { padding: 0 } }}
                    onFocus={(e) => e.currentTarget.select()}
                    onKeyDown={handleKeyDown}
                    onChange={setTitleInput}
                    value={titleInput}
                />
            ) : (
                <Typography sx={{ cursor: "text" }} noWrap>
                    {title}
                </Typography>
            )}
        </Box>
    );
}
