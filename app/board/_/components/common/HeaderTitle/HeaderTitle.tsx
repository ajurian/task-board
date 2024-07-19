import { Box, Typography } from "@mui/material";
import Link from "next/link";

export default function HeaderTitle() {
    return (
        <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography
                component={Link}
                variant="h6"
                color="text.secondary"
                href="/board"
                sx={{ textDecoration: "none" }}
            >
                TaskBoard
            </Typography>
        </Box>
    );
}
