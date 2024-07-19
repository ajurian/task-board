import { Box, DialogContent, Select, styled, Typography } from "@mui/material";

export const ShareDialogContent = styled(DialogContent)(({ theme }) => ({
    paddingInline: 0,
    paddingBottom: 0,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(4),
}));

export const ShareDialogAddPeopleContainer = styled(Box)(({ theme }) => ({
    flexShrink: 0,
    overflowY: "auto",
    display: "flex",
    alignItems: "start",
    gap: theme.spacing(4),
    paddingInline: theme.spacing(6),
    paddingBlock: theme.spacing(2),
}));

export const ShareDialogEmailInputContainer = styled(Box)(({ theme }) => ({
    flex: 1,
    display: "flex",
    flexDirection: "column",
    maxHeight: "100%",
    overflowX: "hidden",
    borderRadius: theme.shape.borderRadius,
    outlineWidth: 1,
    outlineColor: theme.palette.grey[400],
    outlineStyle: "solid",
    cursor: "text",
    gap: theme.spacing(1),
    paddingInline: theme.spacing(3.5),
    paddingBlock: theme.spacing(2.125),
    ":hover": {
        outlineColor: "black",
    },
    ":focus-within": {
        outlineOffset: -1,
        outlineWidth: 2,
        outlineColor: theme.palette.primary.main,
    },
}));

export const ShareDialogAddPeopleEmailList = styled(Box, {
    shouldForwardProp: (propName) => propName !== "isEmpty",
})<{ isEmpty: boolean }>(({ theme, isEmpty }) => ({
    overflowY: "auto",
    display: isEmpty ? "none" : "flex",
    alignItems: "start",
    flexWrap: "wrap",
    flex: 1,
    gap: theme.spacing(1),
}));

export const ShareDialogPeopleWithAccessContainer = styled(Box)(() => ({
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
}));

export const ShareDialogPeopleWithAccessLabel = styled(Typography)(
    ({ theme }) => ({
        fontWeight: 500,
        marginInline: theme.spacing(6),
    })
);

export const ShareDialogPeopleWithAccessList = styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    overflowY: "auto",
    scrollSnapType: "y mandatory",
    marginTop: theme.spacing(2),
}));

export const ShareDialogPeopleWithAccessItem = styled(Box)(({ theme }) => ({
    scrollSnapAlign: "start",
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(3),
    paddingInline: theme.spacing(6),
    paddingBlock: theme.spacing(2),
    transition: theme.transitions.create("background-color", {
        duration: theme.transitions.duration.shortest,
    }),
    ":hover": {
        backgroundColor: theme.palette.grey[100],
    },
}));

export const ShareDialogGeneralAccessLabel = styled(Typography)(
    ({ theme }) => ({
        fontWeight: 500,
        marginInline: theme.spacing(6),
    })
);

export const ShareDialogGeneralAccessContainer = styled(Box)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
    paddingInline: theme.spacing(6),
    paddingBlock: theme.spacing(2),
    transition: theme.transitions.create("background-color", {
        duration: theme.transitions.duration.shortest,
    }),
    ":hover": {
        backgroundColor: theme.palette.grey[100],
    },
}));

export const ShareDialogGeneralAccessSelect = styled(Select)(({ theme }) => ({
    ...theme.typography.subtitle2,
    "& .MuiSelect-select": {
        paddingLeft: theme.spacing(2),
        paddingBlock: theme.spacing(1),
        borderRadius: theme.shape.borderRadius,
        transition: theme.transitions.create("background-color", {
            duration: theme.transitions.duration.shortest,
        }),
    },
    "& .MuiSelect-select:hover": {
        backgroundColor: theme.palette.grey[300],
    },
    "& .MuiSelect-select:focus": {
        backgroundColor: theme.palette.grey[300],
        borderRadius: theme.shape.borderRadius,
    },
}));

export const ShareDialogRoleSelectDisabled = styled(Typography)(() => ({
    opacity: 0.35,
    pointerEvents: "none",
}));
