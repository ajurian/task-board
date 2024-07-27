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
import { TransitionEventHandler, useRef, useState } from "react";
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

    const titleInputRef = useRef<HTMLInputElement | null>(null);

    const handleTransitionEnd: TransitionEventHandler<HTMLDivElement> = (e) => {
        if (
            !(e.target as HTMLElement).classList.contains("MuiDialog-container")
        ) {
            return;
        }

        titleInputRef.current?.select();
        setTitle(initialTitle);
    };

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
        <Dialog
            fullWidth
            maxWidth="xs"
            open={isOpen}
            onClose={onClose}
            onTransitionEnd={handleTransitionEnd}
        >
            <TaskBoardCardRenameDialogProgress isLoading={isRenaming} />
            <DialogTitle>Rename</DialogTitle>
            <DialogContent>
                <OutlinedInput
                    inputRef={titleInputRef}
                    value={title}
                    onChange={setTitle}
                    size="small"
                    fullWidth
                    sx={{ mt: "1px" }}
                />
            </DialogContent>
            <DialogActions>
                <Button disabled={isRenaming} onClick={onClose}>
                    Cancel
                </Button>
                <Button disabled={isRenaming} onClick={handleDone}>
                    {title === initialTitle ? "Done" : "Save"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
