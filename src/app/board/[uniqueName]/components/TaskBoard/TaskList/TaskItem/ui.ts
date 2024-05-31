import { Box, InputBase, styled, Typography } from "@mui/material";

export const TaskItemContainer = styled(Box, {
    shouldForwardProp: (propName) =>
        propName !== "isDragging" && propName !== "isFocused",
})<{ isDragging: boolean; isFocused: boolean }>(
    ({ theme, isDragging, isFocused }) => ({
        backgroundColor: theme.palette.background.paper,
        paddingInline: theme.spacing(2.75),
        paddingBlock: theme.spacing(1.5),
        transition: theme.transitions.create("box-shadow", {
            duration: theme.transitions.duration.shortest,
        }),
        boxShadow: theme.shadows[0],
        "&:focus-visible": {
            outline: 0,
            backgroundColor: theme.palette.grey[100],
        },
        ":hover": {
            zIndex: 1,
            cursor: isFocused ? "default" : "pointer",
            boxShadow: theme.shadows[1],
        },
        ...(isFocused && {
            zIndex: 2,
            cursor: "default",
            boxShadow: theme.shadows[2],
            backgroundColor: theme.palette.grey[100],
        }),
        ...(isDragging && {
            zIndex: 3,
            boxShadow: theme.shadows[3],
        }),
    })
);

export const TaskItemTitleContainer = styled(Box)(({ theme }) => ({
    display: "flex",
    alignItems: "start",
    gap: theme.spacing(2),
}));

export const TaskItemTitleInput = styled(InputBase, {
    shouldForwardProp: (propName) => propName !== "isContainerFocused",
})<{ isContainerFocused: boolean }>(({ theme, isContainerFocused }) => ({
    ...theme.typography.subtitle1,
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
    paddingBlock: 0,
    paddingLeft: theme.spacing(9),
    color: theme.palette.text.secondary,
    ...(!isContainerFocused && {
        display: "none",
        visibility: "hidden",
        pointerEvents: "none",
    }),
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
    paddingTop: theme.spacing(0.75),
    ...(isContainerFocused && {
        display: "none",
        visibility: "hidden",
        pointerEvents: "none",
    }),
}));
