import { Box, ButtonBase, styled, Typography } from "@mui/material";

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

export const NewTaskBoardCard = styled(ButtonBase, {
    shouldForwardProp: (propName) => propName !== "isDisabled",
})<{ isDisabled: boolean }>(({ theme, isDisabled }) => ({
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
    height: theme.spacing(1.2939 * 30),
    width: theme.spacing(30),
    transition: theme.transitions.create(["border-color", "color"], {
        duration: theme.transitions.duration.shortest,
    }),
    borderRadius: theme.shape.borderRadius,
    ...(isDisabled && {
        cursor: "default",
    }),
    ...(!isDisabled && {
        ":hover": {
            borderColor: theme.palette.primary.light,
            color: theme.palette.primary.light,
        },
    }),
}));

export const NewTaskBoardCardLabel = styled(Typography)(({ theme }) => ({
    textAlign: "center",
    marginTop: theme.spacing(2),
    color: theme.palette.text.secondary,
}));

export const TaskBoardsContainer = styled(Box)(({ theme }) => ({
    marginInline: "auto",
    marginBottom: theme.spacing(40),
    paddingInline: theme.spacing(6),
    paddingBlock: theme.spacing(4),
    width: theme.spacing(70),
    [theme.breakpoints.up("sm")]: {
        width: theme.spacing(146),
    },
    [theme.breakpoints.up("md")]: {
        width: theme.spacing(222),
    },
}));

export const TaskBoardsRecentBoards = styled(Typography)(({ theme }) => ({
    fontWeight: 500,
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(2),
}));

export const TaskBoardsGrid = styled(Box)(({ theme }) => ({
    display: "grid",
    gridTemplateRows: "auto",
    gridTemplateColumns: "repeat(1, 1fr)",
    gap: theme.spacing(6),
    [theme.breakpoints.up("sm")]: {
        gridTemplateColumns: "repeat(2, 1fr)",
    },
    [theme.breakpoints.up("md")]: {
        gridTemplateColumns: "repeat(3, 1fr)",
    },
}));

export const TaskBoardsLoadingContainer = styled(Box)(({ theme }) => ({
    display: "flex",
    justifyContent: "center",
    gridColumn: "1 / -1",
    color: theme.palette.text.secondary,
    marginTop: theme.spacing(40),
}));

export const TaskBoardsEmptyListContainer = styled(Box)(({ theme }) => ({
    display: "flex",
    justifyContent: "center",
    gridColumn: "1 / -1",
    opacity: 0.5,
    color: theme.palette.text.secondary,
    marginTop: theme.spacing(40),
}));

export const TaskBoardCardContainer = styled(Box)(({ theme }) => ({
    WebkitTapHighlightColor: "transparent",
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
    paddingLeft: theme.spacing(4),
    paddingRight: `calc(${theme.spacing(4)} - 5px)`,
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
