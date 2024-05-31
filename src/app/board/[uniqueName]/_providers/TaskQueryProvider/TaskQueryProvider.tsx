"use client";

import { TaskListPatchBody } from "@/app/api/taskLists/[id]/route";
import { TaskListsReorderPostBody } from "@/app/api/taskLists/reorder/route";
import {
    TaskListsPostBody,
    TaskListsPostResponse,
} from "@/app/api/taskLists/route";
import { TaskPatchBody } from "@/app/api/tasks/[id]/route";
import { TasksReorderPostBody } from "@/app/api/tasks/reorder/route";
import { TasksPostBody } from "@/app/api/tasks/route";
import { TaskCreate, TaskModel, TaskUpdate } from "@/schema/task";
import {
    TaskListCreate,
    TaskListModel,
    TaskListUpdate,
} from "@/schema/taskList";
import reorderArray, { removeFromAndInsertTo } from "@/utils/reorderArray";
import {
    useMutation,
    UseMutationResult,
    useQuery,
    useQueryClient,
    UseQueryResult,
} from "@tanstack/react-query";
import axios from "axios";
import _ from "lodash";
import {
    createContext,
    PropsWithChildren,
    useCallback,
    useContext,
    useEffect,
    useLayoutEffect,
    useMemo,
    useState,
} from "react";

interface MoveTaskListOptions {
    fromIndex: number;
    toIndex: number;
}

interface MoveTaskOptions {
    fromListIndex: number;
    toListIndex: number;
    fromIndex: number;
    toIndex: number;
}

interface AddTaskListOptions extends Omit<TaskListCreate, "taskBoardId"> {}

interface RenameTaskListOptions extends TaskListUpdate {
    id: string;
}

interface DeleteTaskListOptions {
    id: string;
}

interface AddTaskOptions extends TaskCreate {}

interface EditTaskOptions extends TaskUpdate {
    id: string;
}

interface DeleteTaskOptions {
    id: string;
}

type MutationDispatch =
    | { type: "moveTaskList"; options: MoveTaskListOptions }
    | { type: "moveTask"; options: MoveTaskOptions }
    | { type: "addTaskList"; options: AddTaskListOptions }
    | { type: "deleteTaskList"; options: DeleteTaskListOptions }
    | { type: "addTask"; options: AddTaskOptions }
    | { type: "deleteTask"; options: DeleteTaskOptions };

interface TaskListsQueryData extends TaskListModel {
    tasks: TaskModel[];
}

interface TaskQueryContextValue {
    taskListsQuery: UseQueryResult<TaskListsQueryData[]>;
    taskLists: TaskListsQueryData[];
    moveTaskListMutation: UseMutationResult<void, Error, MoveTaskListOptions>;
    moveTaskMutation: UseMutationResult<void, Error, MoveTaskOptions>;
    addTaskListMutation: UseMutationResult<void, Error, AddTaskListOptions>;
    renameTaskListMutation: UseMutationResult<
        void,
        Error,
        RenameTaskListOptions
    >;
    deleteTaskListMutation: UseMutationResult<
        void,
        Error,
        DeleteTaskListOptions
    >;
    addTaskMutation: UseMutationResult<void, Error, AddTaskOptions>;
    editTaskMutation: UseMutationResult<void, Error, EditTaskOptions>;
    deleteTaskMutation: UseMutationResult<void, Error, DeleteTaskOptions>;
    moveTaskList: (options: MoveTaskListOptions) => void;
    moveTask: (options: MoveTaskOptions) => void;
    addTaskList: (options: AddTaskListOptions) => void;
    renameTaskList: (options: RenameTaskListOptions) => void;
    deleteTaskList: (options: DeleteTaskListOptions) => void;
    addTask: (options: AddTaskOptions) => void;
    editTask: (options: EditTaskOptions) => void;
    deleteTask: (options: DeleteTaskOptions) => void;
    isMutationPending: boolean;
}

