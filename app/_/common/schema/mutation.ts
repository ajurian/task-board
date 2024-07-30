import { z } from "zod";
import { TaskCreateSchema, TaskModelSchema, TaskUpdateSchema } from "./task";
import { TaskBoardModelSchema } from "./taskBoard";
import {
    TaskListCreateSchema,
    TaskListModelSchema,
    TaskListUpdateSchema,
} from "./taskList";

export const RenameTaskBoardOptionsSchema = TaskBoardModelSchema.pick({
    displayName: true,
});

export const UpdateFlowDirectionOptionsSchema = TaskBoardModelSchema.pick({
    flowDirection: true,
});

export const MoveTaskListOptionsSchema = z.object({
    fromIndex: z.number(),
    toIndex: z.number(),
});

export const MoveTaskOptionsSchema = z.object({
    fromListIndex: z.number(),
    toListIndex: z.number(),
    fromIndex: z.number(),
    toIndex: z.number(),
});

export const AddTaskListOptionsSchema = TaskListCreateSchema.omit({
    taskBoardId: true,
});

export const RenameTaskListOptionsSchema = TaskListUpdateSchema.and(
    TaskListModelSchema.pick({ id: true })
);

export const DeleteTaskListOptionsSchema = TaskListModelSchema.pick({
    id: true,
});

export const AddTaskOptionsSchema = TaskCreateSchema;

export const EditTaskOptionsSchema = TaskUpdateSchema.and(
    TaskModelSchema.pick({ id: true })
);

export const DeleteTaskOptionsSchema = TaskModelSchema.pick({ id: true });

export type RenameTaskBoardOptions = z.infer<
    typeof RenameTaskBoardOptionsSchema
>;
export type UpdateFlowDirectionOptions = z.infer<
    typeof UpdateFlowDirectionOptionsSchema
>;
export type MoveTaskListOptions = z.infer<typeof MoveTaskListOptionsSchema>;
export type MoveTaskOptions = z.infer<typeof MoveTaskOptionsSchema>;
export type AddTaskListOptions = z.infer<typeof AddTaskListOptionsSchema>;
export type RenameTaskListOptions = z.infer<typeof RenameTaskListOptionsSchema>;
export type DeleteTaskListOptions = z.infer<typeof DeleteTaskListOptionsSchema>;
export type AddTaskOptions = z.infer<typeof AddTaskOptionsSchema>;
export type EditTaskOptions = z.infer<typeof EditTaskOptionsSchema>;
export type DeleteTaskOptions = z.infer<typeof DeleteTaskOptionsSchema>;
