"use client";

import {
    PERMISSION_ROLE_OWNER,
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
import pusherClient from "@/_/common/lib/pusherClient";
import {
    AddTaskListOptions,
    AddTaskListOptionsSchema,
    AddTaskOptions,
    AddTaskOptionsSchema,
    DeleteTaskListOptions,
    DeleteTaskOptions,
    EditTaskOptions,
    EditTaskOptionsSchema,
    MoveTaskListOptions,
    MoveTaskOptions,
    RenameTaskBoardOptions,
    RenameTaskBoardOptionsSchema,
    RenameTaskListOptions,
    RenameTaskListOptionsSchema,
    UpdateFlowDirectionOptions,
    UpdateFlowDirectionOptionsSchema,
} from "@/_/common/schema/mutation";
import { AggregatedTaskListModel } from "@/_/common/schema/taskList";
import { useUserInfo } from "@/_/providers/UserInfoProvider";
import ClientTaskAPI from "@/api/_/common/layers/client/TaskAPI";
import ClientTaskBoardAPI from "@/api/_/common/layers/client/TaskBoardAPI";
import ClientTaskBoardUserAPI from "@/api/_/common/layers/client/TaskBoardUserAPI";
import ClientTaskListAPI from "@/api/_/common/layers/client/TaskListAPI";
import { usePrevious } from "@mantine/hooks";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import html2canvas from "html2canvas";
import _ from "lodash";
import { PresenceChannel } from "pusher-js";
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
import useCreationUpdate from "./hooks/useCreationUpdate";
import useNonCreationUpdate from "./hooks/useNonCreationUpdate";
import useOptimisticUpdate from "./hooks/useOptimisticUpdate";
import {
    TaskBoardContextValue,
    TaskBoardProviderProps,
    UpdateMutation,
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
    const userInfo = useUserInfo<false>();
    const queryClient = useQueryClient();

    const [channel, setChannel] = useState<PresenceChannel | null>(null);

    const [mutationQueue, setMutationQueue] = useState<UpdateMutation[]>([]);
    const [asyncMutation, setAsyncMutation] = useState<UpdateMutation[]>([]);
    const previousMutationQueueSize = usePrevious(mutationQueue.length);
    const previousAsyncMutationSize = usePrevious(asyncMutation.length);

    const [searchQuery, setSearchQuery] = useState("");

    const isChangesSaved = useMemo(
        () => mutationQueue.length === 0 && asyncMutation.length === 0,
        [mutationQueue.length, asyncMutation.length]
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
        refetchInterval: false,
        refetchIntervalInBackground: false,
        refetchOnWindowFocus: false,
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

    const [activeUsers, setActiveUsers] = useState<
        {
            googleId: string;
            email: string;
            displayName: string;
            photoURL: string;
        }[]
    >([]);

    const isUserOwner = taskBoardUser.permission === PERMISSION_ROLE_OWNER;

    const canUserChangeRole =
        (taskBoardUser.permission &
            PERMISSION_TASK_BOARD_USER_UPDATE_PERMISSION) !==
        0;

    const canUserRenameTaskBoard =
        (taskBoardUser.permission &
            PERMISSION_TASK_BOARD_UPDATE_DISPLAY_NAME) !==
        0;
    const canUserUpdateFlowDirection =
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

    const dequeueMutation = useCallback(
        () => setMutationQueue((mutationQueue) => mutationQueue.slice(1)),
        []
    );

    const clearAsyncMutation = useCallback(
        () =>
            setAsyncMutation((previousAsyncMutation) =>
                previousAsyncMutation.filter((mutation) => {
                    const unsyncedMutation = asyncMutation.find(
                        (unsyncedMutation) =>
                            unsyncedMutation.type === mutation.type
                    )!;

                    return !_.isEqual(
                        mutation.options,
                        unsyncedMutation.options
                    );
                })
            ),
        [asyncMutation]
    );

    const dispatchMutationQueue = useCallback(() => {
        if (mutationQueue.length === 0) {
            return;
        }

        const { options, onMutate } = mutationQueue[0];
        onMutate(options).then(dequeueMutation).catch(dequeueMutation);
    }, [mutationQueue, dequeueMutation]);

    const dispatchAsyncMutation = useCallback(() => {
        if (asyncMutation.length === 0) {
            return;
        }

        Promise.allSettled(
            asyncMutation.map(({ options, onMutate }) => onMutate(options))
        )
            .then(clearAsyncMutation)
            .catch(clearAsyncMutation);
    }, [asyncMutation, clearAsyncMutation]);

    const listenAndDispatch = useCallback(
        (
            previousSize: number | undefined,
            currentSize: number,
            dispatch: () => void
        ) => {
            if (previousSize === undefined || currentSize === 0) {
                return;
            }

            if (previousSize === 0) {
                dispatch();
                return;
            }

            if (currentSize >= previousSize) {
                return;
            }

            dispatch();
        },
        []
    );

    const enqueueMutation = useCallback(
        ({ type, options, onMutate }: UpdateMutation) =>
            setMutationQueue((mutationQueue) => {
                for (let i = mutationQueue.length - 1; i >= 0; i--) {
                    const mutation = mutationQueue[i];

                    if (
                        (mutation.type === "addTaskList" &&
                            type === "deleteTaskList") ||
                        (mutation.type === "addTask" && type === "deleteTask")
                    ) {
                        return mutationQueue.toSpliced(i, 1);
                    }
                }

                return [...mutationQueue, { type, options, onMutate }];
            }),
        []
    );

    const pushAsyncMutation = useCallback(
        ({ type, options, onMutate }: UpdateMutation) =>
            setAsyncMutation((asyncMutation) => {
                const newAsyncMutation = _.cloneDeep(asyncMutation);

                for (let i = newAsyncMutation.length - 1; i >= 0; i--) {
                    const mutation = newAsyncMutation[i];

                    if (mutation.type === type) {
                        mutation.options = {
                            ...mutation.options,
                            ...options,
                        };

                        return newAsyncMutation;
                    }
                }

                newAsyncMutation.push({ type, options, onMutate });

                return newAsyncMutation;
            }),
        []
    );

    const renameTaskBoardMutation: TaskBoardContextValue["renameTaskBoardMutation"] =
        useMutation({
            mutationKey: ["renameTaskBoard", selectedTaskBoard.id],
            mutationFn: async (options) => {
                const {
                    data: { taskBoard },
                } = await ClientTaskBoardAPI.patch(
                    selectedTaskBoard.id,
                    options
                );

                const dataNotification =
                    RenameTaskBoardOptionsSchema.parse(taskBoard);
                channel!.trigger("client-rename-task-board", dataNotification);
            },
            onSuccess: () => renameTaskBoardMutation.reset(),
        });

    const updateFlowDirectionMutation: TaskBoardContextValue["updateFlowDirectionMutation"] =
        useMutation({
            mutationKey: ["updateFlowDirection", selectedTaskBoard.id],
            mutationFn: async ({ flowDirection }) => {
                const {
                    data: { taskBoard },
                } = await ClientTaskBoardAPI.patch(selectedTaskBoard.id, {
                    flowDirection,
                });

                const dataNotification =
                    UpdateFlowDirectionOptionsSchema.parse(taskBoard);
                channel!.trigger(
                    "client-update-flow-direction",
                    dataNotification
                );
            },
            onSuccess: () => updateFlowDirectionMutation.reset(),
        });

    const moveTaskListMutation: TaskBoardContextValue["moveTaskListMutation"] =
        useMutation({
            mutationKey: ["moveTaskList", selectedTaskBoard.id],
            mutationFn: async (options) => {
                await ClientTaskListAPI.reorder({
                    ...options,
                    boardId: selectedTaskBoard.id,
                });

                channel!.trigger("client-move-task-list", options);
            },
            onSuccess: () => moveTaskListMutation.reset(),
        });

    const moveTaskMutation: TaskBoardContextValue["moveTaskMutation"] =
        useMutation({
            mutationKey: ["moveTask", selectedTaskBoard.id],
            mutationFn: async (options) => {
                await ClientTaskAPI.reorder({
                    ...options,
                    boardId: selectedTaskBoard.id,
                });

                channel!.trigger("client-move-task", options);
            },
            onSuccess: () => moveTaskMutation.reset(),
        });

    const addTaskListMutation: TaskBoardContextValue["addTaskListMutation"] =
        useMutation({
            mutationKey: ["addTaskList", selectedTaskBoard.id],
            mutationFn: async (options) => {
                const {
                    data: { taskList },
                } = await ClientTaskListAPI.post({
                    ...options,
                    taskBoardId: selectedTaskBoard.id,
                });

                const dataNotifications =
                    AddTaskListOptionsSchema.parse(taskList);
                channel!.trigger("client-add-task-list", dataNotifications);
            },
            onSuccess: () => addTaskListMutation.reset(),
        });

    const renameTaskListMutation: TaskBoardContextValue["renameTaskListMutation"] =
        useMutation({
            mutationKey: ["renameTaskList"],
            mutationFn: async ({ id, title }) => {
                const {
                    data: { taskList },
                } = await ClientTaskListAPI.patch(id, { title });

                const dataNotification =
                    RenameTaskListOptionsSchema.parse(taskList);
                channel!.trigger("client-rename-task-list", dataNotification);
            },
            onSuccess: () => renameTaskListMutation.reset(),
        });

    const deleteTaskListMutation: TaskBoardContextValue["deleteTaskListMutation"] =
        useMutation({
            mutationKey: ["deleteTaskList"],
            mutationFn: async ({ id }) => {
                await ClientTaskListAPI.delete(id);
                channel!.trigger("client-delete-task-list", { id });
            },
            onSuccess: () => deleteTaskListMutation.reset(),
        });

    const addTaskMutation: TaskBoardContextValue["addTaskMutation"] =
        useMutation({
            mutationKey: ["addTask"],
            mutationFn: async (options) => {
                const {
                    data: { task },
                } = await ClientTaskAPI.post(options);

                const dataNotification = AddTaskOptionsSchema.parse(task);
                channel!.trigger("client-add-task", dataNotification);
            },
            onSuccess: () => addTaskMutation.reset(),
        });

    const editTaskMutation: TaskBoardContextValue["editTaskMutation"] =
        useMutation({
            mutationKey: ["editTask"],
            mutationFn: async ({ id, ...options }) => {
                const {
                    data: { task },
                } = await ClientTaskAPI.patch(id, options);

                const dataNotification = EditTaskOptionsSchema.parse(task);
                channel!.trigger("client-edit-task", dataNotification);
            },
            onSuccess: () => editTaskMutation.reset(),
        });

    const deleteTaskMutation: TaskBoardContextValue["deleteTaskMutation"] =
        useMutation({
            mutationKey: ["deleteTask"],
            mutationFn: async ({ id }) => {
                await ClientTaskAPI.delete(id);
                channel!.trigger("client-delete-task", { id });
            },
            onSuccess: () => deleteTaskMutation.reset(),
        });

    const renameTaskBoardOptimistic = useCallback(
        ({ displayName }: RenameTaskBoardOptions) =>
            setDisplayName(displayName),
        []
    );

    const updateFlowDirectionOptimistic = useCallback(
        ({ flowDirection }: UpdateFlowDirectionOptions) =>
            setFlowDirection(flowDirection),
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

    const deleteTaskOptimistic = useOptimisticUpdate<DeleteTaskOptions>({
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

    const renameTaskBoard = useNonCreationUpdate({
        type: "renameTaskBoard",
        onMutate: renameTaskBoardMutation.mutateAsync,
        onOptimisticUpdate: renameTaskBoardOptimistic,
        /* @ts-expect-error */
        onMutationStateChange: pushAsyncMutation,
    });

    const updateFlowDirection = useNonCreationUpdate({
        type: "updateFlowDirection",
        onMutate: updateFlowDirectionMutation.mutateAsync,
        onOptimisticUpdate: updateFlowDirectionOptimistic,
        /* @ts-expect-error */
        onMutationStateChange: pushAsyncMutation,
    });

    const moveTaskList = useNonCreationUpdate({
        type: "moveTaskList",
        onMutate: moveTaskListMutation.mutateAsync,
        onOptimisticUpdate: moveTaskListOptimistic,
        /* @ts-expect-error */
        onMutationStateChange: enqueueMutation,
    });

    const moveTask = useNonCreationUpdate({
        type: "moveTask",
        onMutate: moveTaskMutation.mutateAsync,
        onOptimisticUpdate: moveTaskOptimistic,
        /* @ts-expect-error */
        onMutationStateChange: enqueueMutation,
    });

    const addTaskList = useCreationUpdate({
        type: "addTaskList",
        onMutate: addTaskListMutation.mutateAsync,
        onOptimisticUpdate: addTaskListOptimistic,
        /* @ts-expect-error */
        onMutationStateChange: enqueueMutation,
    });

    const renameTaskList = useNonCreationUpdate({
        type: "renameTaskList",
        onMutate: renameTaskListMutation.mutateAsync,
        onOptimisticUpdate: renameTaskListOptimistic,
        /* @ts-expect-error */
        onMutationStateChange: pushAsyncMutation,
    });

    const deleteTaskList = useNonCreationUpdate({
        type: "deleteTaskList",
        onMutate: deleteTaskListMutation.mutateAsync,
        onOptimisticUpdate: deleteTaskListOptimistic,
        /* @ts-expect-error */
        onMutationStateChange: enqueueMutation,
    });

    const addTask = useCreationUpdate({
        type: "addTask",
        onMutate: addTaskMutation.mutateAsync,
        onOptimisticUpdate: addTaskOptimistic,
        /* @ts-expect-error */
        onMutationStateChange: enqueueMutation,
    });

    const editTask = useNonCreationUpdate({
        type: "editTask",
        onMutate: editTaskMutation.mutateAsync,
        onOptimisticUpdate: editTaskOptimistic,
        /* @ts-expect-error */
        onMutationStateChange: pushAsyncMutation,
    });

    const deleteTask = useNonCreationUpdate({
        type: "deleteTaskList",
        onMutate: deleteTaskMutation.mutateAsync,
        onOptimisticUpdate: deleteTaskOptimistic,
        /* @ts-expect-error */
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
        if (!canUserUpdateThumbnail) {
            return;
        }

        const snapshotNode =
            document.querySelector("main")?.cloneNode(true) ?? null;
        snapshotNodeRef.current = snapshotNode as HTMLElement;
    }, [canUserUpdateThumbnail]);

    const saveSnapshot = useCallback(async () => {
        if (!canUserUpdateThumbnail) {
            return;
        }

        const snapshotNode = snapshotNodeRef.current;

        if (snapshotNode === null) {
            return;
        }

        document.body.appendChild(snapshotNode);

        snapshotNode.style.width = "512px";
        snapshotNode.style.height = "512px";

        const canvasPromise = html2canvas(snapshotNode, {
            logging: false,
            windowWidth: 512,
            windowHeight: 512,
            width: 512,
            height: 512,
            scrollX: 0,
            scrollY: 0,
            onclone: (document) =>
                window.scrollTo({ top: document.body.scrollTop }),
        });

        document.body.removeChild(snapshotNode);

        const canvas = await canvasPromise;
        await ClientTaskBoardAPI.patch(selectedTaskBoard.id, {
            thumbnailData: canvas.toDataURL("image/jpeg").split(";base64,")[1],
        });
    }, [selectedTaskBoard.id, canUserUpdateThumbnail]);

    useLayoutEffect(() => {
        if (taskBoardQuery.isRefetching) {
            return;
        }

        setDisplayName(taskBoardQuery.data.displayName);
        setFlowDirection(taskBoardQuery.data.flowDirection);
        setTaskLists(taskBoardQuery.data.taskLists);
    }, [
        taskBoardQuery.isRefetching,
        taskBoardQuery.data.displayName,
        taskBoardQuery.data.flowDirection,
        taskBoardQuery.data.taskLists,
    ]);

    useEffect(() => {
        const channel = pusherClient.subscribe(
            `presence-${id}`
        ) as PresenceChannel;

        const handleSubscriptionSucceeded = () => {
            const members: (typeof activeUsers)[number][] = Object.values(
                channel.members.members
            );

            setActiveUsers(
                members.filter((member) => member.googleId !== userInfo.sub)
            );
        };

        const handleMemberAdded = ({
            info,
        }: {
            id: string;
            info: (typeof activeUsers)[number];
        }) =>
            setActiveUsers((activeUsers) => {
                const newActiveUsers = _.cloneDeep(activeUsers);
                newActiveUsers.push(info);
                return newActiveUsers;
            });

        const handleMemberRemoved = ({
            id,
        }: {
            id: string;
            info: (typeof activeUsers)[number];
        }) =>
            setActiveUsers((activeUsers) => {
                const newActiveUsers = _.cloneDeep(activeUsers);
                const index = newActiveUsers.findIndex(
                    (activeUser) => activeUser.googleId === id
                );

                if (index > -1) {
                    newActiveUsers.splice(index, 1);
                }

                return newActiveUsers;
            });

        channel.bind(
            "pusher:subscription_succeeded",
            handleSubscriptionSucceeded
        );
        channel.bind("pusher:member_added", handleMemberAdded);
        channel.bind("pusher:member_removed", handleMemberRemoved);

        setChannel(channel);

        return () => {
            pusherClient.unsubscribe(`presence-${id}`);
            channel.unbind(
                "pusher:subscription_succeeded",
                handleSubscriptionSucceeded
            );
            channel.unbind("pusher:member_added", handleMemberAdded);
            channel.unbind("pusher:member_removed", handleMemberRemoved);

            setChannel(null);
        };
    }, [id, userInfo]);

    useEffect(() => {
        if (channel === null) {
            return;
        }

        channel.bind("client-rename-task-board", renameTaskBoardOptimistic);
        channel.bind(
            "client-update-flow-direction",
            updateFlowDirectionOptimistic
        );
        channel.bind("client-move-task-list", moveTaskListOptimistic);
        channel.bind("client-move-task", moveTaskOptimistic);
        channel.bind("client-add-task-list", addTaskListOptimistic);
        channel.bind("client-rename-task-list", renameTaskListOptimistic);
        channel.bind("client-delete-task-list", deleteTaskListOptimistic);
        channel.bind("client-add-task", addTaskOptimistic);
        channel.bind("client-edit-task", editTaskOptimistic);
        channel.bind("client-delete-task", deleteTaskOptimistic);

        return () => {
            channel.unbind(
                "client-rename-task-board",
                renameTaskBoardOptimistic
            );
            channel.unbind(
                "client-update-flow-direction",
                updateFlowDirectionOptimistic
            );
            channel.unbind("client-move-task-list", moveTaskListOptimistic);
            channel.unbind("client-move-task", moveTaskOptimistic);
            channel.unbind("client-add-task-list", addTaskListOptimistic);
            channel.unbind("client-rename-task-list", renameTaskListOptimistic);
            channel.unbind("client-delete-task-list", deleteTaskListOptimistic);
            channel.unbind("client-add-task", addTaskOptimistic);
            channel.unbind("client-edit-task", editTaskOptimistic);
            channel.unbind("client-delete-task", deleteTaskOptimistic);
        };
    }, [
        channel,
        id,
        renameTaskBoardOptimistic,
        updateFlowDirectionOptimistic,
        moveTaskListOptimistic,
        moveTaskOptimistic,
        addTaskListOptimistic,
        renameTaskListOptimistic,
        deleteTaskListOptimistic,
        addTaskOptimistic,
        editTaskOptimistic,
        deleteTaskOptimistic,
    ]);

    useEffect(() => {
        listenAndDispatch(
            previousMutationQueueSize,
            mutationQueue.length,
            dispatchMutationQueue
        );
    }, [
        mutationQueue.length,
        previousMutationQueueSize,
        dispatchMutationQueue,
        listenAndDispatch,
    ]);

    useEffect(() => {
        listenAndDispatch(
            previousAsyncMutationSize,
            asyncMutation.length,
            dispatchAsyncMutation
        );
    }, [
        asyncMutation.length,
        previousAsyncMutationSize,
        dispatchAsyncMutation,
        listenAndDispatch,
    ]);

    useEffect(() => {
        if (!isChangesSaved) {
            return;
        }

        document.title = `${displayName} - TaskBoard`;
    }, [isChangesSaved, displayName]);

    useEffect(() => {
        takeSnapshot();
        saveSnapshot().catch(() => {});
    }, [takeSnapshot, saveSnapshot]);

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
                activeUsers,
                isUserOwner,
                canUserChangeRole,
                canUserRenameTaskBoard,
                canUserUpdateFlowDirection,
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
                updateFlowDirectionMutation,
                moveTaskListMutation,
                moveTaskMutation,
                addTaskListMutation,
                renameTaskListMutation,
                deleteTaskListMutation,
                addTaskMutation,
                editTaskMutation,
                deleteTaskMutation,
                renameTaskBoard,
                updateFlowDirection,
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
                isChangesSaved,
            }}
        >
            {children}
        </TaskBoardContext.Provider>
    );
}
