import { Box, LinearProgress } from "@mui/material";
import { useShareDialog } from "./ShareDialogProvider";

export default function ShareDialogProgress() {
    const { isSavingChanges } = useShareDialog();

    if (!isSavingChanges) {
        return null;
    }

    return (
        <Box
            sx={{
                position: "absolute",
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
            }}
        >
            <LinearProgress />
        </Box>
    );
}
