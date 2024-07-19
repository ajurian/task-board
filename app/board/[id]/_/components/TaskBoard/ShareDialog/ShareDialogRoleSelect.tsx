import { PermissionRole } from "@/_/common/constants/permissions";
import { MenuItem, Select } from "@mui/material";
import _ from "lodash";
import { useState } from "react";
import { ShareDialogRoleSelectDisabled } from "./ui";

interface ShareDialogRoleSelectProps {
    disabled?: boolean;
    role?: PermissionRole;
    onChange?: (role: PermissionRole) => void;
}

export default function ShareDialogRoleSelect({
    disabled = false,
    role: defaultRole = "viewer",
    onChange,
}: ShareDialogRoleSelectProps) {
    const [role, setRole] = useState<PermissionRole>(defaultRole);

    const handleRoleChange = (role: PermissionRole) => {
        setRole(role);
        onChange?.(role);
    };

    if (disabled) {
        return (
            <ShareDialogRoleSelectDisabled>
                {_.capitalize(role)}
            </ShareDialogRoleSelectDisabled>
        );
    }

    return (
        <Select
            size="small"
            value={role}
            onChange={(e) => handleRoleChange(e.target.value as PermissionRole)}
            sx={(theme) => ({ width: theme.spacing(28) })}
        >
            <MenuItem value="editor">Editor</MenuItem>
            <MenuItem value="worker">Worker</MenuItem>
            <MenuItem value="viewer">Viewer</MenuItem>
        </Select>
    );
}
