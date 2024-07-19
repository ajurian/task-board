import { Box } from "@mui/material";
import { PropsWithChildren } from "react";

export default function BoardLayout({ children }: PropsWithChildren) {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                overflow: "auto",
                minHeight: "100vh",
                maxHeight: "100vh",
            }}
        >
            {children}
        </Box>
    );
}
