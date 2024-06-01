import { Box, InputBase, styled, Typography } from "@mui/material";

export const TaskItemContainer = styled(Box, {
    shouldForwardProp: (propName) =>
        propName !== "isDragging" && propName !== "isFocused",
})<{ isDragging: boolean; isFocused: boolean }>(
    ({ theme, isDragging, isFocused }) => ({
        paddingInline: theme.spacing(2.75),
        paddingBlock: theme.spacing(1.5),
        transition: theme.transitions.create(
            ["box-shadow", "background-color"],
            {
                duration: theme.transitions.duration.shortest,
            }
        ),
        boxShadow: theme.shadows[0],
        backgroundColor: theme.palette.background.paper,
        "&:focus-visible": {
            outline: 0,
            backgroundColor: theme.palette.grey[100],
        },
        ...(!isFocused && {
            ":hover": {
                zIndex: 1,
                cursor: "pointer",
                boxShadow: theme.shadows[1],
            },
        }),
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

export const TaskItemPlaceholderContainer = styled(Box, {
    shouldForwardProp: (propName) => propName !== "isFocused",
})<{ isFocused: boolean }>(({ theme, isFocused }) => ({
    paddingInline: theme.spacing(2.75),
    paddingBlock: theme.spacing(1.5),
    color: theme.palette.primary.main,
    transition: theme.transitions.create(["box-shadow", "background-color"], {
        duration: theme.transitions.duration.shortest,
    }),
    boxShadow: theme.shadows[0],
    backgroundColor: theme.palette.background.paper,
    "&:focus-visible": {
        outline: 0,
        backgroundColor: theme.palette.grey[50],
    },
    ...(isFocused && {
        zIndex: 2,
        cursor: "default",
        boxShadow: theme.shadows[2],
        backgroundColor: theme.palette.grey[100],
    }),
    ...(!isFocused && {
        ":hover": {
            zIndex: 1,
            cursor: "pointer",
            backgroundColor: theme.palette.grey[50],
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
