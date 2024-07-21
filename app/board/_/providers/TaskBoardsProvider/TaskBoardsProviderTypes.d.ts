import { TaskBoardUsersGetResponse } from "@/api/_/common/schema/taskBoardUsers";
import { UseQueryResult } from "@tanstack/react-query";
import { PropsWithChildren } from "react";

interface TaskBoardsContextValue {
    taskBoardsQuery: UseQueryResult<
        TaskBoardUsersGetResponse<{ userGoogleId: string }>["taskBoardUsers"]
    >;
}

interface TaskBoardsProviderProps extends PropsWithChildren {}
