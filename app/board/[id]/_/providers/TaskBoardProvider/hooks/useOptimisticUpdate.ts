import { AggregatedTaskListModel } from "@/_/common/schema/taskList";
import _ from "lodash";
import {
    Dispatch,
    SetStateAction,
    useCallback,
    useEffect,
    useRef,
} from "react";
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
    const setTaskListsRef = useRef(setTaskLists);
    const onTaskListsChangeRef = useRef(onTaskListsChange);

    useEffect(() => {
        setTaskListsRef.current = setTaskLists;
    }, [setTaskLists]);

    useEffect(() => {
        onTaskListsChangeRef.current = onTaskListsChange;
    }, [onTaskListsChange]);

    return useCallback(
        (options: O) =>
            setTaskListsRef.current((taskLists) =>
                onTaskListsChangeRef.current(_.cloneDeep(taskLists), options)
            ),
        []
    );
}
