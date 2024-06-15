import { TaskCreate, TaskUpdate } from "@/schema/task";
import { AggregatedTaskBoardModel } from "@/schema/taskBoard";
import {
    AggregatedTaskListModel,
    TaskListCreate,
    TaskListUpdate,
} from "@/schema/taskList";
import {
    DefinedUseQueryResult,
    UseMutationResult,
} from "@tanstack/react-query";
import { Dispatch, PropsWithChildren, SetStateAction } from "react";

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
    | MoveTaskListOptions
    | MoveTaskOptions
    | RenameTaskListOptions
    | DeleteTaskListOptions
    | EditTaskOptions
    | DeleteTaskOptions;

type InsertOptions = AddTaskListOptions | AddTaskOptions;

interface TaskQueryContextValue {
    selectedTaskBoard: AggregatedTaskBoardModel;
    taskBoardQuery: DefinedUseQueryResult<AggregatedTaskBoardModel | null>;
    taskLists: AggregatedTaskListModel[];
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
    addTaskList: (options: Omit<AddTaskListOptions, "id">) => void;
    renameTaskList: (options: RenameTaskListOptions) => void;
    deleteTaskList: (options: DeleteTaskListOptions) => void;
    addTask: (options: Omit<AddTaskOptions, "id">) => void;
    editTask: (options: EditTaskOptions) => void;
    deleteTask: (options: DeleteTaskOptions) => void;
    refreshData: () => void;
    setSearchQuery: Dispatch<SetStateAction<string>>;
    searchQuery: string;
    isMutationOngoing: boolean;
    isChangesSaved: boolean;
}

interface TaskQueryProviderProps extends PropsWithChildren {
    selectedTaskBoard: AggregatedTaskBoardModel;
}
