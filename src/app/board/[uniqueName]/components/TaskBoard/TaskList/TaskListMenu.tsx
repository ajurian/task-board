import {
    faEllipsisVertical,
    faPen,
    faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconButton, ListItemIcon, Menu, MenuItem } from "@mui/material";
import { useId, useState } from "react";
import { useTaskQuery } from "../../../providers/TaskQueryProvider";

interface TaskListMenuProps {
    listId: string;
    onRenameTitle: () => void;
}

export default function TaskListMenu({
    listId,
    onRenameTitle,
}: TaskListMenuProps) {
    const { deleteTaskList } = useTaskQuery();
    const [shouldFocusOnTitle, setShouldFocusOnTitle] = useState(false);
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const open = Boolean(anchorEl);
    const buttonId = useId();
    const menuId = useId();

    const handleClose = () => setAnchorEl(null);

    const handleTransitionEnd = () => {
        if (!open && shouldFocusOnTitle) {
            onRenameTitle();
            setShouldFocusOnTitle(false);
        }
    };

    const handleRenameListClick = () => {
        setShouldFocusOnTitle(true);
        handleClose();
    };

    const handleDeleteListClick = () => {
        deleteTaskList({ id: listId });
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
                <MenuItem onClick={handleRenameListClick}>
                    <ListItemIcon sx={{ mr: "1em" }} style={{ minWidth: 0 }}>
                        <FontAwesomeIcon
                            icon={faPen}
                            style={{ fontSize: "1em" }}
                        />
                    </ListItemIcon>
                    Rename list
                </MenuItem>
                <MenuItem onClick={handleDeleteListClick}>
                    <ListItemIcon sx={{ mr: "1em" }} style={{ minWidth: 0 }}>
                        <FontAwesomeIcon
                            icon={faTrash}
                            style={{ fontSize: "1em" }}
                        />
                    </ListItemIcon>
                    Delete list
                </MenuItem>
            </Menu>
        </>
    );
}
