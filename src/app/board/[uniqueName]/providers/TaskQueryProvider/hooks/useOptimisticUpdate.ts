import _ from "lodash";
import { Dispatch, SetStateAction, useCallback } from "react";
import { TaskListsQueryData, UpdateOptions } from "../TaskQueryProviderTypes";

interface UseOptimisticUpdateOptions<T extends UpdateOptions> {
    setTaskLists: Dispatch<SetStateAction<TaskListsQueryData[]>>;
    onTaskListsChange: (
        taskLists: TaskListsQueryData[],
        options: T
    ) => TaskListsQueryData[];
}

export default function useOptimisticUpdate<T extends UpdateOptions>({
    setTaskLists,
    onTaskListsChange,
}: UseOptimisticUpdateOptions<T>) {
    return useCallback(
        (options: T) =>
            setTaskLists((taskLists) =>
                onTaskListsChange(_.cloneDeep(taskLists), options)
            ),
        [setTaskLists, onTaskListsChange]
    );
}