interface TaskQueryProviderProps extends PropsWithChildren {
    boardId: string;
}

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
    boardId,
    children,
}: TaskQueryProviderProps) {
    const queryClient = useQueryClient();

    const taskListsQuery = useQuery({
        queryKey: ["taskLists", boardId],
        queryFn: async ({ signal }) => {
            const { data: taskLists } = await axios.get<TaskListModel[]>(
                `/api/taskLists?boardId=${boardId}`,
                { signal }
            );

            return Promise.all(
                taskLists.map(async (taskList) => {
                    const { data: tasks } = await axios.get<TaskModel[]>(
                        `/api/tasks?listId=${taskList.id}`,
                        { signal }
                    );

                    return { ...taskList, tasks };
                })
            );
        },
        initialData: [],
    });

    const [taskLists, setTaskLists] = useState(taskListsQuery.data);
    const [mutationQueue, setMutationQueue] = useState<MutationDispatch[]>([]);

    const popMutationQueue = useCallback(
        () => setMutationQueue((mutationQueue) => mutationQueue.slice(1)),
        []
    );

    const moveTaskListMutation: TaskQueryContextValue["moveTaskListMutation"] =
        useMutation({
            mutationKey: ["moveTaskList"],
            mutationFn: async (options) => {
                const body: TaskListsReorderPostBody = {
                    boardId,
                    ...options,
                };

                await axios.post("/api/taskLists/reorder", body);
            },
        });

    const moveTaskMutation: TaskQueryContextValue["moveTaskMutation"] =
        useMutation({
            mutationKey: ["moveTask"],
            mutationFn: async (options) => {
                const body: TasksReorderPostBody = {
                    boardId,
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
                    taskBoardId: boardId,
                    ...options,
                };

                await axios.post<TaskListsPostResponse>("/api/taskLists", body);
            },
            onSettled: () =>
                queryClient.invalidateQueries({
                    queryKey: ["taskLists", boardId],
                }),
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
            mutationKey: ["addTask"],
            mutationFn: ({ id }) => axios.delete(`/api/tasks${id}`),
        });

    const isMutationPending = useMemo(
        () =>
            mutationQueue.length > 0 ||
            moveTaskListMutation.isPending ||
            moveTaskMutation.isPending ||
            addTaskListMutation.isPending ||
            renameTaskListMutation.isPending ||
            deleteTaskListMutation.isPending ||
            addTaskMutation.isPending ||
            editTaskMutation.isPending ||
            deleteTaskMutation.isPending,
        [
            mutationQueue,
            moveTaskListMutation,
            moveTaskMutation,
            addTaskListMutation,
            renameTaskListMutation,
            deleteTaskListMutation,
            addTaskMutation,
            editTaskMutation,
            deleteTaskMutation,
        ]
    );

    const moveTaskListOptimistic = useCallback(
        (options: MoveTaskListOptions) =>
            setTaskLists((taskLists) =>
                reorderArray({
                    array: taskLists,
                    ...options,
                })
            ),
        []
    );

    const moveTaskOptimistic = useCallback(
        ({ fromListIndex, toListIndex, fromIndex, toIndex }: MoveTaskOptions) =>
            setTaskLists((taskLists) => {
                const newTaskLists = _.cloneDeep(taskLists);
                const isIntoNewList = fromListIndex !== toListIndex;

                if (
                    newTaskLists[fromListIndex].tasks[fromIndex] === undefined
                ) {
                    return newTaskLists;
                }

                if (isIntoNewList) {
                    const { tasks: fromTasks } = newTaskLists[fromListIndex];
                    const { id: toListId, tasks: toTasks } =
                        newTaskLists[toListIndex];

                    removeFromAndInsertTo({
                        fromArray: fromTasks,
                        toArray: toTasks,
                        fromIndex,
                        toIndex,
                    });

                    toTasks[toIndex].taskListId = toListId;

                    for (let i = fromIndex; i < fromTasks.length; i++) {
                        fromTasks[i].order = i;
                    }

                    for (let i = toIndex; i < toTasks.length; i++) {
                        toTasks[i].order = i;
                    }
                } else {
                    const { tasks } = newTaskLists[fromListIndex];

                    reorderArray({
                        array: tasks,
                        fromIndex,
                        toIndex,
                        clone: false,
                    });
                }

                return newTaskLists;
            }),
        []
    );

    const addTaskListOptimistic = useCallback(
        ({ title }: AddTaskListOptions) =>
            setTaskLists((taskLists) => {
                const newTaskLists = _.cloneDeep(taskLists);
                const now = new Date();

                newTaskLists.push({
                    id: now.getTime().toString(),
                    taskBoardId: boardId,
                    order: taskLists.length,
                    title,
                    createdAt: now,
                    tasks: [],
                });

                return newTaskLists;
            }),
        [boardId]
    );

    const renameTaskListOptimistic = useCallback(
        ({ id, title }: RenameTaskListOptions) =>
            setTaskLists((taskLists) => {
                const newTaskLists = _.cloneDeep(taskLists);
                const index = newTaskLists.findIndex(
                    (taskList) => taskList.id === id
                );

                newTaskLists[index].title = title;

                return newTaskLists;
            }),
        []
    );

    const deleteTaskListOptimistic = useCallback(
        ({ id }: DeleteTaskListOptions) =>
            setTaskLists((taskLists) => {
                const newTaskLists = _.cloneDeep(taskLists);
                const index = newTaskLists.findIndex(
                    (taskList) => taskList.id === id
                );

                newTaskLists.splice(index, 1);

                return newTaskLists;
            }),
        []
    );

    const addTaskOptimistic = useCallback(
        ({ taskListId, title, details, dueAt }: AddTaskOptions) =>
            setTaskLists((taskLists) => {
                const newTaskLists = _.cloneDeep(taskLists);
                const taskList = newTaskLists.find(
                    (taskList) => taskList.id === taskListId
                );

                if (taskList === undefined) {
                    return newTaskLists;
                }

                const now = new Date();
                taskList.tasks.unshift({
                    id: now.getTime().toString(),
                    taskListId: taskList.id,
                    order: 0,
                    title,
                    details,
                    status: "pending",
                    createdAt: now,
                    dueAt,
                });

                return newTaskLists;
            }),
        []
    );

    const editTaskOptimistic = useCallback(
        ({ id, title, details, status, dueAt }: EditTaskOptions) =>
            setTaskLists((taskLists) => {
                const newTaskLists = _.cloneDeep(taskLists);

                for (const taskList of newTaskLists) {
                    const { tasks } = taskList;
                    const task = tasks.find((task) => task.id === id);

                    if (task === undefined) {
                        continue;
                    }

                    if (title !== undefined) task.title = title;
                    if (details !== undefined) task.details = details;
                    if (status !== undefined) task.status = status;
                    if (dueAt !== undefined) task.dueAt = dueAt;

                    break;
                }

                return newTaskLists;
            }),
        []
    );

    const deleteTaskOptimistic = useCallback(
        ({ id }: DeleteTaskOptions) =>
            setTaskLists((taskLists) => {
                const newTaskLists = _.cloneDeep(taskLists);
                const index = newTaskLists.findIndex(
                    (taskList) => taskList.id === id
                );

                newTaskLists.splice(index, 1);

                return newTaskLists;
            }),
        []
    );

    const moveTaskList = useCallback<TaskQueryContextValue["moveTaskList"]>(
        (options) => {
            moveTaskListOptimistic(options);
            setMutationQueue((mutationQueue) => [
                ...mutationQueue,
                { type: "moveTaskList", options },
            ]);
        },
        [moveTaskListOptimistic]
    );

    const moveTask = useCallback<TaskQueryContextValue["moveTask"]>(
        (options) => {
            moveTaskOptimistic(options);
            setMutationQueue((mutationQueue) => [
                ...mutationQueue,
                { type: "moveTask", options },
            ]);
        },
        [moveTaskOptimistic]
    );

    const addTaskList = useCallback<TaskQueryContextValue["addTaskList"]>(
        (options) => {
            addTaskListOptimistic(options);
            setMutationQueue((mutationQueue) => [
                ...mutationQueue,
                { type: "addTaskList", options },
            ]);
        },
        [addTaskListOptimistic]
    );

    const renameTaskList = useCallback<TaskQueryContextValue["renameTaskList"]>(
        (options) => {
            renameTaskListOptimistic(options);
            renameTaskListMutation.mutate(options);
        },
        [renameTaskListOptimistic, renameTaskListMutation]
    );

    const deleteTaskList = useCallback<TaskQueryContextValue["deleteTaskList"]>(
        (options) => {
            deleteTaskListOptimistic(options);
            setMutationQueue((mutationQueue) => [
                ...mutationQueue,
                { type: "deleteTaskList", options },
            ]);
        },
        [deleteTaskListOptimistic]
    );

    const addTask = useCallback<TaskQueryContextValue["addTask"]>(
        (options) => {
            addTaskOptimistic(options);
            setMutationQueue((mutationQueue) => [
                ...mutationQueue,
                { type: "addTask", options },
            ]);
        },
        [addTaskOptimistic]
    );

    const editTask = useCallback<TaskQueryContextValue["editTask"]>(
        (options) => {
            editTaskOptimistic(options);
            editTaskMutation.mutate(options);
        },
        [editTaskOptimistic, editTaskMutation]
    );

    const deleteTask = useCallback<TaskQueryContextValue["deleteTask"]>(
        (options) => {
            deleteTaskOptimistic(options);
            setMutationQueue((mutationQueue) => [
                ...mutationQueue,
                { type: "deleteTask", options },
            ]);
        },
        [deleteTaskOptimistic]
    );

    useLayoutEffect(
        () => setTaskLists(taskListsQuery.data),
        [taskListsQuery.data]
    );

    useEffect(() => {
        if (
            mutationQueue.length === 0 ||
            moveTaskListMutation.isPending ||
            moveTaskMutation.isPending ||
            addTaskListMutation.isPending ||
            deleteTaskListMutation.isPending ||
            addTaskMutation.isPending ||
            deleteTaskMutation.isPending
        ) {
            return;
        }

        const { type, options } = mutationQueue[0];

        if (type === "moveTaskList") {
            moveTaskListMutation.mutateAsync(options).then(popMutationQueue);
            return;
        }

        if (type === "moveTask") {
            moveTaskMutation.mutateAsync(options).then(popMutationQueue);
            return;
        }

        if (type === "addTaskList") {
            addTaskListMutation.mutateAsync(options).then(popMutationQueue);
            return;
        }

        if (type === "deleteTaskList") {
            deleteTaskListMutation.mutateAsync(options).then(popMutationQueue);
            return;
        }

        if (type === "addTask") {
            addTaskMutation.mutateAsync(options).then(popMutationQueue);
            return;
        }

        if (type === "deleteTask") {
            deleteTaskMutation.mutateAsync(options).then(popMutationQueue);
            return;
        }
    }, [
        mutationQueue,
        popMutationQueue,
        moveTaskListMutation,
        moveTaskMutation,
        addTaskListMutation,
        deleteTaskListMutation,
        addTaskMutation,
        deleteTaskMutation,
    ]);

    return (
        <TaskQueryContext.Provider
            value={{
                taskListsQuery,
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
                isMutationPending,
            }}
        >
            {children}
        </TaskQueryContext.Provider>
    );
}
