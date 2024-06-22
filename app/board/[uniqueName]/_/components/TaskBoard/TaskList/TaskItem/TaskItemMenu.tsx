import {
    faEllipsisVertical,
    faPen,
    faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconButton, ListItemIcon, Menu, MenuItem } from "@mui/material";
import { useId, useRef, useState } from "react";

interface TaskItemMenuProps {
    onEdit: () => void;
    onDelete: () => void;
}

export default function TaskItemMenu({ onEdit, onDelete }: TaskItemMenuProps) {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const shouldFocusOnTaskRef = useRef<boolean>(false);
    const buttonId = useId();
    const menuId = useId();
    const open = Boolean(anchorEl);

    const handleClose = () => setAnchorEl(null);

    const handleTransitionEnd = () => {
        if (!open && shouldFocusOnTaskRef.current) {
            onEdit();
            shouldFocusOnTaskRef.current = false;
        }
    };

    const handleEditTaskClick = () => {
        shouldFocusOnTaskRef.current = true;
        handleClose();
    };

    const handleDeleteTaskClick = () => {
        onDelete();
        handleClose();
    };

    return (
        <>
            <IconButton
                id={buttonId}
                aria-haspopup={true}
                aria-controls={open ? menuId : undefined}
                aria-expanded={open}
                tabIndex={-1}
                size="small"
                onClick={(e) => setAnchorEl(e.currentTarget)}
            >
                <FontAwesomeIcon icon={faEllipsisVertical} />
            </IconButton>
            <Menu
                id={menuId}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                onTransitionEnd={handleTransitionEnd}
                MenuListProps={{ "aria-labelledby": buttonId, dense: true }}
            >
                <MenuItem onClick={handleEditTaskClick}>
                    <ListItemIcon sx={{ mr: "1em" }} style={{ minWidth: 0 }}>
                        <FontAwesomeIcon
                            icon={faPen}
                            style={{ fontSize: "1em" }}
                        />
                    </ListItemIcon>
                    Edit task
                </MenuItem>
                <MenuItem onClick={handleDeleteTaskClick}>
                    <ListItemIcon sx={{ mr: "1em" }} style={{ minWidth: 0 }}>
                        <FontAwesomeIcon
                            icon={faTrash}
                            style={{ fontSize: "1em" }}
                        />
                    </ListItemIcon>
                    Delete task
                </MenuItem>
            </Menu>
        </>
    );
}
