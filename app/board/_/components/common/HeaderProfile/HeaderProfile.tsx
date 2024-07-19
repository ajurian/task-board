"use client";

import { useAuth } from "@/_/providers/AuthProvider";
import { useUserInfo } from "@/_/providers/UserInfoProvider";
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
import Image from "next/image";
import { useId, useState } from "react";

export default function HeaderProfile() {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const buttonId = useId();
    const menuId = useId();
    const isOpen = Boolean(anchorEl);

    const { signIn, signOut } = useAuth();
    const session = useUserInfo<false>();

    return (
        <>
            <Avatar
                component={ButtonBase}
                id={buttonId}
                aria-haspopup={true}
                aria-controls={isOpen ? menuId : undefined}
                aria-expanded={isOpen}
                onClick={(e) => setAnchorEl(e.currentTarget)}
                tabIndex={-1}
            >
                <Image fill src={session.picture} alt="profile" />
            </Avatar>
            <Menu
                id={menuId}
                anchorEl={anchorEl}
                open={isOpen}
                onClose={() => setAnchorEl(null)}
                MenuListProps={{ "aria-labelledby": buttonId, dense: true }}
            >
                <MenuItem onClick={signIn}>
                    <ListItemIcon sx={{ mr: "1em" }} style={{ minWidth: 0 }}>
                        <FontAwesomeIcon
                            icon={faRepeat}
                            style={{ fontSize: "1em" }}
                        />
                    </ListItemIcon>
                    Switch account
                </MenuItem>
                <MenuItem onClick={signOut}>
                    <ListItemIcon sx={{ mr: "1em" }} style={{ minWidth: 0 }}>
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
