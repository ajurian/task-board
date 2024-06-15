"use client";

import { TaskBoardGetResponse } from "@/app/api/taskBoards/[id]/route";
import { TaskListPatchBody } from "@/app/api/taskLists/[id]/route";
import { TaskListsReorderPostBody } from "@/app/api/taskLists/reorder/route";
import { TaskListsPostBody } from "@/app/api/taskLists/route";
import { TaskPatchBody } from "@/app/api/tasks/[id]/route";
import { TasksReorderPostBody } from "@/app/api/tasks/reorder/route";
import { TasksPostBody } from "@/app/api/tasks/route";
import reorderArray from "@/app/board/[uniqueName]/providers/TaskQueryProvider/utils/reorderArray";
import { AggregatedTaskBoardModelSchema } from "@/schema/taskBoard";
import { AggregatedTaskListModel } from "@/schema/taskList";
import { usePrevious } from "@mantine/hooks";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
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
    RenameTaskListOptions,
    TaskQueryContextValue,
    TaskQueryProviderProps,
} from "./TaskQueryProviderTypes";

const TaskQueryContext = createContext<TaskQueryContextValue | null>(null);

export const useTaskQuery = () => {
    const value = useContext(TaskQueryContext);

    if (value === null) {
        throw new Error(
            "'useTaskQuery' hook must be used inside of 'TaskQueryProvider'."
        );
    }

    return value;
};

export default function TaskQueryProvider({
    selectedTaskBoard,
    children,
}: TaskQueryProviderProps) {
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
        queryKey: ["taskBoard", selectedTaskBoard.ownerId, searchQuery],
        queryFn: async ({ signal }) => {
            const {
                data: { taskBoard: taskBoardRaw },
            } = await axios.get<TaskBoardGetResponse>(
                `/api/taskBoards/${selectedTaskBoard.id}`,
                {
                    params: { searchQuery },
                    signal,
                }
            );
            const taskBoard =
                AggregatedTaskBoardModelSchema.parse(taskBoardRaw);

            return taskBoard;
        },
        initialData: selectedTaskBoard,
    });

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

    const moveTaskListMutation: TaskQueryContextValue["moveTaskListMutation"] =
        useMutation({
            mutationKey: ["moveTaskList", selectedTaskBoard.id],
            mutationFn: async (options) => {
                const body: TaskListsReorderPostBody = {
                    boardId: selectedTaskBoard.id,
                    ...options,
                };

                await axios.post("/api/taskLists/reorder", body);
            },
        });

    const moveTaskMutation: TaskQueryContextValue["moveTaskMutation"] =
        useMutation({
            mutationKey: ["moveTask", selectedTaskBoard.id],
            mutationFn: async (options) => {
                const body: TasksReorderPostBody = {
                    boardId: selectedTaskBoard.id,
                    ...options,
                };

                await axios.post("/api/tasks/reorder", body);
            },
        });

    const addTaskListMutation: TaskQueryContextValue["addTaskListMutation"] =
        useMutation({
            mutationKey: ["addTaskList"],
            mutationFn: async (options) => {
                const body: TaskListsPostBody = {
                    taskBoardId: selectedTaskBoard.id,
                    ...options,
                };

                await axios.post("/api/taskLists", body);
            },
        });

    const renameTaskListMutation: TaskQueryContextValue["renameTaskListMutation"] =
        useMutation({
            mutationKey: ["renameTaskList"],
            mutationFn: async ({ id, title }) => {
                const body: TaskListPatchBody = { title };
                await axios.patch(`/api/taskLists/${id}`, body);
            },
        });

    const deleteTaskListMutation: TaskQueryContextValue["deleteTaskListMutation"] =
        useMutation({
            mutationKey: ["deleteTaskList"],
            mutationFn: ({ id }) => axios.delete(`/api/taskLists/${id}`),
        });

    const addTaskMutation: TaskQueryContextValue["addTaskMutation"] =
        useMutation({
            mutationKey: ["addTask"],
            mutationFn: async (options) => {
                const body: TasksPostBody = options;
                await axios.post("/api/tasks", body);
            },
        });

    const editTaskMutation: TaskQueryContextValue["editTaskMutation"] =
        useMutation({
            mutationKey: ["editTask"],
            mutationFn: async ({ id, ...options }) => {
                const body: TaskPatchBody = options;
                await axios.patch(`/api/tasks/${id}`, body);
            },
        });

    const deleteTaskMutation: TaskQueryContextValue["deleteTaskMutation"] =
        useMutation({
            mutationKey: ["deleteTask"],
            mutationFn: ({ id }) => axios.delete(`/api/tasks/${id}`),
        });

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
        onMutationStateChange: enqueueMutation,
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
        <TaskQueryContext.Provider
            value={{
                selectedTaskBoard,
                taskBoardQuery,
                taskLists,
                moveTaskListMutation,
                moveTaskMutation,
                addTaskListMutation,
                renameTaskListMutation,
                deleteTaskListMutation,
                addTaskMutation,
                editTaskMutation,
                deleteTaskMutation,
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
        </TaskQueryContext.Provider>
    );
}
