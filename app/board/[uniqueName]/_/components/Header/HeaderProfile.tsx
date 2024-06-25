"use client";

import useAuth from "@/_/hooks/useAuth";
import { useSession } from "@/_/providers/SessionProvider";
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
    const open = Boolean(anchorEl);
    const buttonId = useId();
    const menuId = useId();

    const { signIn, signOut } = useAuth();
    const session = useSession<false>();

    return (
        <>
            <Avatar
                component={ButtonBase}
                id={buttonId}
                aria-haspopup={true}
                aria-controls={open ? menuId : undefined}
                aria-expanded={open}
                onClick={(e) => setAnchorEl(e.currentTarget)}
                tabIndex={-1}
            >
                {session.picture && (
                    <Image fill src={session.picture} alt="profile" />
                )}
            </Avatar>
            <Menu
                id={menuId}
                anchorEl={anchorEl}
                open={open}
                onClose={() => setAnchorEl(null)}
                MenuListProps={{ "aria-labelledby": buttonId }}
            >
                <MenuItem onClick={signIn}>
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
