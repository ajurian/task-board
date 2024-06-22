import { Box, styled } from "@mui/material";
import { Direction } from "../../_providers/DirectionProvider";

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
