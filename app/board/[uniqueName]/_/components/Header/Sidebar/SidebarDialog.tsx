import ClientTaskBoardAPI from "@/api/_/layers/client/TaskBoardAPI";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    TextField,
} from "@mui/material";
import { FormEventHandler, useCallback } from "react";
import { z } from "zod";

interface SidebarDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SidebarDialog({ isOpen, onClose }: SidebarDialogProps) {
    const handleDialogSubmit: FormEventHandler<HTMLFormElement> = useCallback(
        (e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const uniqueName = z
                .string()
                .toLowerCase()
                .regex(/^[A-Za-z0-9\-_]*$/g)
                .parse(formData.get("uniqueName"));
            const displayName = z.string().parse(formData.get("displayName"));

            ClientTaskBoardAPI.post({ uniqueName, displayName });
        },
        []
    );

    return (
        <Dialog fullWidth maxWidth="xs" open={isOpen} onClose={onClose}>
            <form onSubmit={handleDialogSubmit}>
                <DialogContent
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                    }}
                >
                    <TextField
                        label="Identifier"
                        name="uniqueName"
                        variant="standard"
                        size="small"
                    />
                    <TextField
                        label="Display name"
                        name="displayName"
                        variant="standard"
                        size="small"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="submit">Add board</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
