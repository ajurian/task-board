import { TaskListModel } from "@/_/common/schema/taskList";
import {
    faCheck,
    faEllipsisVertical,
    faPen,
    faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    Divider,
    IconButton,
    ListItemIcon,
    Menu,
    MenuItem,
    Typography,
} from "@mui/material";
import { useId, useRef, useState } from "react";

interface TaskListHeaderMenuTriggerProps {
    sortBy: TaskListModel["sortBy"];
    onRenameTitle?: () => void;
    onDeleteTitle?: () => void;
}

export default function TaskListHeaderMenuTrigger({
    sortBy,
    onRenameTitle,
    onDeleteTitle,
}: TaskListHeaderMenuTriggerProps) {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const shouldFocusOnTitleRef = useRef<boolean>(false);
    const buttonId = useId();
    const menuId = useId();
    const isOpen = Boolean(anchorEl);

    const closeMenu = () => setAnchorEl(null);

    const handleTransitionEnd = () => {
        if (onRenameTitle && shouldFocusOnTitleRef.current && !isOpen) {
            onRenameTitle();
            shouldFocusOnTitleRef.current = false;
        }
    };

    const handleRenameListClick = () => {
        shouldFocusOnTitleRef.current = true;
        closeMenu();
    };

    const handleDeleteListClick = () => {
        onDeleteTitle?.();
        closeMenu();
    };

    return (
        <>
            <IconButton
                id={buttonId}
                aria-haspopup={true}
                aria-controls={isOpen ? menuId : undefined}
                aria-expanded={isOpen}
                tabIndex={-1}
                size="small"
                onClick={(e) => setAnchorEl(e.currentTarget)}
            >
                <FontAwesomeIcon icon={faEllipsisVertical} />
            </IconButton>
            <Menu
                id={menuId}
                anchorEl={anchorEl}
                open={isOpen}
                onClose={closeMenu}
                onTransitionEnd={handleTransitionEnd}
                MenuListProps={{ "aria-labelledby": buttonId, dense: true }}
            >
                {/* <Typography
                    variant="body2"
                    sx={{ ml: 11, mb: 1, fontSize: "0.8125rem" }}
                >
                    Sort by
                </Typography>
                <MenuItem>
                    {sortBy === "order" && (
                        <ListItemIcon style={{ minWidth: 0 }}>
                            <FontAwesomeIcon
                                icon={faCheck}
                                style={{ fontSize: "1em" }}
                            />
                        </ListItemIcon>
                    )}
                    <Typography
                        sx={{
                            font: "inherit",
                            ml: sortBy === "order" ? "1em" : "2em",
                        }}
                    >
                        Custom order
                    </Typography>
                </MenuItem>
                <MenuItem>
                    {sortBy === "dueAt" && (
                        <ListItemIcon style={{ minWidth: 0 }}>
                            <FontAwesomeIcon
                                icon={faCheck}
                                style={{ fontSize: "1em" }}
                            />
                        </ListItemIcon>
                    )}
                    <Typography
                        sx={{
                            font: "inherit",
                            ml: sortBy === "dueAt" ? "1em" : "2em",
                        }}
                    >
                        Due date
                    </Typography>
                </MenuItem>
                <Divider /> */}
                {onRenameTitle && (
                    <MenuItem onClick={handleRenameListClick}>
                        <ListItemIcon
                            sx={{ mr: "1em" }}
                            style={{ minWidth: 0 }}
                        >
                            <FontAwesomeIcon
                                icon={faPen}
                                style={{ fontSize: "1em" }}
                            />
                        </ListItemIcon>
                        Rename list
                    </MenuItem>
                )}
                {onDeleteTitle && (
                    <MenuItem onClick={handleDeleteListClick}>
                        <ListItemIcon
                            sx={{ mr: "1em" }}
                            style={{ minWidth: 0 }}
                        >
                            <FontAwesomeIcon
                                icon={faTrash}
                                style={{ fontSize: "1em" }}
                            />
                        </ListItemIcon>
                        Delete list
                    </MenuItem>
                )}
            </Menu>
        </>
    );
}
