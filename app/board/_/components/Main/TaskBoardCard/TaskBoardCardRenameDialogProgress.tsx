import { Box, LinearProgress } from "@mui/material";

interface TaskBoardCardRenameDialogProgressProps {
    isLoading: boolean;
}

export default function TaskBoardCardRenameDialogProgress({
    isLoading,
}: TaskBoardCardRenameDialogProgressProps) {
    if (!isLoading) {
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
