import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDisclosure, useInputState } from "@mantine/hooks";
import { Box, InputBase, Paper, Typography } from "@mui/material";
import { KeyboardEventHandler } from "react";
import { useDirection } from "../../../providers/DirectionProvider";
import { useTaskQuery } from "../../../providers/TaskQueryProvider";

export default function AddTaskList() {
    const { direction } = useDirection();
    const [isFocused, { open: focus, close: blur }] = useDisclosure(false);
    const [titleInput, setTitleInput] = useInputState("");
    const { addTaskList } = useTaskQuery();

    const makeMutation = () => {
        if (titleInput.length > 0) {
            addTaskList({ title: titleInput });
        }

        blur();
        setTitleInput("");
    };

    const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = (e) => {
        if (e.key === "Escape") {
            blur();
            setTitleInput("");
            return;
        }

        if (e.key === "Enter") {
            if (titleInput.length > 0) {
                addTaskList({ title: titleInput });
            }

            blur();
            setTitleInput("");
            return;
        }
    };

    return (
        <Paper
            tabIndex={-1}
            elevation={isFocused ? 1 : 0}
            sx={(theme) => ({
                px: 4,
                py: 3,
                display: "flex",
                alignItems: "center",
                width: "100%",
                height: theme.spacing(13),
                cursor: isFocused ? "default" : "pointer",
                ...(direction === "row" && {
                    minWidth: theme.spacing(80),
                    maxWidth: theme.spacing(80),
                }),
                ...(direction === "column" && {
                    minWidth: theme.spacing(180),
                    maxWidth: theme.spacing(180),
                    mb: theme.spacing(80),
                }),
            })}
            onFocus={focus}
            onBlur={makeMutation}
            onKeyDown={handleKeyDown}
        >
            {isFocused ? (
                <InputBase
                    autoFocus
                    fullWidth
                    size="small"
                    placeholder="New list"
                    inputProps={{ style: { padding: 0 } }}
                    value={titleInput}
                    onChange={setTitleInput}
                />
            ) : (
                <Box
                    color="text.secondary"
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: 2,
                        flex: 1,
                    }}
                >
                    <FontAwesomeIcon icon={faAdd} />
                    <Typography color="text.secondary">Add new list</Typography>
                </Box>
            )}
        </Paper>
    );
}
