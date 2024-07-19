import { Box, styled } from "@mui/material";

export const Wrapper = styled(Box)(() => ({ height: "100vh" }));

export const Container = styled(Box)(({ theme }) => ({
    position: "relative",
    left: "50%",
    top: "10%",
    translate: "-50% 0",
    width: "100%",
    maxWidth: theme.spacing(128),
    padding: theme.spacing(6),
}));
