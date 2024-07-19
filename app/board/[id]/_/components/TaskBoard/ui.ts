import { Box, InputBase, styled, Typography } from "@mui/material";
import { FlowDirection } from "@prisma/client";

export const TaskBoardWrapper = styled(Box)(({ theme }) => ({
    position: "relative",
    minWidth: "calc(100vw - (100vw - 100%))",
    width: "fit-content",
    flex: 1,
    backgroundColor: theme.palette.grey[50],
}));

export const TaskBoardContainer = styled(Box, {
    shouldForwardProp: (propName) => propName !== "direction",
})<{ direction: FlowDirection }>(({ theme, direction }) => ({
    backgroundColor: theme.palette.grey[50],
    paddingBlock: theme.spacing(4),
    paddingInline: theme.spacing(6),
    ...(direction === "row" && {
        minWidth: "100vw",
    }),
    ...(direction === "column" && {
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        marginInline: "auto",
        maxWidth: theme.spacing(180),
    }),
}));

export const TaskBoardHeaderContainer = styled(Box, {
    shouldForwardProp: (propName) => propName !== "direction",
})<{ direction: FlowDirection }>(({ theme, direction }) => ({
    width: "100%",
    position: "sticky",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: theme.spacing(2),
    marginBottom: theme.spacing(2),
    ...(direction === "row" && {
        left: theme.spacing(6),
        maxWidth: `calc(100vw - ${theme.spacing(12)})`,
    }),
    ...(direction === "column" && {
        marginInline: "auto",
        top: "calc(3.5625rem + 18px)",
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: theme.palette.divider,
        backgroundColor: theme.palette.background.paper,
        borderRadius: theme.shape.borderRadius,
        zIndex: theme.zIndex.appBar,
        paddingBlock: theme.spacing(3),
        paddingLeft: theme.spacing(4),
        paddingRight: theme.spacing(2.75),
    }),
}));

export const TaskBoardHeaderDisplayNameContainer = styled(Box, {
    shouldForwardProp: (propName) => propName !== "isFocused",
})<{ isFocused: boolean }>(({ isFocused }) => ({
    overflowX: "auto",
    flexGrow: isFocused ? 1 : 0,
}));

export const TaskBoardHeaderDisplayNameText = styled(Typography, {
    shouldForwardProp: (propName) => propName !== "isContainerFocused",
})<{ isContainerFocused: boolean }>(({ theme, isContainerFocused }) => ({
    color: theme.palette.text.secondary,
    fontWeight: 400,
    cursor: "text",
    ...(isContainerFocused && {
        display: "none",
        visibility: "hidden",
        pointerEvents: "none",
    }),
}));

export const TaskBoardHeaderDisplayNameInput = styled(InputBase, {
    shouldForwardProp: (propName) => propName !== "isContainerFocused",
})<{ isContainerFocused: boolean }>(({ theme, isContainerFocused }) => ({
    ...theme.typography.h6,
    color: theme.palette.text.secondary,
    fontWeight: 400,
    ...(!isContainerFocused && {
        display: "none",
        visibility: "hidden",
        pointerEvents: "none",
    }),
}));

export const TaskBoardListContainer = styled(Box, {
    shouldForwardProp: (propName) => propName !== "direction",
})<{ direction: FlowDirection }>(({ direction }) => ({
    display: "flex",
    flexDirection: direction,
    alignItems: direction === "row" ? "start" : "center",
}));
