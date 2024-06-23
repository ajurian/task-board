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
    active?: boolean;
}

export default function SidebarItem({
    icon,
    text,
    id,
    active = false,
}: SidebarItemProps) {
    const shouldPutHref = !active && id !== undefined;

    return (
        <ListItem disablePadding>
            <ListItemButton
                {...(shouldPutHref && { href: `/board/${id}` })}
                disabled={active}
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
