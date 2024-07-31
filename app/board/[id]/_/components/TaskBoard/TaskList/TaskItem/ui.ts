import { Box, InputBase, styled, Typography } from "@mui/material";

export const TaskItemFade = styled(Box, {
    shouldForwardProp: (propName) => propName !== "shouldFadeOut",
})<{ shouldFadeOut: boolean }>(({ theme, shouldFadeOut }) => ({
    opacity: shouldFadeOut ? 0 : 1,
    transition: theme.transitions.create("opacity", {
        duration: theme.transitions.duration.leavingScreen,
    }),
}));

export const TaskItemContainer = styled(Box, {
    shouldForwardProp: (propName) =>
        propName !== "isDragging" &&
        propName !== "isFocused" &&
        propName !== "isDragDisabled",
})<{ isDragging: boolean; isFocused: boolean; isDragDisabled: boolean }>(
    ({ theme, isDragging, isFocused, isDragDisabled }) => ({
        WebkitTapHighlightColor: "transparent",
        position: "relative",
        paddingInline: theme.spacing(2.75),
        paddingBlock: theme.spacing(1.5),
        display: "flex",
        flexDirection: "column",
        transition: theme.transitions.create(
            ["box-shadow", "background-color"],
            {
                duration: theme.transitions.duration.shortest,
            }
        ),
        boxShadow: theme.shadows[0],
        backgroundColor: theme.palette.background.paper,
        cursor: isDragDisabled ? "inherit" : "pointer",
        ":focus-visible": {
            outline: 0,
            backgroundColor: theme.palette.grey[100],
        },
        ...(!isFocused && {
            ":hover": {
                zIndex: 1,
                backgroundColor: theme.palette.grey[100],
            },
        }),
        ...(isFocused && {
            zIndex: 2,
            cursor: "default",
            boxShadow: theme.shadows[1],
            backgroundColor: theme.palette.grey[200],
        }),
        ...(isDragging && {
            zIndex: 3,
            boxShadow: theme.shadows[2],
            backgroundColor: theme.palette.grey[100],
        }),
    })
);

export const TaskItemCompletedContainer = styled(Box)(({ theme }) => ({
    paddingInline: theme.spacing(2.75),
    paddingBlock: theme.spacing(1.5),
    backgroundColor: theme.palette.background.paper,
}));

export const TaskItemTitleContainer = styled(Box)(({ theme }) => ({
    display: "flex",
    alignItems: "start",
    gap: theme.spacing(2),
}));

export const TaskItemTitleInput = styled(InputBase, {
    shouldForwardProp: (propName) => propName !== "isContainerFocused",
})<{ isContainerFocused: boolean }>(({ theme, isContainerFocused }) => ({
    ...theme.typography.subtitle1,
    minHeight: "1lh",
    paddingBlock: 0,
    ...(!isContainerFocused && {
        display: "none",
        visibility: "hidden",
        pointerEvents: "none",
    }),
}));

export const TaskItemTitleText = styled(Typography, {
    shouldForwardProp: (propName) => propName !== "isContainerFocused",
})<{ isContainerFocused: boolean }>(({ isContainerFocused }) => ({
    flex: 1,
    whiteSpace: "pre-wrap",
    wordWrap: "break-word",
    overflowWrap: "break-word",
    wordBreak: "break-word",
    ...(isContainerFocused && {
        display: "none",
        visibility: "hidden",
        pointerEvents: "none",
    }),
}));

export const TaskItemDetailsInput = styled(InputBase, {
    shouldForwardProp: (propName) => propName !== "isContainerFocused",
})<{ isContainerFocused: boolean }>(({ theme, isContainerFocused }) => ({
    ...theme.typography.body2,
    minHeight: "1lh",
    paddingBlock: 0,
    paddingLeft: theme.spacing(9),
    color: theme.palette.text.secondary,
    ...(!isContainerFocused && {
        display: "none",
        visibility: "hidden",
        pointerEvents: "none",
    }),
}));

export const TaskItemLoadingWrapper = styled(Box)(({ theme }) => ({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: theme.palette.text.secondary,
    padding: theme.spacing(1.25),
}));

export const TaskItemDetailsText = styled(Typography, {
    shouldForwardProp: (propName) => propName !== "isContainerFocused",
})<{ isContainerFocused: boolean }>(({ theme, isContainerFocused }) => ({
    whiteSpace: "pre-wrap",
    wordWrap: "break-word",
    overflowWrap: "break-word",
    wordBreak: "break-word",
    color: theme.palette.text.secondary,
    paddingLeft: theme.spacing(9),
    ...(isContainerFocused && {
        display: "none",
        visibility: "hidden",
        pointerEvents: "none",
    }),
}));

export const TaskItemPlaceholderContainer = styled(Box, {
    shouldForwardProp: (propName) => propName !== "isFocused",
})<{ isFocused: boolean }>(({ theme, isFocused }) => ({
    WebkitTapHighlightColor: "transparent",
    paddingInline: theme.spacing(2.75),
    paddingBlock: theme.spacing(1.5),
    color: theme.palette.primary.main,
    transition: theme.transitions.create(["box-shadow", "background-color"], {
        duration: theme.transitions.duration.shortest,
    }),
    boxShadow: theme.shadows[0],
    backgroundColor: theme.palette.background.paper,
    ":focus-visible": {
        outline: 0,
        backgroundColor: theme.palette.grey[100],
    },
    ...(isFocused && {
        zIndex: 2,
        cursor: "default",
        boxShadow: theme.shadows[1],
        backgroundColor: theme.palette.grey[200],
    }),
    ...(!isFocused && {
        ":hover": {
            zIndex: 1,
            cursor: "pointer",
            backgroundColor: theme.palette.grey[100],
        },
    }),
}));

export const TaskItemPlaceholderTitleContainer = styled(Box)(({ theme }) => ({
    display: "flex",
    alignItems: "start",
    gap: theme.spacing(2),
    paddingRight: theme.spacing(9),
}));

export const TaskItemPlaceholderTIconWrapper = styled(Box)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    aspectRatio: "1 / 1",
    fontSize: "1.125rem",
    paddingInline: theme.spacing(1.25),
}));
