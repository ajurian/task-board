import {
    AddTaskListOptions,
    AddTaskOptions,
    DeleteTaskListOptions,
    DeleteTaskOptions,
    EditTaskOptions,
    MoveTaskListOptions,
    MoveTaskOptions,
    RenameTaskBoardOptions,
    RenameTaskListOptions,
    UpdateFlowDirectionOptions,
    UserActiveOptions,
} from "@/_/common/schema/mutation";
import { AggregatedTaskBoardModel } from "@/_/common/schema/taskBoard.aggregation";
import { TaskBoardUserModel } from "@/_/common/schema/taskBoardUser";
import { AggregatedTaskListModel } from "@/_/common/schema/taskList";
import { FlowDirection } from "@prisma/client";
import {
    DefinedUseQueryResult,
    UseMutateAsyncFunction,
    UseMutationResult,
} from "@tanstack/react-query";
import { Dispatch, PropsWithChildren, SetStateAction } from "react";

type CreationType = "addTaskList" | "addTask";
type CreationOptions = {
    addTaskList: AddTaskListOptions;
    addTask: AddTaskOptions;
};
type CreationMutation<
    T extends CreationType = CreationType,
    O extends CreationOptions[T] = CreationOptions[T]
> = {
    type: T;
    options: O;
    onMutate: UseMutateAsyncFunction<void, Error, O>;
};

type NonCreationType =
    | "renameTaskBoard"
    | "updateFlowDirection"
    | "moveTaskList"
    | "moveTask"
    | "renameTaskList"
    | "deleteTaskList"
    | "editTask"
    | "deleteTask";
type NonCreationOptions = {
    renameTaskBoard: RenameTaskBoardOptions;
    updateFlowDirection: UpdateFlowDirectionOptions;
    moveTaskList: MoveTaskListOptions;
    moveTask: MoveTaskOptions;
    renameTaskList: RenameTaskListOptions;
    deleteTaskList: DeleteTaskListOptions;
    editTask: EditTaskOptions;
    deleteTask: DeleteTaskOptions;
};
type NonCreationMutation<
    T extends NonCreationType = NonCreationType,
    O extends NonCreationOptions[T] = NonCreationOptions[T]
> = {
    type: T;
    options: O;
    onMutate: UseMutateAsyncFunction<void, Error, O>;
};

type UpdateType = CreationType | NonCreationType;
type UpdateOptions<T extends UpdateType = UpdateType> = T extends CreationType
    ? CreationOptions[T]
    : T extends NonCreationType
    ? NonCreationOptions[T]
    : never;
type UpdateMutation<
    T extends UpdateType = UpdateType,
    O extends UpdateOptions<T> = UpdateOptions<T>
> = T extends CreationType
    ? CreationMutation<T, O>
    : T extends NonCreationType
    ? NonCreationMutation<T, O>
    : never;

interface TaskBoardContextValue {
    selectedTaskBoard: AggregatedTaskBoardModel;
    taskBoardQuery: DefinedUseQueryResult<AggregatedTaskBoardModel>;
    id: string;
    displayName: string;
    flowDirection: FlowDirection;
    defaultPermission: number;
    taskLists: AggregatedTaskListModel[];
    users: AggregatedTaskBoardModel["users"];
    taskBoardUser: TaskBoardUserModel;
    activeUsers: UserActiveOptions["user"][];
    isUserOwner: boolean;
    canUserChangeRole: boolean;
    canUserRenameTaskBoard: boolean;
    canUserUpdateFlowDirection: boolean;
    canUserUpdateDefaultPermission: boolean;
    canUserUpdateThumbnail: boolean;
    canUserCreateOrDeleteTaskList: boolean;
    canUserRenameTaskList: boolean;
    canUserReorderTaskList: boolean;
    canUserCreateOrDeleteTask: boolean;
    canUserUpdateTaskTitle: boolean;
    canUserUpdateTaskDetails: boolean;
    canUserCompleteTask: boolean;
    canUserScheduleTask: boolean;
    canUserReorderTask: boolean;
    isUserVisitor: boolean;
    renameTaskBoardMutation: UseMutationResult<
        void,
        Error,
        RenameTaskBoardOptions
    >;
    updateFlowDirectionMutation: UseMutationResult<
        void,
        Error,
        UpdateFlowDirectionOptions
    >;
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
    renameTaskBoard: (options: RenameTaskBoardOptions) => void;
    updateFlowDirection: (options: UpdateFlowDirectionOptions) => void;
    moveTaskList: (options: MoveTaskListOptions) => void;
    moveTask: (options: MoveTaskOptions) => void;
    addTaskList: (options: Omit<AddTaskListOptions, "id">) => void;
    renameTaskList: (options: RenameTaskListOptions) => void;
    deleteTaskList: (options: DeleteTaskListOptions) => void;
    addTask: (options: Omit<AddTaskOptions, "id">) => void;
    editTask: (options: EditTaskOptions) => void;
    deleteTask: (options: DeleteTaskOptions) => void;
    refreshBoard: () => void;
    refreshUser: () => void;
    setSearchQuery: Dispatch<SetStateAction<string>>;
    searchQuery: string;
    isMutationOngoing: boolean;
    isChangesSaved: boolean;
}

interface TaskBoardProviderProps extends PropsWithChildren {
    selectedTaskBoard: AggregatedTaskBoardModel;
    taskBoardUser: TaskBoardUserModel;
}
