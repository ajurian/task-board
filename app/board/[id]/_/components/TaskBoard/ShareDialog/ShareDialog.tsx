import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMounted, usePrevious } from "@mantine/hooks";
import {
    Box,
    Dialog,
    IconButton,
    Slide,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import React, { useId, useMemo } from "react";
import { useTaskBoard } from "../../../providers/TaskBoardProvider";
import ShareDialogAddPeople from "./ShareDialogAddPeople";
import ShareDialogGeneralAccess from "./ShareDialogGeneralAccess";
import ShareDialogPeopleWithAccess from "./ShareDialogPeopleWithAccess";
import ShareDialogProgress from "./ShareDialogProgress";
import ShareDialogProvider from "./ShareDialogProvider";
import ShareDialogSubmit from "./ShareDialogSubmit";
import {
    ShareDialogContent,
    ShareDialogHeader,
    ShareDialogHeaderTitle,
} from "./ui";

interface ShareDialogProps {
    shareParams: string[];
    isOpen: boolean;
    onClose: () => void;
}

const SlideUp = React.forwardRef(function SlideUp(
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function ShareDialog({
    shareParams,
    isOpen,
    onClose,
}: ShareDialogProps) {
    const emails = useMemo(
        () => shareParams.filter((shareParam) => shareParam.length > 0),
        [shareParams]
    );

    const {
        displayName,
        defaultPermission,
        users,
        canUserChangeRole,
        isUserVisitor,
    } = useTaskBoard();

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const dialogLabelId = useId();

    const isMounted = useMounted();
    const previousIsMounted = usePrevious(isMounted);

    return (
        <Dialog
            fullWidth
            maxWidth="sm"
            fullScreen={fullScreen}
            open={isOpen}
            onClose={onClose}
            TransitionComponent={fullScreen ? SlideUp : undefined}
            aria-labelledby={dialogLabelId}
            transitionDuration={{
                enter:
                    shareParams.length === 0
                        ? theme.transitions.duration.enteringScreen
                        : isMounted === previousIsMounted
                        ? theme.transitions.duration.enteringScreen
                        : 0,
                exit: theme.transitions.duration.leavingScreen,
            }}
        >
            <ShareDialogProvider
                initialDefaultPermission={defaultPermission}
                initialUsers={users}
            >
                <ShareDialogProgress />
                <ShareDialogHeader>
                    {fullScreen && (
                        <IconButton size="small" onClick={onClose}>
                            <FontAwesomeIcon icon={faXmark} />
                        </IconButton>
                    )}
                    <ShareDialogHeaderTitle
                        id={dialogLabelId}
                        variant="h6"
                        variantMapping={{ h6: "h2" }}
                    >
                        {canUserChangeRole && !isUserVisitor
                            ? `Share '${displayName}'`
                            : `Ask owner to share '${displayName}'`}
                    </ShareDialogHeaderTitle>
                    {fullScreen && (
                        <Box sx={{ ml: "auto" }}>
                            <ShareDialogSubmit onClose={onClose} />
                        </Box>
                    )}
                </ShareDialogHeader>
                <ShareDialogContent>
                    <ShareDialogAddPeople emails={emails} />
                    {canUserChangeRole && !isUserVisitor && (
                        <ShareDialogPeopleWithAccess />
                    )}
                    <ShareDialogGeneralAccess />
                </ShareDialogContent>
                {!fullScreen && (
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "end",
                            px: 4,
                            py: 2,
                        }}
                    >
                        <ShareDialogSubmit onClose={onClose} />
                    </Box>
                )}
            </ShareDialogProvider>
        </Dialog>
    );
}
