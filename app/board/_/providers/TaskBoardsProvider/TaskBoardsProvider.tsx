"use client";

import { useUserInfo } from "@/_/providers/UserInfoProvider";
import ClientTaskBoardUserAPI from "@/api/_/common/layers/client/TaskBoardUserAPI";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useCallback, useContext } from "react";
import {
    TaskBoardsContextValue,
    TaskBoardsProviderProps,
} from "./TaskBoardsProviderTypes";

const TaskBoardsContext = createContext<TaskBoardsContextValue | null>(null);

export const useTaskBoards = () => {
    const value = useContext(TaskBoardsContext);

    if (value === null) {
        throw new Error(
            "`useTaskBoards` hook must be used inside of 'TaskBoardsProvider'."
        );
    }

    return value;
};

export default function TaskBoardsProvider({
    children,
}: TaskBoardsProviderProps) {
    const queryClient = useQueryClient();
    const userInfo = useUserInfo();

    const taskBoardsQuery = useQuery({
        queryKey: ["taskBoards", userInfo?.sub],
        queryFn: async () => {
            const {
                data: { taskBoardUsers: taskBoards },
            } = await ClientTaskBoardUserAPI.get();

            return taskBoards;
        },
    });

    const refreshData = useCallback(
        () => queryClient.invalidateQueries({ queryKey: ["taskBoards"] }),
        [queryClient]
    );

    return (
        <TaskBoardsContext.Provider value={{ taskBoardsQuery, refreshData }}>
            {children}
        </TaskBoardsContext.Provider>
    );
}
