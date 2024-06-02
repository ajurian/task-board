import { TaskCreate, TaskUpdate } from "@/schema/task";
import { TaskListCreate, TaskListUpdate } from "@/schema/taskList";
import { UseMutationResult, UseQueryResult } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { TaskListProps } from "../../components/TaskBoard/TaskList";
import { TaskItemProps } from "../../components/TaskBoard/TaskList/TaskItem";

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

interface TaskListsQueryData extends TaskListProps {
    tasks: TaskItemProps[];
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
    addTaskList: (options: Omit<AddTaskListOptions, "id">) => void;
    renameTaskList: (options: RenameTaskListOptions) => void;
    deleteTaskList: (options: DeleteTaskListOptions) => void;
    addTask: (options: Omit<AddTaskOptions, "id">) => void;
    editTask: (options: EditTaskOptions) => void;
    deleteTask: (options: DeleteTaskOptions) => void;
    isMutationPending: boolean;
}

interface TaskQueryProviderProps extends PropsWithChildren {
    boardId: string;
}
