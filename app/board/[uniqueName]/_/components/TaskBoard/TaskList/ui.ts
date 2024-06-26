import { Box, Button, InputBase, styled, Typography } from "@mui/material";
import { Direction } from "../../../providers/DirectionProvider";

export const TaskListContainer = styled(Box, {
    shouldForwardProp: (propName) => propName !== "direction",
})<{ direction: Direction }>(({ theme, direction }) => ({
    width: "100%",
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[1],
    transition: theme.transitions.create("box-shadow", {
        duration: theme.transitions.duration.shortest,
    }),
    ...(direction === "row" && {
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        maxHeight: "calc(100vh - 7.0625rem - 17px)",
        minWidth: theme.spacing(80),
        maxWidth: theme.spacing(80),
        marginRight: theme.spacing(4),
    }),
    ...(direction === "column" && {
        minWidth: theme.spacing(180),
        maxWidth: theme.spacing(180),
        marginBottom: theme.spacing(2),
    }),
    ":hover": {
        cursor: "default",
    },
    ":focus-visible": {
        outline: 0,
        boxShadow: theme.shadows[4],
    },
}));

export const TaskListHeaderContainer = styled(Box)(({ theme }) => ({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    overflowX: "hidden",
    flexShrink: 0,
    gap: theme.spacing(2),
    paddingInline: theme.spacing(4),
    paddingBlock: theme.spacing(3),
    paddingRight: theme.spacing(2.75),
}));

export const TaskListHeaderTitleContainer = styled(Box, {
    shouldForwardProp: (propName) => propName !== "isFocused",
})<{ isFocused: boolean }>(({ isFocused }) => ({
    overflowX: "auto",
    flexGrow: isFocused ? 1 : 0,
    ":focus-visible": {
        outline: 0,
    },
}));

export const TaskListHeaderTitleInput = styled(InputBase, {
    shouldForwardProp: (propName) => propName !== "isContainerFocused",
})<{ isContainerFocused: boolean }>(({ isContainerFocused }) => ({
    ...(!isContainerFocused && {
        display: "none",
        visibility: "hidden",
        pointerEvents: "none",
    }),
}));

export const TaskListHeaderTitleText = styled(Typography, {
    shouldForwardProp: (propName) => propName !== "isContainerFocused",
})<{ isContainerFocused: boolean }>(({ isContainerFocused }) => ({
    cursor: "text",
    ...(isContainerFocused && {
        display: "none",
        visibility: "hidden",
        pointerEvents: "none",
    }),
}));

export const TaskListHeaderLoadingWrapper = styled(Box)(({ theme }) => ({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: theme.palette.text.secondary,
    padding: theme.spacing(1.25),
}));

export const AddTaskButton = styled(Button)(({ theme }) => ({
    justifyContent: "start",
    width: "100%",
    borderRadius: 0,
    paddingInline: theme.spacing(4),
    paddingBlock: theme.spacing(1.5),
}));

export const TaskListPlaceholderContainer = styled(Box, {
    shouldForwardProp: (propName) =>
        propName !== "direction" && propName !== "isFocused",
})<{ direction: Direction; isFocused: boolean }>(
    ({ theme, direction, isFocused }) => ({
        display: "flex",
        alignItems: "center",
        width: "100%",
        cursor: "pointer",
        boxShadow: "none",
        transition: theme.transitions.create("box-shadow", {
            duration: theme.transitions.duration.shortest,
        }),
        borderRadius: theme.shape.borderRadius,
        backgroundColor: theme.palette.background.paper,
        paddingInline: theme.spacing(4),
        paddingBlock: theme.spacing(3),
        height: theme.spacing(13),
        ...(direction === "row" && {
            minWidth: theme.spacing(80),
            maxWidth: theme.spacing(80),
        }),
        ...(direction === "column" && {
            minWidth: theme.spacing(180),
            maxWidth: theme.spacing(180),
            marginBottom: theme.spacing(80),
        }),
        ...(isFocused && {
            cursor: "default",
            boxShadow: theme.shadows[1],
        }),
        ":focus-visible": {
            outline: 0,
            boxShadow: theme.shadows[1],
        },
    })
);

export const TaskListPlaceholderInput = styled(InputBase, {
    shouldForwardProp: (propName) => propName !== "isContainerFocused",
})<{ isContainerFocused: boolean }>(({ isContainerFocused }) => ({
    ...(!isContainerFocused && {
        display: "none",
        visibility: "hidden",
        pointerEvents: "none",
    }),
}));

export const TaskListPlaceholderTextContainer = styled(Box, {
    shouldForwardProp: (propName) => propName !== "isContainerFocused",
})<{ isContainerFocused: boolean }>(({ theme, isContainerFocused }) => ({
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: theme.spacing(2),
    color: theme.palette.text.secondary,
    ...(isContainerFocused && {
        display: "none",
        visibility: "hidden",
        pointerEvents: "none",
    }),
}));

export const TaskListCompletedItemsContainer = styled(Box)(({ theme }) => ({
    overflow: "hidden",
    flexShrink: 0,
    marginBottom: theme.spacing(2),
}));

export const TaskListCompletedItemsTrigger = styled(Button)(({ theme }) => ({
    borderRadius: 0,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "0.875rem",
    width: "100%",
    color: theme.palette.text.secondary,
    paddingInline: theme.spacing(4),
    paddingBlock: theme.spacing(2),
    gap: theme.spacing(2),
}));

export const TaskListCompletedItemsTriggerText = styled(Typography)(() => ({
    fontWeight: 500,
}));

export const TaskListCompletedItemsTriggerIcon = styled(Box, {
    shouldForwardProp: (propName) => propName !== "isOpen",
})<{ isOpen: boolean }>(({ theme, isOpen }) => ({
    rotate: isOpen ? "90deg" : "-90deg",
    transition: theme.transitions.create("rotate"),
}));

export const TaskListCompletedItemsWrapper = styled(Box, {
    shouldForwardProp: (propName) =>
        propName !== "height" && propName !== "isOpen",
})<{ height: number; isOpen: boolean }>(({ theme, height, isOpen }) => ({
    height,
    transition: theme.transitions.create("max-height"),
    maxHeight: isOpen ? Math.min(height, 200) : 0,
    overflowY: "auto",
}));

export const TaskListItemsContainer = styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    overflowY: "auto",
    paddingBlock: theme.spacing(1.5),
}));
