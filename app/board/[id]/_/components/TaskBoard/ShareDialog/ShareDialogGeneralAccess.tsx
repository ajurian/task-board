import {
    PERMISSION_ROLE_NONE,
    PERMISSION_TO_ROLE,
    PermissionRole,
    ROLE_TO_PERMISSION,
} from "@/_/common/constants/permissions";
import { faGlobe, faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar, Box, MenuItem, Typography } from "@mui/material";
import { useState } from "react";
import { useTaskBoard } from "../../../providers/TaskBoardProvider";
import { useShareDialog } from "./ShareDialogProvider";
import ShareDialogRoleSelect from "./ShareDialogRoleSelect";
import {
    ShareDialogGeneralAccessContainer,
    ShareDialogGeneralAccessDetails,
    ShareDialogGeneralAccessLabel,
    ShareDialogGeneralAccessSelect,
} from "./ui";

type DefaultPermissionRole = PermissionRole | "none";

const ROLE_DESCRIPTION: Record<DefaultPermissionRole, string> = {
    none: "Only people with access can open with the link.",
    viewer: "Anyone with the link can view.",
    worker: "Anyone with the link can work.",
    editor: "Anyone with the link can edit.",
};

export default function ShareDialogGeneralAccess() {
    const { defaultPermission, canUserUpdateDefaultPermission } =
        useTaskBoard();
    const isInitiallyPrivate = defaultPermission === PERMISSION_ROLE_NONE;

    const [defaultRole, setDefaultRole] = useState<DefaultPermissionRole>(
        isInitiallyPrivate ? "none" : PERMISSION_TO_ROLE[defaultPermission]
    );

    const { setDefaultPermission } = useShareDialog();

    const handleDefaultRoleChange = async (role: DefaultPermissionRole) => {
        setDefaultRole(role);
        setDefaultPermission(ROLE_TO_PERMISSION[role]);
    };

    return (
        <ShareDialogGeneralAccessContainer>
            <ShareDialogGeneralAccessLabel variant="subtitle1">
                General access
            </ShareDialogGeneralAccessLabel>
            <ShareDialogGeneralAccessDetails>
                <Avatar
                    sx={{
                        fontSize: "1.125rem",
                        width: "2em",
                        height: "2em",
                        bgcolor: "grey.300",
                        color: "grey.800",
                    }}
                >
                    <FontAwesomeIcon
                        icon={defaultRole === "none" ? faLock : faGlobe}
                    />
                </Avatar>
                <Box sx={{ flex: 1 }}>
                    {canUserUpdateDefaultPermission && (
                        <ShareDialogGeneralAccessSelect
                            disableUnderline
                            variant="standard"
                            defaultValue={
                                isInitiallyPrivate ? "private" : "public"
                            }
                            onChange={(e) =>
                                handleDefaultRoleChange(
                                    e.target.value === "private"
                                        ? "none"
                                        : "viewer"
                                )
                            }
                        >
                            <MenuItem value="private">
                                Restricted access
                            </MenuItem>
                            <MenuItem value="public">
                                Anyone with the link
                            </MenuItem>
                        </ShareDialogGeneralAccessSelect>
                    )}
                    {!canUserUpdateDefaultPermission && (
                        <Typography variant="subtitle2" sx={{ pl: 2, py: 1 }}>
                            {defaultRole === "none"
                                ? "Restricted Access"
                                : "Anyone with the link"}
                        </Typography>
                    )}
                    <Typography variant="body2" sx={{ ml: 2 }}>
                        {ROLE_DESCRIPTION[defaultRole]}
                    </Typography>
                </Box>
                {defaultRole !== "none" && (
                    <ShareDialogRoleSelect
                        disabled={!canUserUpdateDefaultPermission}
                        role={defaultRole}
                        onChange={handleDefaultRoleChange}
                    />
                )}
            </ShareDialogGeneralAccessDetails>
        </ShareDialogGeneralAccessContainer>
    );
}
