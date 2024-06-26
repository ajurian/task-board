"use client";

import { NestedTaskBoardCreate } from "@/_/schema/taskBoard";
import { AggregatedTaskListModel } from "@/_/schema/taskList";
import ClientTaskAPI from "@/api/_/layers/client/TaskAPI";
import ClientTaskBoardAPI from "@/api/_/layers/client/TaskBoardAPI";
import ClientTaskListAPI from "@/api/_/layers/client/TaskListAPI";
import { usePrevious } from "@mantine/hooks";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useLayoutEffect,
    useMemo,
    useState,
} from "react";
import useInsert from "./hooks/useInsert";
import useOptimisticUpdate from "./hooks/useOptimisticUpdate";
import useUpdate from "./hooks/useUpdate";
import {
    AddTaskListOptions,
    AddTaskOptions,
    DeleteTaskListOptions,
    EditTaskOptions,
    MoveTaskListOptions,
    MoveTaskOptions,
    RenameTaskBoardOptions,
    RenameTaskListOptions,
    TaskBoardContextValue,
    TaskBoardProviderProps,
} from "./TaskBoardProviderTypes";
import reorderArray from "./utils/reorderArray";

const TaskBoardContext = createContext<TaskBoardContextValue | null>(null);

export const useTaskBoard = () => {
    const value = useContext(TaskBoardContext);

    if (value === null) {
        throw new Error(
            "`useTaskBoard` hook must be used inside of 'TaskBoardProvider'."
        );
    }

    return value;
};

