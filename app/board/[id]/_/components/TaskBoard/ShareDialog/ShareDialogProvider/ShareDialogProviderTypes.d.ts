import { AggregatedTaskBoardModel } from "@/_/common/schema/taskBoard.aggregation";
import { Dispatch, PropsWithChildren, SetStateAction } from "react";

type UsersMap = Record<string, number>;

interface ShareDialogContextValue {
    setDefaultPermission: Dispatch<SetStateAction<number>>;
    setUsersMap: Dispatch<SetStateAction<UsersMap>>;
    isSavingChanges: boolean;
    isChangesSaved: boolean;
    saveChanges: () => Promise<void>;
}

interface ShareDialogProviderProps extends PropsWithChildren {
    initialDefaultPermission: number;
    initialUsers: Pick<
        AggregatedTaskBoardModel["users"][number],
        "user" | "permission"
    >[];
}
