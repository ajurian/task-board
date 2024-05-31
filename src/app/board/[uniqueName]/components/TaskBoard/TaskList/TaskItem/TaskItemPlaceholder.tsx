import { useTaskQuery } from "@/app/board/[uniqueName]/providers/TaskQueryProvider";
import { useInputState } from "@mantine/hooks";
import { Box, InputBase } from "@mui/material";
import { forwardRef, useLayoutEffect, useRef } from "react";
import { TaskContainer } from "./ui";

interface TaskItemPlaceholderProps {
    listId: string;
    isVisible: boolean;
    onHide: () => void;
}

const TaskItemPlaceholder = forwardRef<
    HTMLDivElement,
    TaskItemPlaceholderProps
>(({ listId, isVisible, onHide }, ref) => {
    const [titleInput, setTitleInput] = useInputState("");
    const [detailsInput, setDetailsInput] = useInputState("");
    const { addTask } = useTaskQuery();

    const titleInputRef = useRef<HTMLTextAreaElement | null>(null);
    const detailsInputRef = useRef<HTMLTextAreaElement | null>(null);

    useLayoutEffect(() => {
        if (isVisible) {
            return;
        }

        setTitleInput("");
        setDetailsInput("");

        if (titleInput.length === 0 || detailsInput.length === 0) {
            return;
        }

        addTask({
            taskListId: listId,
            title: titleInput,
            details: detailsInput,
            dueAt: null,
        });
    }, [
        listId,
        isVisible,
        titleInput,
        detailsInput,
        addTask,
        setTitleInput,
        setDetailsInput,
    ]);

    return (
        isVisible && (
            <TaskContainer ref={ref} isDragging={false} isFocused={true}>
                <Box sx={{ display: "flex", alignItems: "start", gap: 2 }}>
                    <InputBase
                        ref={titleInputRef}
                        multiline
                        fullWidth
                        autoFocus
                        size="small"
                        sx={(theme) => ({
                            ...theme.typography.subtitle1,
                            px: 9,
                            py: 0,
                        })}
                        placeholder="Title"
                        value={titleInput}
                        onChange={setTitleInput}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                onHide();
                            }
                        }}
                    />
                </Box>
                <InputBase
                    ref={detailsInputRef}
                    multiline
                    fullWidth
                    size="small"
                    sx={(theme) => ({
                        ...theme.typography.body2,
                        color: "text.secondary",
                        pl: 9,
                        py: 0,
                    })}
                    placeholder="Details"
                    value={detailsInput}
                    onChange={setDetailsInput}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            if (e.shiftKey) {
                                return;
                            }

                            onHide();
                        }
                    }}
                />
            </TaskContainer>
        )
    );
});
TaskItemPlaceholder.displayName = "TaskItemPlaceholder";

export default TaskItemPlaceholder;
