import {
    faArrowUpRightFromSquare,
    faPen,
    faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ListItemIcon, Menu, MenuItem, Tooltip } from "@mui/material";
import Link from "next/link";

export interface MenuPosition {
    x: number;
    y: number;
}

interface TaskBoardCardMenuProps {
    id: string;
    menuTriggerId: string;
    boardId: string;
    position: MenuPosition | null;
    isOpen: boolean;
    onClose: () => void;
    onRename?: () => void;
    onDelete: () => void;
}

export default function TaskBoardCardMenu({
    id,
    menuTriggerId,
    boardId,
    position,
    isOpen,
    onClose,
    onRename,
    onDelete,
}: TaskBoardCardMenuProps) {
    const makeHandler = (handler?: () => void) => {
        return () => {
            onClose();
            handler?.();
        };
    };

    return (
        <Menu
            id={id}
            open={isOpen}
            onClose={onClose}
            anchorReference="anchorPosition"
            anchorPosition={
                position === null
                    ? undefined
                    : { top: position.y, left: position.x }
            }
            MenuListProps={{ "aria-labelledby": menuTriggerId, dense: true }}
        >
            <MenuItem
                disabled={onRename === undefined}
                onClick={makeHandler(onRename)}
            >
                <ListItemIcon sx={{ mr: "1em" }} style={{ minWidth: 0 }}>
                    <FontAwesomeIcon icon={faPen} style={{ fontSize: "1em" }} />
                </ListItemIcon>
                Rename
            </MenuItem>
            <MenuItem onClick={makeHandler(onDelete)}>
                <ListItemIcon sx={{ mr: "1em" }} style={{ minWidth: 0 }}>
                    <FontAwesomeIcon
                        icon={faTrash}
                        style={{ fontSize: "1em" }}
                    />
                </ListItemIcon>
                Delete
            </MenuItem>
            <MenuItem
                component={Link}
                href={`/board/${boardId}`}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ textDecoration: "inherit", color: "inherit" }}
                onClick={makeHandler()}
            >
                <ListItemIcon sx={{ mr: "1em" }} style={{ minWidth: 0 }}>
                    <FontAwesomeIcon
                        icon={faArrowUpRightFromSquare}
                        style={{ fontSize: "1em" }}
                    />
                </ListItemIcon>
                Open in new tab
            </MenuItem>
        </Menu>
    );
}
