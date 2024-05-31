import { Box, Button, Paper, styled } from "@mui/material";
import { Direction } from "../../../providers/DirectionProvider/DirectionProvider";

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

export const TaskListTitleContainer = styled(Box)(({ theme }) => ({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    overflowX: "hidden",
    gap: theme.spacing(2),
    paddingInline: theme.spacing(4),
    paddingBlock: theme.spacing(3),
    paddingRight: theme.spacing(2.75),
}));

export const AddTaskButton = styled(Button)(({ theme }) => ({
    justifyContent: "start",
    width: "100%",
    borderRadius: 0,
    paddingInline: theme.spacing(4),
    paddingBlock: theme.spacing(1.5),
}));

export const TaskItemsWrapper = styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    overflowY: "auto",
    paddingBlock: theme.spacing(1.5),
}));
