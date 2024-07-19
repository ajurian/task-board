import { faPen, faShare } from "@fortawesome/free-solid-svg-icons";
import { Menu } from "@mui/material";
import { useRef } from "react";
import TaskBoardHeaderMenuItem from "./TaskBoardHeaderMenuItem";

interface TaskBoardHeaderMenuProps {
    buttonId: string;
    menuId: string;
    anchorEl: HTMLButtonElement | null;
    onRenameBoard?: () => void;
    onShareBoard?: () => void;
    onClose: () => void;
}

export default function TaskBoardHeaderMenu({
    buttonId,
    menuId,
    anchorEl,
    onRenameBoard,
    onShareBoard,
    onClose,
}: TaskBoardHeaderMenuProps) {
    const shouldFocusOnDisplayNameRef = useRef<boolean>(false);
    const isOpen = Boolean(anchorEl);

    const handleTransitionEnd = () => {
        if (onRenameBoard && shouldFocusOnDisplayNameRef.current && !isOpen) {
            onRenameBoard();
            shouldFocusOnDisplayNameRef.current = false;
        }
    };

    const handleRenameBoardClick = () => {
        shouldFocusOnDisplayNameRef.current = true;
        onClose();
    };

    const handleShareBoardClick = () => {
        onShareBoard?.();
        onClose();
    };

    return (
        <Menu
            id={menuId}
            anchorEl={anchorEl}
            open={isOpen}
            onClose={onClose}
            onTransitionEnd={handleTransitionEnd}
            MenuListProps={{ "aria-labelledby": buttonId, dense: true }}
        >
            {onRenameBoard && (
                <TaskBoardHeaderMenuItem
                    label="Rename board"
                    icon={faPen}
                    onClick={handleRenameBoardClick}
                />
            )}
            {onShareBoard && (
                <TaskBoardHeaderMenuItem
                    label="Share board"
                    icon={faShare}
                    onClick={handleShareBoardClick}
                />
            )}
        </Menu>
    );
}
