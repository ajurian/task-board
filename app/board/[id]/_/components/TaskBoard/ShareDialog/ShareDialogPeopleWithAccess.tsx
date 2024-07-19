import {
    PERMISSION_ROLE_OWNER,
    PERMISSION_TO_ROLE,
    ROLE_TO_PERMISSION,
} from "@/_/common/constants/permissions";
import { Avatar, Box, Typography } from "@mui/material";
import Image from "next/image";
import { useMemo } from "react";
import { useTaskBoard } from "../../../providers/TaskBoardProvider";
import { useShareDialog } from "./ShareDialogProvider";
import ShareDialogRoleSelect from "./ShareDialogRoleSelect";
import {
    ShareDialogPeopleWithAccessContainer,
    ShareDialogPeopleWithAccessItem,
    ShareDialogPeopleWithAccessLabel,
    ShareDialogPeopleWithAccessList,
    ShareDialogRoleSelectDisabled,
} from "./ui";

export default function ShareDialogPeopleWithAccess() {
    const { users, taskBoardUser } = useTaskBoard();
    const { setUsersMap } = useShareDialog();

    const usersWithAccess = useMemo(
        () => users.filter(({ isVisitor }) => !isVisitor),
        [users]
    );

    return (
        <ShareDialogPeopleWithAccessContainer>
            <ShareDialogPeopleWithAccessLabel>
                People with access
            </ShareDialogPeopleWithAccessLabel>
            <ShareDialogPeopleWithAccessList>
                {usersWithAccess.map(({ id, permission, user }, index) => (
                    <ShareDialogPeopleWithAccessItem key={index}>
                        <Avatar>
                            <Image fill src={user.photoURL} alt="profile" />
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle2">
                                {user.displayName}
                                {usersWithAccess.length > 1 &&
                                    id === taskBoardUser.id &&
                                    " (you)"}
                            </Typography>
                            <Typography variant="body2">
                                {user.email}
                            </Typography>
                        </Box>
                        {permission === PERMISSION_ROLE_OWNER && (
                            <ShareDialogRoleSelectDisabled>
                                Owner
                            </ShareDialogRoleSelectDisabled>
                        )}
                        {permission !== PERMISSION_ROLE_OWNER && (
                            <ShareDialogRoleSelect
                                role={PERMISSION_TO_ROLE[permission]}
                                onChange={(role) =>
                                    setUsersMap((usersMap) => ({
                                        ...usersMap,
                                        [user.email]: ROLE_TO_PERMISSION[role],
                                    }))
                                }
                            />
                        )}
                    </ShareDialogPeopleWithAccessItem>
                ))}
            </ShareDialogPeopleWithAccessList>
        </ShareDialogPeopleWithAccessContainer>
    );
}
