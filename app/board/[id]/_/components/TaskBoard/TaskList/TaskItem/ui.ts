import {
    Box,
    Button,
    InputBase,
    MenuItem,
    styled,
    Typography,
} from "@mui/material";

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
        propName !== "isEditDisabled",
})<{
    isDragging: boolean;
    isFocused: boolean;
    isEditDisabled: boolean;
}>(({ theme, isDragging, isFocused, isEditDisabled }) => ({
    WebkitTapHighlightColor: "transparent",
    position: "relative",
    paddingInline: theme.spacing(2.75),
    paddingBlock: theme.spacing(1.5),
    display: "flex",
    flexDirection: "column",
    transition: theme.transitions.create(["box-shadow", "background-color"], {
        duration: theme.transitions.duration.shortest,
    }),
    boxShadow: theme.shadows[0],
    backgroundColor: theme.palette.background.paper,
    cursor: isEditDisabled ? "inherit" : "pointer",
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
}));

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

export const TaskItemBulletPointWrapper = styled(Box)(({ theme }) => ({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxSizing: "content-box",
    padding: theme.spacing(1.25),
    width: theme.spacing(4.5),
    height: theme.spacing(4.5),
    color: theme.palette.text.secondary,
}));

export const TaskItemTitleInput = styled(InputBase)(({ theme }) => ({
    ...theme.typography.subtitle1,
    minHeight: "1lh",
    paddingBlock: 0,
}));

export const TaskItemTitleText = styled(Typography)(() => ({
    flex: 1,
    whiteSpace: "pre-wrap",
    wordWrap: "break-word",
    overflowWrap: "break-word",
    wordBreak: "break-word",
}));

export const TaskItemDetailsInput = styled(InputBase)(({ theme }) => ({
    ...theme.typography.body2,
    minHeight: "1lh",
    paddingBlock: 0,
    paddingLeft: theme.spacing(9),
    paddingRight: theme.spacing(1.25),
    color: theme.palette.text.secondary,
}));

export const TaskItemDetailsText = styled(Typography)(({ theme }) => ({
    whiteSpace: "pre-wrap",
    wordWrap: "break-word",
    overflowWrap: "break-word",
    wordBreak: "break-word",
    paddingLeft: theme.spacing(9),
    paddingRight: theme.spacing(1.25),
    color: theme.palette.text.secondary,
}));

export const TaskItemDueDateTagWrapper = styled(Box)(({ theme }) => ({
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(1.75),
    marginRight: "auto",
}));

export const TaskItemDueDateTagText = styled(Typography)(({ theme }) => ({
    display: "inline-block",
    fontSize: "0.8125rem",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: theme.palette.warning.light,
    paddingInline: theme.spacing(2.5),
    paddingBlock: theme.spacing(0.25),
    borderRadius: "100vw",
}));

export const TaskItemDueDateSelectTriggerWrapper = styled(Box)(({ theme }) => ({
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(1.75),
}));

export const TaskItemDueDateSelectTriggerButton = styled(Button)(
    ({ theme }) => ({
        borderRadius: "100vw",
        display: "inline-block",
        paddingInline: theme.spacing(2.5),
        paddingBlock: theme.spacing(0.25),
    })
);

export const TaskItemDueDateSelectCommon = styled(MenuItem)(({ theme }) => ({
    flex: 1,
    borderRadius: theme.shape.borderRadius,
    color: theme.palette.text.secondary,
}));

export const TaskItemPlaceholderContainer = styled(Box, {
    shouldForwardProp: (propName) =>
        propName !== "isFocused" && propName !== "isDisabled",
})<{ isFocused: boolean; isDisabled: boolean }>(
    ({ theme, isFocused, isDisabled }) => ({
        WebkitTapHighlightColor: "transparent",
        paddingInline: theme.spacing(2.75),
        paddingBlock: theme.spacing(1.5),
        color: theme.palette.primary.main,
        transition: theme.transitions.create(
            ["box-shadow", "background-color"],
            {
                duration: theme.transitions.duration.shortest,
            }
        ),
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
        ...(!isFocused &&
            !isDisabled && {
                cursor: "pointer",
                ":hover": {
                    zIndex: 1,
                    backgroundColor: theme.palette.grey[100],
                },
            }),
        ...(isDisabled && {
            cursor: "default",
            opacity: 0.5,
        }),
    })
);

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
