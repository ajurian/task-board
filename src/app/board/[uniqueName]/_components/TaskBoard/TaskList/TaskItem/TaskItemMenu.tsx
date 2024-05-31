import { useTaskQuery } from "@/app/board/[uniqueName]/_providers/TaskQueryProvider";
import {
    faEllipsisVertical,
    faPen,
    faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconButton, ListItemIcon, Menu, MenuItem } from "@mui/material";
import { useId, useState } from "react";

interface TaskItemMenuProps {
    taskId: string;
    onEditTask: () => void;
}

export default function TaskItemMenu({
    taskId,
    onEditTask,
}: TaskItemMenuProps) {
    const { deleteTask } = useTaskQuery();
    const [shouldFocusOnTask, setShouldFocusOnTask] = useState(false);
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const open = Boolean(anchorEl);
    const buttonId = useId();
    const menuId = useId();

    const handleClose = () => setAnchorEl(null);

    const handleTransitionEnd = () => {
        if (!open && shouldFocusOnTask) {
            onEditTask();
            setShouldFocusOnTask(false);
        }
    };

    const handleEditTaskClick = () => {
        setShouldFocusOnTask(true);
        handleClose();
    };

    const handleDeleteListClick = () => {
        deleteTask({ id: taskId });
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
                <MenuItem onClick={handleDeleteListClick}>
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
