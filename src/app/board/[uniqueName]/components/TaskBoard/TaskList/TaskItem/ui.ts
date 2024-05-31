import { Box, styled } from "@mui/material";

export const TaskContainer = styled(Box, {
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
