import ClientTaskBoardAPI from "@/api/_/common/layers/client/TaskBoardAPI";
import { useTaskBoards } from "@/board/_/providers/TaskBoardsProvider";
import { useInputState } from "@mantine/hooks";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    OutlinedInput,
} from "@mui/material";
import { useState } from "react";
import TaskBoardCardRenameDialogProgress from "./TaskBoardCardRenameDialogProgress";

interface TaskBoardCardRenameDialogProps {
    boardId: string;
    initialTitle: string;
    isOpen: boolean;
    onClose: () => void;
}

export default function TaskBoardCardRenameDialog({
    boardId,
    initialTitle,
    isOpen,
    onClose,
}: TaskBoardCardRenameDialogProps) {
    const [title, setTitle] = useInputState(initialTitle);
    const [isRenaming, setIsRenaming] = useState(false);
    const { refreshData } = useTaskBoards();

    const handleDone = async () => {
        if (initialTitle === title) {
            onClose();
            return;
        }

        setIsRenaming(true);

        await ClientTaskBoardAPI.patch(boardId, { displayName: title });
        await refreshData();

        setIsRenaming(false);
        onClose();
    };

    return (
        <Dialog fullWidth maxWidth="xs" open={isOpen} onClose={onClose}>
            <TaskBoardCardRenameDialogProgress isLoading={isRenaming} />
            <DialogTitle>Rename</DialogTitle>
            <DialogContent>
                <OutlinedInput
                    fullWidth
                    size="small"
                    value={title}
                    onChange={setTitle}
                />
            </DialogContent>
            <DialogActions>
                <Button disabled={isRenaming} onClick={onClose}>
                    Cancel
                </Button>
                <Button disabled={isRenaming} onClick={handleDone}>
                    Done
                </Button>
            </DialogActions>
        </Dialog>
    );
}
