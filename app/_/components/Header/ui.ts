"use client";

import { Box, styled } from "@mui/material";

export const HeaderContainer = styled(Box)(() => ({
    height: "100vh",
}));

export const HeaderNavContainer = styled(Box)(({ theme }) => ({
    position: "sticky",
    top: 0,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[1],
    paddingInline: theme.spacing(6),
    paddingBlock: theme.spacing(2.6875),
    zIndex: theme.zIndex.appBar,
}));
