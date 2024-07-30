import {
    PERMISSION_ROLE_OWNER,
    PERMISSION_TASK_BOARD_UPDATE_DISPLAY_NAME,
} from "@/_/common/constants/permissions";
import ClientTaskBoardAPI from "@/api/_/common/layers/client/TaskBoardAPI";
import ClientTaskBoardUserAPI from "@/api/_/common/layers/client/TaskBoardUserAPI";
import {
    faEllipsisVertical,
    faUserGroup,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDisclosure } from "@mantine/hooks";
import {
    Box,
    CircularProgress,
    Divider,
    IconButton,
    Typography,
} from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MouseEventHandler, useId, useState } from "react";
import { useTaskBoards } from "../../../providers/TaskBoardsProvider";
import {
    TaskBoardCardContainer,
    TaskBoardCardHeader,
    TaskBoardCardTitleContainer,
    ThumbnailImageWrapper,
} from "../ui";
import TaskBoardCardMenu, { MenuPosition } from "./TaskBoardCardMenu";
import TaskBoardCardRenameDialog from "./TaskBoardCardRenameDialog";

interface TaskBoardCardProps {
    boardUserId: string;
    permission: number;
    accessedAt: Date;
    boardId: string;
    title: string;
    isShared: boolean;
}

export default function TaskBoardCard({
    boardUserId,
    permission,
    accessedAt,
    boardId,
    title,
    isShared,
}: TaskBoardCardProps) {
    const [menuPosition, setMenuPosition] = useState<MenuPosition | null>(null);
    const [
        isRenameDialogOpen,
        { open: openRenameDialog, close: closeRenameDialog },
    ] = useDisclosure(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const { refreshData } = useTaskBoards();
    const router = useRouter();
    const menuId = useId();
    const buttonId = useId();

    const canUserRenameTaskBoard =
        (permission & PERMISSION_TASK_BOARD_UPDATE_DISPLAY_NAME) !== 0;
    const canUserDeleteTaskBoard = permission === PERMISSION_ROLE_OWNER;

    const handleMenuPosition = (position: MenuPosition) =>
        setMenuPosition(menuPosition === null ? position : null);

    const handleContainerClick: MouseEventHandler<HTMLDivElement> = (e) => {
        if (menuPosition !== null) {
            return;
        }

        e.preventDefault();
        router.push(`/board/${boardId}`);
    };

    const handleMouseUp: MouseEventHandler<HTMLDivElement> = (e) => {
        if (e.button !== 1) {
            return;
        }

        if (menuPosition !== null) {
            setMenuPosition(null);
            return;
        }

        e.preventDefault();

        Object.assign(document.createElement("a"), {
            target: "_blank",
            rel: "noopener noreferrer",
            href: `/board/${boardId}`,
        }).click();
    };

    const handleContextMenu: MouseEventHandler<HTMLDivElement> = (e) => {
        e.preventDefault();
        handleMenuPosition({
            x: e.clientX,
            y: e.clientY,
        });
    };

    const handleMenuTriggerClick: MouseEventHandler<HTMLButtonElement> = (
        e
    ) => {
        e.preventDefault();
        e.stopPropagation();

        const rect = e.currentTarget.getBoundingClientRect();

        handleMenuPosition({
            x: rect.x,
            y: rect.y + rect.height,
        });
    };

    const handleMenuClose = () => setMenuPosition(null);

    const handleRename = openRenameDialog;

    const handleDelete = async () => {
        setIsDeleting(true);

        if (canUserDeleteTaskBoard) {
            await ClientTaskBoardAPI.delete(boardId);
        } else {
            await ClientTaskBoardUserAPI.delete(boardUserId);
        }

        await refreshData();

        setIsDeleting(false);
    };

    return (
        <>
            <TaskBoardCardContainer
                role="option"
                onClick={handleContainerClick}
                onMouseUp={handleMouseUp}
                onContextMenu={handleContextMenu}
                isDeleting={isDeleting}
            >
                <TaskBoardCardHeader>
                    <TaskBoardCardTitleContainer>
                        <Typography>{title}</Typography>
                        {isShared && <FontAwesomeIcon icon={faUserGroup} />}
                        {isDeleting && (
                            <Box
                                color="text.secondary"
                                maxHeight={28}
                                padding="5px"
                                ml="auto"
                            >
                                <CircularProgress size={18} color="inherit" />
                            </Box>
                        )}
                        {!isDeleting && (
                            <IconButton
                                size="small"
                                sx={{ ml: "auto" }}
                                onClick={handleMenuTriggerClick}
                            >
                                <FontAwesomeIcon icon={faEllipsisVertical} />
                            </IconButton>
                        )}
                    </TaskBoardCardTitleContainer>
                    <Typography variant="caption">
                        {accessedAt.toLocaleString()}
                    </Typography>
                </TaskBoardCardHeader>
                <Divider sx={{ borderColor: "inherit" }} />
                <ThumbnailImageWrapper>
                    <Image
                        fill
                        unoptimized
                        src={`${location.origin}/api/thumbnails/${boardId}`}
                        alt="thumbnail"
                    />
                </ThumbnailImageWrapper>
                <TaskBoardCardMenu
                    id={menuId}
                    menuTriggerId={buttonId}
                    boardId={boardId}
                    position={menuPosition}
                    isOpen={menuPosition !== null}
                    onClose={handleMenuClose}
                    onRename={canUserRenameTaskBoard ? handleRename : undefined}
                    onDelete={handleDelete}
                />
            </TaskBoardCardContainer>
            {canUserRenameTaskBoard && (
                <TaskBoardCardRenameDialog
                    boardId={boardId}
                    initialTitle={title}
                    isOpen={isRenameDialogOpen}
                    onClose={closeRenameDialog}
                />
            )}
        </>
    );
}
