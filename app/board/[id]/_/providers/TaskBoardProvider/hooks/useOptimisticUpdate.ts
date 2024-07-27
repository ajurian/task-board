import { AggregatedTaskListModel } from "@/_/common/schema/taskList";
import _ from "lodash";
import { Dispatch, SetStateAction, useCallback } from "react";
import { UpdateOptions } from "../TaskBoardProviderTypes";

interface UseOptimisticUpdateOptions<O extends UpdateOptions> {
    setTaskLists: Dispatch<SetStateAction<AggregatedTaskListModel[]>>;
    onTaskListsChange: (
        taskLists: AggregatedTaskListModel[],
        options: O
    ) => AggregatedTaskListModel[];
}

export default function useOptimisticUpdate<O extends UpdateOptions>({
    setTaskLists,
    onTaskListsChange,
}: UseOptimisticUpdateOptions<O>) {
    return useCallback(
        (options: O) =>
            setTaskLists((taskLists) =>
                onTaskListsChange(_.cloneDeep(taskLists), options)
            ),
        [setTaskLists, onTaskListsChange]
    );
}
