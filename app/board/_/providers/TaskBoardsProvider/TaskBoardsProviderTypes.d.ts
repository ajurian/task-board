import { TaskBoardUsersGetResponseManyWithTaskBoards } from "@/api/_/common/schema/taskBoardUsers";
import { UseQueryResult } from "@tanstack/react-query";
import { PropsWithChildren } from "react";

interface TaskBoardsContextValue {
    taskBoardsQuery: UseQueryResult<
        TaskBoardUsersGetResponseManyWithTaskBoards["taskBoardUsers"]
    >;
    refreshData: () => Promise<void>;
}

interface TaskBoardsProviderProps extends PropsWithChildren {}