export default function TaskBoardProvider({
    selectedTaskBoard,
    children,
}: TaskBoardProviderProps) {
    const queryClient = useQueryClient();

    const [mutationQueue, setMutationQueue] = useState<(() => Promise<void>)[]>(
        []
    );
    const [asyncMutationList, setAsyncMutationList] = useState<(() => void)[]>(
        []
    );
    const previousMutationQueueSize = usePrevious(mutationQueue.length);

    const [searchQuery, setSearchQuery] = useState("");

    const [isMutationOngoing, setIsMutationOngoing] = useState(false);

    const isChangesSaved = useMemo(
        () => mutationQueue.length === 0,
        [mutationQueue]
    );

    const taskBoardQuery = useQuery({
        queryKey: ["taskBoard", selectedTaskBoard.id, searchQuery],
        queryFn: async ({ signal }) => {
            const {
                data: { taskBoard },
            } = await ClientTaskBoardAPI.get(selectedTaskBoard.id, {
                params: { searchQuery },
                signal,
            });

            if (taskBoard === null) {
                throw new Error(
                    "`selectedTaskBoard.id` is existent and yet we reached this code. (taskBoard === null)"
                );
            }

            return taskBoard;
        },
        initialData: selectedTaskBoard,
    });

    const uniqueName = useMemo(
        () => taskBoardQuery.data.uniqueName,
        [taskBoardQuery.data.uniqueName]
    );

    const [displayName, setDisplayName] = useState(
        taskBoardQuery.data.displayName
    );

    const [taskLists, setTaskLists] = useState<AggregatedTaskListModel[]>(
        taskBoardQuery.data.taskLists
    );

    const enqueueMutation = useCallback(
        (mutation: () => Promise<void>) =>
            setMutationQueue((mutationQueue) => [...mutationQueue, mutation]),
        []
    );

    const dequeueMutation = useCallback(
        () => setMutationQueue((mutationQueue) => mutationQueue.slice(1)),
        []
    );

    const addAsyncMutation = useCallback(
        (asyncMutation: () => void) =>
            setAsyncMutationList((asyncMutationList) => [
                ...asyncMutationList,
                asyncMutation,
            ]),
        []
    );

    const dispatchMutation = useCallback(() => {
        if (mutationQueue.length > 0) {
            const mutate = mutationQueue[0];
            mutate().then(dequeueMutation).catch(dequeueMutation);
        }

        if (asyncMutationList.length > 0) {
            for (const asyncMutation of asyncMutationList) {
                asyncMutation();
            }

            setAsyncMutationList([]);
        }
    }, [mutationQueue, asyncMutationList, dequeueMutation]);

    const syncTaskBoardMutation = useMutation({
        mutationKey: ["syncTaskBoard", selectedTaskBoard.id],
        mutationFn: async () => {
            const taskBoard: NestedTaskBoardCreate = {
                id: selectedTaskBoard.id,
                ownerId: selectedTaskBoard.ownerId,
                uniqueName,
                displayName,
                createdAt: selectedTaskBoard.createdAt,
                taskLists: [],
            };
            // await ClientTaskBoardAPI.sync(options);
        },
    });

    const renameTaskBoardMutation: TaskBoardContextValue["renameTaskBoardMutation"] =
        useMutation({
            mutationKey: ["renameTaskBoard", selectedTaskBoard.id],
            mutationFn: async (options) => {
                await ClientTaskBoardAPI.patch(selectedTaskBoard.id, options);
            },
        });

    const moveTaskListMutation: TaskBoardContextValue["moveTaskListMutation"] =
        useMutation({
            mutationKey: ["moveTaskList", selectedTaskBoard.id],
            mutationFn: async (options) => {
                await ClientTaskListAPI.reorder({
                    ...options,
                    boardId: selectedTaskBoard.id,
                });
            },
        });

    const moveTaskMutation: TaskBoardContextValue["moveTaskMutation"] =
        useMutation({
            mutationKey: ["moveTask", selectedTaskBoard.id],
            mutationFn: async (options) => {
                await ClientTaskAPI.reorder({
                    ...options,
                    boardId: selectedTaskBoard.id,
                });
            },
        });

    const addTaskListMutation: TaskBoardContextValue["addTaskListMutation"] =
        useMutation({
            mutationKey: ["addTaskList", selectedTaskBoard.id],
            mutationFn: async (options) => {
                await ClientTaskListAPI.post({
                    ...options,
                    taskBoardId: selectedTaskBoard.id,
                });
            },
        });

    const renameTaskListMutation: TaskBoardContextValue["renameTaskListMutation"] =
        useMutation({
            mutationKey: ["renameTaskList"],
            mutationFn: async ({ id, title }) => {
                await ClientTaskListAPI.patch(id, { title });
            },
        });

    const deleteTaskListMutation: TaskBoardContextValue["deleteTaskListMutation"] =
        useMutation({
            mutationKey: ["deleteTaskList"],
            mutationFn: async ({ id }) => {
                await ClientTaskListAPI.delete(id);
            },
        });

    const addTaskMutation: TaskBoardContextValue["addTaskMutation"] =
        useMutation({
            mutationKey: ["addTask"],
            mutationFn: async (options) => {
                await ClientTaskAPI.post(options);
            },
        });

    const editTaskMutation: TaskBoardContextValue["editTaskMutation"] =
        useMutation({
            mutationKey: ["editTask"],
            mutationFn: async ({ id, ...options }) => {
                await ClientTaskAPI.patch(id, options);
            },
        });

    const deleteTaskMutation: TaskBoardContextValue["deleteTaskMutation"] =
        useMutation({
            mutationFn: async ({ id }) => {
                await ClientTaskAPI.delete(id);
            },
        });

    const renameTaskBoardOptimistic = useCallback(
        ({ displayName }: RenameTaskBoardOptions) =>
            setDisplayName(displayName),
        []
    );

    const moveTaskListOptimistic = useOptimisticUpdate<MoveTaskListOptions>({
        setTaskLists,
        onTaskListsChange: (taskLists, options) => {
            reorderArray({
                source: taskLists,
                destination: taskLists,
                ...options,
            });

            return taskLists;
        },
    });

    const moveTaskOptimistic = useOptimisticUpdate<MoveTaskOptions>({
        setTaskLists,
        onTaskListsChange: (
            taskLists,
            { fromListIndex, toListIndex, fromIndex, toIndex }
        ) => {
            const isIntoNewList = fromListIndex !== toListIndex;

            if (taskLists[fromListIndex].tasks[fromIndex] === undefined) {
                return taskLists;
            }

            if (isIntoNewList) {
                const { tasks: fromTasks } = taskLists[fromListIndex];
                const { id: toListId, tasks: toTasks } = taskLists[toListIndex];

                reorderArray({
                    source: fromTasks,
                    destination: toTasks,
                    fromIndex,
                    toIndex,
                });

                toTasks[toIndex].taskListId = toListId;
            } else {
                const { tasks } = taskLists[fromListIndex];

                reorderArray({
                    source: tasks,
                    destination: tasks,
                    fromIndex,
                    toIndex,
                });
            }

            return taskLists;
        },
    });

    const addTaskListOptimistic = useOptimisticUpdate<AddTaskListOptions>({
        setTaskLists,
        onTaskListsChange: (taskLists, { id, title }) => {
            taskLists.push({
                id,
                taskBoardId: selectedTaskBoard.id,
                order: taskLists.length,
                title,
                createdAt: new Date(),
                tasks: [],
            });

            return taskLists;
        },
    });

    const renameTaskListOptimistic = useOptimisticUpdate<RenameTaskListOptions>(
        {
            setTaskLists,
            onTaskListsChange: (taskLists, { id, title }) => {
                const index = taskLists.findIndex(
                    (taskList) => taskList.id === id
                );

                taskLists[index].title = title;

                return taskLists;
            },
        }
    );

    const deleteTaskListOptimistic = useOptimisticUpdate<DeleteTaskListOptions>(
        {
            setTaskLists,
            onTaskListsChange: (taskLists, { id }) => {
                const index = taskLists.findIndex(
                    (taskList) => taskList.id === id
                );

                taskLists.splice(index, 1);

                for (let i = index; i < taskLists.length; i++) {
                    taskLists[i].order = i;
                }

                return taskLists;
            },
        }
    );

    const addTaskOptimistic = useOptimisticUpdate<AddTaskOptions>({
        setTaskLists,
        onTaskListsChange: (
            taskLists,
            { id, taskListId, title, details, dueAt }
        ) => {
            const taskList = taskLists.find(
                (taskList) => taskList.id === taskListId
            );

            if (taskList === undefined) {
                return taskLists;
            }

            const { tasks } = taskList;

            for (const task of tasks) {
                task.order++;
            }

            tasks.unshift({
                id,
                taskListId: taskList.id,
                order: 0,
                title,
                details,
                isDone: false,
                createdAt: new Date(),
                dueAt,
                highlights: [],
            });

            return taskLists;
        },
    });

    const editTaskOptimistic = useOptimisticUpdate<EditTaskOptions>({
        setTaskLists,
        onTaskListsChange: (
            taskLists,
            { id, title, details, isDone, dueAt }
        ) => {
            for (const taskList of taskLists) {
                const { tasks } = taskList;
                const task = tasks.find((task) => task.id === id);

                if (task === undefined) {
                    continue;
                }

                if (title !== undefined) task.title = title;
                if (details !== undefined) task.details = details;
                if (isDone !== undefined) task.isDone = isDone;
                if (dueAt !== undefined) task.dueAt = dueAt;

                break;
            }

            return taskLists;
        },
    });

    const deleteTaskOptimistic = useOptimisticUpdate<DeleteTaskListOptions>({
        setTaskLists,
        onTaskListsChange: (taskLists, { id }) => {
            for (const taskList of taskLists) {
                const { tasks } = taskList;
                const index = tasks.findIndex((taskList) => taskList.id === id);

                if (index === -1) {
                    continue;
                }

                tasks.splice(index, 1);

                for (let i = index; i < tasks.length; i++) {
                    tasks[i].order = i;
                }

                break;
            }

            return taskLists;
        },
    });

    const renameTaskBoard = useUpdate({
        mutation: renameTaskBoardMutation,
        onOptimisticUpdate: renameTaskBoardOptimistic,
        onMutationStateChange: addAsyncMutation,
    });

    const moveTaskList = useUpdate({
        mutation: moveTaskListMutation,
        onOptimisticUpdate: moveTaskListOptimistic,
        onMutationStateChange: enqueueMutation,
    });

    const moveTask = useUpdate({
        mutation: moveTaskMutation,
        onOptimisticUpdate: moveTaskOptimistic,
        onMutationStateChange: enqueueMutation,
    });

    const addTaskList = useInsert({
        mutation: addTaskListMutation,
        onOptimisticUpdate: addTaskListOptimistic,
        onMutationStateChange: enqueueMutation,
    });

    const renameTaskList = useUpdate({
        mutation: renameTaskListMutation,
        onOptimisticUpdate: renameTaskListOptimistic,
        onMutationStateChange: addAsyncMutation,
    });

    const deleteTaskList = useUpdate({
        mutation: deleteTaskListMutation,
        onOptimisticUpdate: deleteTaskListOptimistic,
        onMutationStateChange: enqueueMutation,
    });

    const addTask = useInsert({
        mutation: addTaskMutation,
        onOptimisticUpdate: addTaskOptimistic,
        onMutationStateChange: enqueueMutation,
    });

    const editTask = useUpdate({
        mutation: editTaskMutation,
        onOptimisticUpdate: editTaskOptimistic,
        onMutationStateChange: addAsyncMutation,
    });

    const deleteTask = useUpdate({
        mutation: deleteTaskMutation,
        onOptimisticUpdate: deleteTaskOptimistic,
        onMutationStateChange: enqueueMutation,
    });

    const refreshData = useCallback(
        () => queryClient.invalidateQueries({ queryKey: ["taskBoard"] }),
        [queryClient]
    );

    useLayoutEffect(() => {
        if (taskBoardQuery.isRefetching) {
            return;
        }

        setTaskLists(taskBoardQuery.data.taskLists);
    }, [taskBoardQuery.isRefetching, taskBoardQuery.data]);

    useEffect(() => {
        if (mutationQueue.length === 0 && asyncMutationList.length === 0) {
            setIsMutationOngoing(false);
            return;
        }

        if (previousMutationQueueSize === undefined) {
            return;
        }

        console.assert(
            mutationQueue.length >= previousMutationQueueSize ||
                (!moveTaskListMutation.isPending &&
                    !moveTaskMutation.isPending &&
                    !addTaskListMutation.isPending &&
                    !deleteTaskListMutation.isPending &&
                    !addTaskMutation.isPending &&
                    !deleteTaskMutation.isPending),
            mutationQueue.length,
            previousMutationQueueSize,
            moveTaskListMutation.isPending,
            moveTaskMutation.isPending,
            addTaskListMutation.isPending,
            deleteTaskListMutation.isPending,
            addTaskMutation.isPending,
            deleteTaskMutation.isPending
        );

        if (mutationQueue.length < previousMutationQueueSize) {
            dispatchMutation();
            return;
        }

        const timeout = setTimeout(() => {
            setIsMutationOngoing(true);
            dispatchMutation();
        }, 3000);

        return () => clearTimeout(timeout);
    }, [
        mutationQueue,
        asyncMutationList,
        previousMutationQueueSize,
        moveTaskListMutation,
        moveTaskMutation,
        addTaskListMutation,
        deleteTaskListMutation,
        addTaskMutation,
        deleteTaskMutation,
        dispatchMutation,
    ]);

    return (
        <TaskBoardContext.Provider
            value={{
                selectedTaskBoard,
                taskBoardQuery,
                uniqueName,
                displayName,
                taskLists,
                renameTaskBoardMutation,
                moveTaskListMutation,
                moveTaskMutation,
                addTaskListMutation,
                renameTaskListMutation,
                deleteTaskListMutation,
                addTaskMutation,
                editTaskMutation,
                deleteTaskMutation,
                renameTaskBoard,
                moveTaskList,
                moveTask,
                addTaskList,
                renameTaskList,
                deleteTaskList,
                addTask,
                editTask,
                deleteTask,
                refreshData,
                setSearchQuery,
                searchQuery,
                isMutationOngoing,
                isChangesSaved,
            }}
        >
            {children}
        </TaskBoardContext.Provider>
    );
}
