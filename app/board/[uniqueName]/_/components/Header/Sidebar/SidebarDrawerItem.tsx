import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from "@mui/material";

interface SidebarItemProps {
    icon: IconDefinition;
    text: string;
    id?: string;
    isActive?: boolean;
    onClick?: () => void;
}

export default function SidebarDrawerItem({
    icon,
    text,
    id,
    isActive = false,
    onClick,
}: SidebarItemProps) {
    const shouldPutHref = !isActive && id !== undefined;

    return (
        <ListItem disablePadding>
            <ListItemButton
                {...(shouldPutHref && { href: `/board/${id}` })}
                disabled={isActive}
                onClick={shouldPutHref ? undefined : onClick}
            >
                <ListItemIcon sx={{ minWidth: 0, mr: 4 }}>
                    <FontAwesomeIcon icon={icon} />
                </ListItemIcon>
                <ListItemText
                    primary={text}
                    primaryTypographyProps={{
                        color: "text.secondary",
                        fontWeight: 500,
                    }}
                />
            </ListItemButton>
        </ListItem>
    );
}
