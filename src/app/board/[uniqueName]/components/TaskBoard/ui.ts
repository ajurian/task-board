import { Box, styled } from "@mui/material";
import { Direction } from "../../providers/DirectionProvider";

export const TaskBoardContainer = styled(Box)(({ theme }) => ({
    flex: 1,
    position: "relative",
    minWidth: "calc(100vw - (100vw - 100%))",
    width: "fit-content",
    paddingBlock: theme.spacing(4),
}));

export const TaskBoardHeaderWrapper = styled(Box, {
    shouldForwardProp: (propName) => propName !== "direction",
})<{ direction: Direction }>(({ theme, direction }) => ({
    display: "flex",
    justifyContent: "center",
    maxWidth: "100vw",
    position: "sticky",
    left: 0,
    marginBottom: theme.spacing(2),
    paddingInline: theme.spacing(6),
    ...(direction === "row" && {
        paddingRight: theme.spacing(4.75),
    }),
    ...(direction === "column" && {
        top: "calc(3.5625rem + 17px)",
        zIndex: theme.zIndex.appBar,
    }),
}));

export const TaskBoardHeaderContainer = styled(Box, {
    shouldForwardProp: (propName) => propName !== "direction",
})<{ direction: Direction }>(({ theme, direction }) => ({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    gap: theme.spacing(2),
    ...(direction === "column" && {
        backgroundColor: theme.palette.background.paper,
        borderRadius: theme.shape.borderRadius,
        boxShadow: theme.shadows[1],
        paddingBlock: theme.spacing(3),
        paddingLeft: theme.spacing(4),
        paddingRight: theme.spacing(2.75),
        maxWidth: theme.spacing(180),
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

export const TaskListAddContainer = styled(Box, {
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

export const TaskListAddTextContainer = styled(Box)(({ theme }) => ({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: theme.spacing(2),
    color: theme.palette.text.secondary,
    flex: 1,
}));
