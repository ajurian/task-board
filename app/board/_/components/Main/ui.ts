import { Box, ButtonBase, styled, Typography } from "@mui/material";
import Link from "next/link";

export const MainContainer = styled(Box)(() => ({
    display: "flex",
    flexDirection: "column",
}));

export const NewTaskBoardContainer = styled(Box)(({ theme }) => ({
    display: "flex",
    justifyContent: "center",
    backgroundColor: theme.palette.grey[100],
    paddingInline: theme.spacing(6),
    paddingBlock: theme.spacing(4),
}));

export const NewTaskBoardCard = styled(ButtonBase)(({ theme }) => ({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "2rem",
    cursor: "pointer",
    backgroundColor: "white",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: theme.palette.divider,
    color: theme.palette.text.disabled,
    height: theme.spacing(1.27375 * 30),
    width: theme.spacing(30),
    transition: theme.transitions.create(["border-color", "color"], {
        duration: theme.transitions.duration.shortest,
    }),
    borderRadius: theme.shape.borderRadius,
    ":hover": {
        borderColor: theme.palette.primary.light,
        color: theme.palette.primary.light,
    },
}));

export const NewTaskBoardCardLabel = styled(Typography)(({ theme }) => ({
    textAlign: "center",
    marginTop: theme.spacing(2),
    color: theme.palette.text.secondary,
}));

export const TaskBoardsContainer = styled(Box)(({ theme }) => ({
    width: "100%",
    marginInline: "auto",
    marginBottom: theme.spacing(40),
    paddingInline: theme.spacing(6),
    paddingBlock: theme.spacing(4),
    maxWidth: theme.spacing(224),
    [theme.breakpoints.up("sm")]: {
        paddingInline: theme.spacing(16),
    },
}));

export const TaskBoardsRecentBoards = styled(Typography)(({ theme }) => ({
    fontWeight: 500,
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(2),
}));

export const TaskBoardsGrid = styled(Box)(({ theme }) => ({
    display: "grid",
    gridTemplateColumns: `repeat(auto-fit, minmax(${theme.spacing(56)}, 1fr))`,
    gap: theme.spacing(6),
}));

export const TaskBoardCard = styled(Link)(({ theme }) => ({
    flexBasis: theme.spacing(64),
    overflow: "hidden",
    cursor: "pointer",
    textDecoration: "none",
    backgroundColor: "white",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: theme.palette.divider,
    transition: theme.transitions.create("border-color", {
        duration: theme.transitions.duration.shortest,
    }),
    borderRadius: theme.shape.borderRadius,
    ":hover": {
        borderColor: theme.palette.primary.light,
    },
}));

export const TaskBoardCardHeader = styled(Box)(({ theme }) => ({
    color: theme.palette.text.secondary,
    paddingInline: theme.spacing(4),
    paddingBlock: theme.spacing(3),
}));

export const TaskBoardCardTitleContainer = styled(Box)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(3),
}));

export const ThumbnailImageWrapper = styled(Box)(({ theme }) => ({
    position: "relative",
    aspectRatio: 1,
}));
