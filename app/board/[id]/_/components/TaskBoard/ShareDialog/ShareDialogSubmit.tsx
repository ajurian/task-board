import { Button } from "@mui/material";
import { useShareDialog } from "./ShareDialogProvider";

interface ShareDialogSubmitProps {
    onClose: () => void;
}

export default function ShareDialogSubmit({ onClose }: ShareDialogSubmitProps) {
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
        <Button disabled={isSavingChanges} onClick={handleClick}>
            {isChangesSaved ? "Done" : "Save"}
        </Button>
    );
}
