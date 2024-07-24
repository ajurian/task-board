import {
    faArrowUpRightFromSquare,
    faPen,
    faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ListItemIcon, Menu, MenuItem } from "@mui/material";
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
            MenuListProps={{ "aria-labelledby": menuTriggerId }}
            slotProps={{ paper: { sx: { boxShadow: 3 } } }}
        >
            <MenuItem disabled={onRename === undefined} onClick={onRename}>
                <ListItemIcon>
                    <FontAwesomeIcon icon={faPen} style={{ fontSize: "1em" }} />
                </ListItemIcon>
                Rename
            </MenuItem>
            <MenuItem onClick={onDelete}>
                <ListItemIcon>
                    <FontAwesomeIcon
                        icon={faTrash}
                        style={{ fontSize: "1em" }}
                    />
                </ListItemIcon>
                Delete
            </MenuItem>
            <Link
                href={`/board/${boardId}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "inherit", color: "inherit" }}
            >
                <MenuItem>
                    <ListItemIcon>
                        <FontAwesomeIcon
                            icon={faArrowUpRightFromSquare}
                            style={{ fontSize: "1em" }}
                        />
                    </ListItemIcon>
                    Open in new tab
                </MenuItem>
            </Link>
        </Menu>
    );
}
