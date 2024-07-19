import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconButton } from "@mui/material";
import { useId, useState } from "react";
import TaskBoardHeaderMenu from "./TaskBoardHeaderMenu";

interface TaskBoardHeaderMenuTriggerProps {
    onRenameBoard: () => void;
    onShareBoard: () => void;
}

export default function TaskBoardHeaderMenuTrigger({
    onRenameBoard,
    onShareBoard,
}: TaskBoardHeaderMenuTriggerProps) {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const buttonId = useId();
    const menuId = useId();

    const isMenuOpen = Boolean(anchorEl);
    const closeMenu = () => setAnchorEl(null);

    return (
        <>
            <IconButton
                id={buttonId}
                aria-haspopup={true}
                aria-controls={isMenuOpen ? menuId : undefined}
                aria-expanded={isMenuOpen}
                tabIndex={-1}
                size="small"
                onClick={(e) => setAnchorEl(e.currentTarget)}
            >
                <FontAwesomeIcon icon={faEllipsisVertical} />
            </IconButton>
            <TaskBoardHeaderMenu
                buttonId={buttonId}
                menuId={menuId}
                anchorEl={anchorEl}
                onRenameBoard={onRenameBoard}
                onShareBoard={onShareBoard}
                onClose={closeMenu}
            />
        </>
    );
}
