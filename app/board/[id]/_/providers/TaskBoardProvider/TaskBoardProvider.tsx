"use client";

import {
    PERMISSION_TASK_BOARD_UPDATE_DEFAULT_PERMISSION,
    PERMISSION_TASK_BOARD_UPDATE_DISPLAY_NAME,
    PERMISSION_TASK_BOARD_UPDATE_FLOW_DIRECTION,
    PERMISSION_TASK_BOARD_UPDATE_THUMBNAIL,
    PERMISSION_TASK_BOARD_USER_UPDATE_PERMISSION,
    PERMISSION_TASK_CREATE_DELETE,
    PERMISSION_TASK_LIST_CREATE_DELETE,
    PERMISSION_TASK_LIST_REORDER,
    PERMISSION_TASK_LIST_UPDATE_TITLE,
    PERMISSION_TASK_REORDER,
    PERMISSION_TASK_UPDATE_DETAILS,
    PERMISSION_TASK_UPDATE_DUE_AT,
    PERMISSION_TASK_UPDATE_IS_DONE,
    PERMISSION_TASK_UPDATE_TITLE,
} from "@/_/common/constants/permissions";
import { AggregatedTaskListModel } from "@/_/common/schema/taskList";
import ClientTaskAPI from "@/api/_/common/layers/client/TaskAPI";
import ClientTaskBoardAPI from "@/api/_/common/layers/client/TaskBoardAPI";
import ClientTaskBoardUserAPI from "@/api/_/common/layers/client/TaskBoardUserAPI";
import ClientTaskListAPI from "@/api/_/common/layers/client/TaskListAPI";
import { usePrevious } from "@mantine/hooks";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import html2canvas from "html2canvas";
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
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
    taskBoardUser: initialTaskBoardUser,
    children,
}: TaskBoardProviderProps) {
    const queryClient = useQueryClient();

    const [mutationQueue, setMutationQueue] = useState<(() => Promise<void>)[]>(
        []
    );
    const [asyncMutationList, setAsyncMutationList] = useState<
        (() => Promise<void>)[]
    >([]);
    const previousMutationQueueSize = usePrevious(mutationQueue.length);
    const previousAsyncMutationListSize = usePrevious(asyncMutationList.length);

    const [searchQuery, setSearchQuery] = useState("");

    const [isMutationOngoing, setIsMutationOngoing] = useState(false);

    const isChangesSaved = useMemo(
        () => mutationQueue.length === 0 && asyncMutationList.length === 0,
        [mutationQueue, asyncMutationList]
    );

    const taskBoardQuery = useQuery({
        queryKey: ["taskBoard", selectedTaskBoard, searchQuery],
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

    const taskBoardUserQuery = useQuery({
        queryKey: ["taskBoardUser", selectedTaskBoard.id],
        queryFn: async ({ signal }) => {
            const {
                data: { taskBoardUser },
            } = await ClientTaskBoardUserAPI.getFromTaskBoard(
                selectedTaskBoard.id,
                { signal }
            );

            if (taskBoardUser === null) {
                throw new Error(
                    "`selectedTaskBoard.id` is existent and yet we reached this code. (taskBoardUser === null)"
                );
            }

            return taskBoardUser;
        },
        initialData: initialTaskBoardUser,
    });

    const id = useMemo(() => taskBoardQuery.data.id, [taskBoardQuery.data.id]);

    const [displayName, setDisplayName] = useState(
        taskBoardQuery.data.displayName
    );

    const [flowDirection, setFlowDirection] = useState(
        taskBoardQuery.data.flowDirection
    );

    const defaultPermission = useMemo(
        () => taskBoardQuery.data.defaultPermission,
        [taskBoardQuery.data.defaultPermission]
    );

    const [taskLists, setTaskLists] = useState<AggregatedTaskListModel[]>(
        taskBoardQuery.data.taskLists
    );

    const users = useMemo(
        () => taskBoardQuery.data.users,
        [taskBoardQuery.data.users]
    );

    const taskBoardUser = useMemo(
        () => taskBoardUserQuery.data,
        [taskBoardUserQuery.data]
    );

    const canUserChangeRole =
        (taskBoardUser.permission &
            PERMISSION_TASK_BOARD_USER_UPDATE_PERMISSION) !==
        0;

    const canUserRenameTaskBoard =
        (taskBoardUser.permission &
            PERMISSION_TASK_BOARD_UPDATE_DISPLAY_NAME) !==
        0;
    const canUserToggleFlowDirection =
        (taskBoardUser.permission &
            PERMISSION_TASK_BOARD_UPDATE_FLOW_DIRECTION) !==
        0;
    const canUserUpdateDefaultPermission =
        (taskBoardUser.permission &
            PERMISSION_TASK_BOARD_UPDATE_DEFAULT_PERMISSION) !==
        0;
    const canUserUpdateThumbnail =
        (taskBoardUser.permission & PERMISSION_TASK_BOARD_UPDATE_THUMBNAIL) !==
        0;

    const canUserCreateOrDeleteTaskList =
        (taskBoardUser.permission & PERMISSION_TASK_LIST_CREATE_DELETE) !== 0;
    const canUserRenameTaskList =
        (taskBoardUser.permission & PERMISSION_TASK_LIST_UPDATE_TITLE) !== 0;
    const canUserReorderTaskList =
        (taskBoardUser.permission & PERMISSION_TASK_LIST_REORDER) !== 0;

    const canUserCreateOrDeleteTask =
        (taskBoardUser.permission & PERMISSION_TASK_CREATE_DELETE) !== 0;
    const canUserUpdateTaskTitle =
        (taskBoardUser.permission & PERMISSION_TASK_UPDATE_TITLE) !== 0;
    const canUserUpdateTaskDetails =
        (taskBoardUser.permission & PERMISSION_TASK_UPDATE_DETAILS) !== 0;
    const canUserCompleteTask =
        (taskBoardUser.permission & PERMISSION_TASK_UPDATE_IS_DONE) !== 0;
    const canUserScheduleTask =
        (taskBoardUser.permission & PERMISSION_TASK_UPDATE_DUE_AT) !== 0;
    const canUserReorderTask =
        (taskBoardUser.permission & PERMISSION_TASK_REORDER) !== 0;

    const isUserVisitor = useMemo(
        () => taskBoardUser.isVisitor,
        [taskBoardUser.isVisitor]
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
        (asyncMutation: () => Promise<void>) =>
            setAsyncMutationList((asyncMutationList) => [
                ...asyncMutationList,
                asyncMutation,
            ]),
        []
    );

    const clearAsyncMutation = useCallback(() => setAsyncMutationList([]), []);

    const dispatchMutation = useCallback(() => {
        if (mutationQueue.length > 0) {
            const mutate = mutationQueue[0];
            mutate().then(dequeueMutation).catch(dequeueMutation);
        }

        if (asyncMutationList.length > 0) {
            Promise.allSettled(
                asyncMutationList.map((asyncMutation) => asyncMutation())
            )
                .then(clearAsyncMutation)
                .catch(clearAsyncMutation);
        }
    }, [mutationQueue, asyncMutationList, dequeueMutation, clearAsyncMutation]);

    const renameTaskBoardMutation: TaskBoardContextValue["renameTaskBoardMutation"] =
        useMutation({
            mutationKey: ["renameTaskBoard", selectedTaskBoard.id],
            mutationFn: async (options) => {
                await ClientTaskBoardAPI.patch(selectedTaskBoard.id, options);
            },
        });

    const toggleFlowDirectionMutation: TaskBoardContextValue["toggleFlowDirectionMutation"] =
        useMutation({
            mutationKey: [
                "toggleFlowDirection",
                selectedTaskBoard.id,
                flowDirection,
            ],
            mutationFn: async () => {
                await ClientTaskBoardAPI.patch(selectedTaskBoard.id, {
                    flowDirection: flowDirection === "row" ? "column" : "row",
                });
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
            mutationKey: ["deleteTask"],
            mutationFn: async ({ id }) => {
                await ClientTaskAPI.delete(id);
            },
        });

    const renameTaskBoardOptimistic = useCallback(
        ({ displayName }: RenameTaskBoardOptions) =>
            setDisplayName(displayName),
        []
    );

    const toggleFlowDirectionOptimistic = useCallback(
        () =>
            setFlowDirection((flowDirection) =>
                flowDirection === "row" ? "column" : "row"
            ),
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

    const toggleFlowDirection = useUpdate({
        mutation: toggleFlowDirectionMutation,
        onOptimisticUpdate: toggleFlowDirectionOptimistic,
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

    const refreshBoard = useCallback(
        () => queryClient.invalidateQueries({ queryKey: ["taskBoard"] }),
        [queryClient]
    );

    const refreshUser = useCallback(
        () => queryClient.invalidateQueries({ queryKey: ["taskBoardUser"] }),
        [queryClient]
    );

    const snapshotNodeRef = useRef<HTMLElement | null>(null);

    const takeSnapshot = useCallback(() => {
        const snapshotNode =
            document.querySelector("main")?.cloneNode(true) ?? null;
        snapshotNodeRef.current = snapshotNode as HTMLElement;
    }, []);

    const saveSnapshot = useCallback(async () => {
        const snapshotNode = snapshotNodeRef.current;

        if (snapshotNode === null) {
            return;
        }

        document.body.appendChild(snapshotNode);

        snapshotNode.style.width = "512px";
        snapshotNode.style.height = "512px";

        const canvas = await html2canvas(snapshotNode, {
            logging: false,
            windowWidth: 512,
            windowHeight: 512,
            width: 512,
            height: 512,
            scrollX: 0,
            scrollY: 0,
        });

        document.body.removeChild(snapshotNode);

        if (!canUserUpdateThumbnail) {
            return;
        }

        /* await ClientTaskBoardAPI.patch(selectedTaskBoard.id, {
            thumbnailData: canvas.toDataURL("image/jpeg").split(";base64,")[1],
        }); */
    }, [selectedTaskBoard.id, canUserUpdateThumbnail]);

    useLayoutEffect(() => {
        if (taskBoardQuery.isRefetching) {
            return;
        }

        setDisplayName(taskBoardQuery.data.displayName);
        setFlowDirection(taskBoardQuery.data.flowDirection);
        setTaskLists(taskBoardQuery.data.taskLists);
    }, [taskBoardQuery.isRefetching, taskBoardQuery.data]);

    useEffect(() => {
        if (
            previousMutationQueueSize === undefined ||
            previousAsyncMutationListSize === undefined
        ) {
            return;
        }

        if (isChangesSaved) {
            if (
                previousMutationQueueSize > 0 ||
                previousAsyncMutationListSize > 0
            ) {
                saveSnapshot().catch(() => {});
            }

            setIsMutationOngoing(false);
            return;
        }

        if (mutationQueue.length < previousMutationQueueSize) {
            dispatchMutation();
            return;
        }

        if (
            mutationQueue.length > previousMutationQueueSize ||
            asyncMutationList.length > 0
        ) {
            takeSnapshot();
        }

        const timeout = setTimeout(() => {
            setIsMutationOngoing(true);
            dispatchMutation();
        }, 1500);

        return () => clearTimeout(timeout);
    }, [
        mutationQueue,
        asyncMutationList,
        previousMutationQueueSize,
        previousAsyncMutationListSize,
        isChangesSaved,
        dispatchMutation,
        takeSnapshot,
        saveSnapshot,
    ]);

    useEffect(() => {
        takeSnapshot();
        saveSnapshot().catch(() => {});
    }, [takeSnapshot, saveSnapshot]);

    useEffect(() => {
        ClientTaskBoardUserAPI.patch(taskBoardUser.id, {
            recentlyAccessedAt: new Date(),
        });
    }, [taskBoardUser.id]);

    return (
        <TaskBoardContext.Provider
            value={{
                selectedTaskBoard,
                taskBoardQuery,
                id,
                displayName,
                flowDirection,
                defaultPermission,
                taskLists,
                users,
                taskBoardUser,
                canUserChangeRole,
                canUserRenameTaskBoard,
                canUserToggleFlowDirection,
                canUserUpdateDefaultPermission,
                canUserUpdateThumbnail,
                canUserCreateOrDeleteTaskList,
                canUserRenameTaskList,
                canUserReorderTaskList,
                canUserCreateOrDeleteTask,
                canUserUpdateTaskTitle,
                canUserUpdateTaskDetails,
                canUserCompleteTask,
                canUserScheduleTask,
                canUserReorderTask,
                isUserVisitor,
                renameTaskBoardMutation,
                toggleFlowDirectionMutation,
                moveTaskListMutation,
                moveTaskMutation,
                addTaskListMutation,
                renameTaskListMutation,
                deleteTaskListMutation,
                addTaskMutation,
                editTaskMutation,
                deleteTaskMutation,
                renameTaskBoard,
                toggleFlowDirection,
                moveTaskList,
                moveTask,
                addTaskList,
                renameTaskList,
                deleteTaskList,
                addTask,
                editTask,
                deleteTask,
                refreshBoard,
                refreshUser,
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
