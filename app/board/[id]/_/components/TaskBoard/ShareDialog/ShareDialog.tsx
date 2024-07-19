import { Dialog, DialogTitle } from "@mui/material";
import { useTaskBoard } from "../../../providers/TaskBoardProvider";
import ShareDialogActions from "./ShareDialogActions";
import ShareDialogAddPeople from "./ShareDialogAddPeople";
import ShareDialogGeneralAccess from "./ShareDialogGeneralAccess";
import ShareDialogPeopleWithAccess from "./ShareDialogPeopleWithAccess";
import ShareDialogProgress from "./ShareDialogProgress";
import ShareDialogProvider from "./ShareDialogProvider";
import { ShareDialogContent } from "./ui";

interface ShareDialogProps {
    shareParams: string[];
    isOpen: boolean;
    onClose: () => void;
}

export default function ShareDialog({
    shareParams,
    isOpen,
    onClose,
}: ShareDialogProps) {
    const {
        displayName,
        defaultPermission,
        users,
        canUserChangeRole,
        isUserVisitor,
    } = useTaskBoard();

    return (
        <Dialog fullWidth maxWidth="sm" open={isOpen} onClose={onClose}>
            <ShareDialogProvider
                initialDefaultPermission={defaultPermission}
                initialUsers={users}
            >
                <ShareDialogProgress />
                <DialogTitle>
                    {canUserChangeRole && !isUserVisitor
                        ? `Share '${displayName}'`
                        : `Ask owner to share '${displayName}'`}
                </DialogTitle>
                <ShareDialogContent>
                    <ShareDialogAddPeople emails={shareParams} />
                    {canUserChangeRole && !isUserVisitor && (
                        <ShareDialogPeopleWithAccess />
                    )}
                    <ShareDialogGeneralAccess />
                </ShareDialogContent>
                <ShareDialogActions onClose={onClose} />
            </ShareDialogProvider>
        </Dialog>
    );
}
