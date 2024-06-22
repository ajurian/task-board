"use client";

import useAuth from "@/_/hooks/useAuth";
import {
    faArrowRightFromBracket,
    faRepeat,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    Avatar,
    ButtonBase,
    ListItemIcon,
    Menu,
    MenuItem,
} from "@mui/material";
import { purple } from "@mui/material/colors";
import { useId, useState } from "react";

export default function User() {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const open = Boolean(anchorEl);
    const buttonId = useId();
    const menuId = useId();
    const { signOut } = useAuth();

    return (
        <>
            <Avatar
                component={ButtonBase}
                id={buttonId}
                aria-haspopup={true}
                aria-controls={open ? menuId : undefined}
                aria-expanded={open}
                sx={{ bgcolor: purple[400] }}
                onClick={(e) => setAnchorEl(e.currentTarget)}
                tabIndex={-1}
            >
                A
            </Avatar>
            <Menu
                id={menuId}
                anchorEl={anchorEl}
                open={open}
                onClose={() => setAnchorEl(null)}
                MenuListProps={{ "aria-labelledby": buttonId }}
            >
                <MenuItem>
                    <ListItemIcon>
                        <FontAwesomeIcon
                            icon={faRepeat}
                            style={{ fontSize: "1em" }}
                        />
                    </ListItemIcon>
                    Switch account
                </MenuItem>
                <MenuItem onClick={signOut}>
                    <ListItemIcon>
                        <FontAwesomeIcon
                            icon={faArrowRightFromBracket}
                            style={{ fontSize: "1em" }}
                        />
                    </ListItemIcon>
                    Sign out
                </MenuItem>
            </Menu>
        </>
    );
}
