"use client";

import { Box, styled } from "@mui/material";

const HeaderContainer = styled(Box)(({ theme }) => ({
    display: "grid",
    gridTemplateRows: "1fr",
    position: "sticky",
    gridTemplateColumns: "1fr 1fr",
    left: 0,
    top: 0,
    borderBottomStyle: "solid",
    borderBottomWidth: 1,
    borderBottomColor: theme.palette.divider,
    backgroundColor: theme.palette.background.paper,
    paddingInline: theme.spacing(6),
    paddingBlock: theme.spacing(2.25),
    gap: theme.spacing(2),
    zIndex: theme.zIndex.appBar,
    [theme.breakpoints.up("sm")]: {
        gridTemplateColumns: "1fr auto 1fr",
    },
}));

export default HeaderContainer;
