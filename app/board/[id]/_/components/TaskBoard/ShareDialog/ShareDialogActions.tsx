import { Button, DialogActions } from "@mui/material";
import { useShareDialog } from "./ShareDialogProvider";

interface ShareDialogActionsProps {
    onClose: () => void;
}

export default function ShareDialogActions({
    onClose,
}: ShareDialogActionsProps) {
    const { isSavingChanges, isChangesSaved, saveChanges } = useShareDialog();

    const handleClick = async () => {
        if (isChangesSaved) {
            onClose();
            return;
        }

        await saveChanges();
        onClose();
    };

    return (
        <DialogActions>
            <Button disabled={isSavingChanges} onClick={handleClick}>
                {isChangesSaved ? "Done" : "Save"}
            </Button>
        </DialogActions>
    );
}
