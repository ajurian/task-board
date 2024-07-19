import ClientTaskBoardAPI from "@/api/_/common/layers/client/TaskBoardAPI";
import ClientTaskBoardUserAPI from "@/api/_/common/layers/client/TaskBoardUserAPI";
import { useTaskBoard } from "@/board/[id]/_/providers/TaskBoardProvider";
import _ from "lodash";
import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
} from "react";
import {
    ShareDialogContextValue,
    ShareDialogProviderProps,
    UsersMap,
} from "./ShareDialogProviderTypes";
import {
    PERMISSION_ROLE_EDITOR,
    PERMISSION_TO_ROLE,
} from "@/_/common/constants/permissions";

const ShareDialogContext = createContext<ShareDialogContextValue | null>(null);

export const useShareDialog = () => {
    const value = useContext(ShareDialogContext);

    if (value === null) {
        throw new Error(
            "`useShareDialog` hook must be used inside of 'ShareDialogProvider'."
        );
    }

    return value;
};

export default function ShareDialogProvider({
    initialDefaultPermission,
    initialUsers,
    children,
}: ShareDialogProviderProps) {
    const initialUsersMap = useMemo(
        () =>
            initialUsers.reduce<UsersMap>((usersMap, { permission, user }) => {
                usersMap[user.email] = permission;
                return usersMap;
            }, {}),
        [initialUsers]
    );

    const [defaultPermission, setDefaultPermission] = useState(
        initialDefaultPermission
    );
    const [usersMap, setUsersMap] = useState(initialUsersMap);
    const [isSavingChanges, setIsSavingChanges] = useState(false);

    const userChanges = useMemo(() => {
        const changes: UsersMap = {};

        for (const [email, initialPermission] of Object.entries(
            initialUsersMap
        )) {
            const permission = usersMap[email];

            if (initialPermission === permission) {
                continue;
            }

            changes[email] = permission;
        }

        return changes;
    }, [initialUsersMap, usersMap]);

    const hasUserChanges = useMemo(
        () => !_.isEmpty(userChanges),
        [userChanges]
    );

    const isChangesSaved = useMemo(
        () => initialDefaultPermission === defaultPermission && !hasUserChanges,
        [initialDefaultPermission, defaultPermission, hasUserChanges]
    );

    const { id, refreshBoard, refreshUser } = useTaskBoard();

    const saveChanges = useCallback(async () => {
        if (isChangesSaved) {
            return;
        }

        const requests: Promise<any>[] = [];

        if (initialDefaultPermission !== defaultPermission) {
            requests.push(ClientTaskBoardAPI.patch(id, { defaultPermission }));
        }

        if (hasUserChanges) {
            const userChangeEntries = Object.entries(userChanges);
            const roleEmails = Object.groupBy(
                userChangeEntries,
                ([email, permission]) => PERMISSION_TO_ROLE[permission]
            );
            const editorEmails = roleEmails["editor"]?.map(([email]) => email);
            const workerEmails = roleEmails["worker"]?.map(([email]) => email);
            const viewerEmails = roleEmails["viewer"]?.map(([email]) => email);

            requests.push(
                ClientTaskBoardAPI.changeAccess(id, {
                    editorEmails,
                    workerEmails,
                    viewerEmails,
                })
            );
        }

        setIsSavingChanges(true);
        await Promise.allSettled(requests);
        setIsSavingChanges(false);

        refreshBoard();
        refreshUser();
    }, [
        initialDefaultPermission,
        defaultPermission,
        userChanges,
        hasUserChanges,
        isChangesSaved,
        id,
        refreshBoard,
        refreshUser,
    ]);

    return (
        <ShareDialogContext.Provider
            value={{
                setDefaultPermission,
                setUsersMap,
                isSavingChanges,
                isChangesSaved,
                saveChanges,
            }}
        >
            {children}
        </ShareDialogContext.Provider>
    );
}
