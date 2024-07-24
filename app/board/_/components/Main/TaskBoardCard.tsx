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
import { Divider, IconButton, Typography } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MouseEventHandler, useId, useState } from "react";
import TaskBoardCardMenu, { MenuPosition } from "./TaskBoardCardMenu";
import {
    TaskBoardCardContainer,
    TaskBoardCardHeader,
    TaskBoardCardTitleContainer,
    ThumbnailImageWrapper,
} from "./ui";
import { useTaskBoards } from "../../providers/TaskBoardsProvider";

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
    const router = useRouter();

    const menuId = useId();
    const buttonId = useId();

    const { taskBoardsQuery } = useTaskBoards();

    const isUserOwner = permission === PERMISSION_ROLE_OWNER;
    const canUserRenameTaskBoard =
        (permission & PERMISSION_TASK_BOARD_UPDATE_DISPLAY_NAME) !== 0;

    const handleMenuPosition = (position: MenuPosition) =>
        setMenuPosition(menuPosition === null ? position : null);

    const handleContextMenu: MouseEventHandler<HTMLDivElement> = (e) => {
        e.preventDefault();
        handleMenuPosition({
            x: e.clientX,
            y: e.clientY,
        });
    };

    const handleContainerClick: MouseEventHandler<HTMLDivElement> = (e) => {
        e.preventDefault();
        router.push(`/board/${boardId}`);
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

    const handleRename = () => {};

    const handleDelete = async () => {
        if (isUserOwner) {
            await ClientTaskBoardAPI.delete(boardId);
        } else {
            await ClientTaskBoardUserAPI.delete(boardUserId);
        }

        taskBoardsQuery.refetch();
    };

    return (
        <>
            <TaskBoardCardContainer
                role="option"
                onContextMenu={handleContextMenu}
                onClick={handleContainerClick}
            >
                <TaskBoardCardHeader>
                    <TaskBoardCardTitleContainer>
                        <Typography>{title}</Typography>
                        {isShared && <FontAwesomeIcon icon={faUserGroup} />}
                        <IconButton
                            size="small"
                            sx={{ ml: "auto" }}
                            onClick={handleMenuTriggerClick}
                        >
                            <FontAwesomeIcon icon={faEllipsisVertical} />
                        </IconButton>
                    </TaskBoardCardTitleContainer>
                    <Typography variant="caption">
                        {accessedAt.toLocaleString()}
                    </Typography>
                </TaskBoardCardHeader>
                <Divider sx={{ borderColor: "inherit" }} />
                <ThumbnailImageWrapper>
                    <Image
                        fill
                        src={`${location.origin}/api/thumbnails/${boardId}`}
                        alt="thumbnail"
                    />
                </ThumbnailImageWrapper>
            </TaskBoardCardContainer>
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
        </>
    );
}
