import { AggregatedTaskListModel } from "@/_/common/schema/taskList";
import _ from "lodash";
import { Dispatch, SetStateAction, useCallback } from "react";
import { UpdateOptions } from "../TaskBoardProviderTypes";

interface UseOptimisticUpdateOptions<T extends UpdateOptions> {
    setTaskLists: Dispatch<SetStateAction<AggregatedTaskListModel[]>>;
    onTaskListsChange: (
        taskLists: AggregatedTaskListModel[],
        options: T
    ) => AggregatedTaskListModel[];
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
