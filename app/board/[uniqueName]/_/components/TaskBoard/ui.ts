import { Box, InputBase, styled, Typography } from "@mui/material";
import { Direction } from "../../providers/DirectionProvider";

export const TaskBoardContainer = styled(Box)(({ theme }) => ({
    flex: 1,
    position: "relative",
    minWidth: "calc(100vw - (100vw - 100%))",
    width: "fit-content",
    paddingBlock: theme.spacing(4),
}));

export const TaskBoardHeaderContainer = styled(Box, {
    shouldForwardProp: (propName) => propName !== "direction",
})<{ direction: Direction }>(({ theme, direction }) => ({
    display: "flex",
    justifyContent: "center",
    marginInline: "auto",
    position: "sticky",
    left: 0,
    marginBottom: theme.spacing(2),
    ...(direction === "row" && {
        paddingInline: theme.spacing(6),
        paddingRight: theme.spacing(4.75),
        maxWidth: "100vw",
    }),
    ...(direction === "column" && {
        top: "calc(3.5625rem + 17px)",
        zIndex: theme.zIndex.appBar,
        backgroundColor: theme.palette.background.paper,
        borderRadius: theme.shape.borderRadius,
        boxShadow: theme.shadows[1],
        maxWidth: theme.spacing(180),
        paddingBlock: theme.spacing(3),
        paddingLeft: theme.spacing(4),
        paddingRight: theme.spacing(2.75),
    }),
}));

export const TaskBoardHeaderDisplayNameContainer = styled(Box)(({ theme }) => ({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    gap: theme.spacing(2),
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
})<{ direction: Direction }>(({ theme, direction }) => ({
    display: "flex",
    flexDirection: direction,
    alignItems: direction === "row" ? "start" : "center",
    paddingInline: theme.spacing(6),
}));
