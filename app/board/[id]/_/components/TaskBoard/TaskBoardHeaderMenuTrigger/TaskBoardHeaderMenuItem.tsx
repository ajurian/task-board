import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ListItemIcon, MenuItem } from "@mui/material";

interface TaskBoardHeaderMenuItemProps {
    label: string;
    icon: IconDefinition;
    onClick: () => void;
}

export default function TaskBoardHeaderMenuItem({
    label,
    icon,
    onClick,
}: TaskBoardHeaderMenuItemProps) {
    return (
        <MenuItem onClick={onClick}>
            <ListItemIcon sx={{ mr: "1em" }} style={{ minWidth: 0 }}>
                <FontAwesomeIcon icon={icon} style={{ fontSize: "1em" }} />
            </ListItemIcon>
            {label}
        </MenuItem>
    );
}
