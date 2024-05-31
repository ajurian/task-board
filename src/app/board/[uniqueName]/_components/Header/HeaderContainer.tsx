"use client";

import { styled } from "@mui/material";

const HeaderContainer = styled("header")(({ theme }) => ({
    display: "grid",
    gridTemplateRows: "1fr",
    gridTemplateColumns: "1fr auto 1fr",
    position: "sticky",
    top: 0,
    left: 0,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[1],
    paddingInline: theme.spacing(6),
    paddingBlock: theme.spacing(2.25),
    zIndex: theme.zIndex.appBar,
}));

export default HeaderContainer;
