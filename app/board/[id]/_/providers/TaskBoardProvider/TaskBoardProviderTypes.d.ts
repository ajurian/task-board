import { TaskCreate, TaskUpdate } from "@/_/common/schema/task";
import { AggregatedTaskBoardModel } from "@/_/common/schema/taskBoard.aggregation";
import { TaskBoardUserModel } from "@/_/common/schema/taskBoardUser";
import {
    AggregatedTaskListModel,
    TaskListCreate,
    TaskListUpdate,
} from "@/_/common/schema/taskList";
import { FlowDirection } from "@prisma/client";
import {
    DefinedUseQueryResult,
    UseMutationResult,
} from "@tanstack/react-query";
import { Dispatch, PropsWithChildren, SetStateAction } from "react";

interface RenameTaskBoardOptions {
    displayName: string;
}

interface ToggleFlowDirectionOptions {}

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

type UpdateOptions =
    | RenameTaskBoardOptions
    | ToggleFlowDirectionOptions
    | MoveTaskListOptions
    | MoveTaskOptions
    | RenameTaskListOptions
    | DeleteTaskListOptions
    | EditTaskOptions
    | DeleteTaskOptions;

type InsertOptions = AddTaskListOptions | AddTaskOptions;

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
    isUserOwner: boolean;
    canUserChangeRole: boolean;
    canUserRenameTaskBoard: boolean;
    canUserToggleFlowDirection: boolean;
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
    toggleFlowDirectionMutation: UseMutationResult<
        void,
        Error,
        ToggleFlowDirectionOptions
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
    toggleFlowDirection: (options: ToggleFlowDirectionOptions) => void;
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
