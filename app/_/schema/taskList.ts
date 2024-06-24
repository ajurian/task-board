import { z } from "zod";
import {
    AggregatedTaskModelSchema,
    TaskModelSchema
} from "./task";

export const TaskListModelSchema = z.object({
    id: z.string(),
    taskBoardId: z.string(),
    order: z.number().int(),
    title: z.string(),
    createdAt: z.coerce.date(),
});

export const AggregatedTaskListModelSchema = TaskListModelSchema.extend({
    tasks: AggregatedTaskModelSchema.array(),
});

export const TaskListCreateSchema = TaskListModelSchema.omit({
    order: true,
    createdAt: true,
});

export const NestedTaskListCreateSchema = TaskListModelSchema.extend({
    tasks: TaskModelSchema.array(),
});

export const TaskListUpdateSchema = TaskListCreateSchema.omit({
    id: true,
    taskBoardId: true,
});

export type TaskListModel = z.infer<typeof TaskListModelSchema>;
export type AggregatedTaskListModel = z.infer<
    typeof AggregatedTaskListModelSchema
>;
export type TaskListCreate = z.infer<typeof TaskListCreateSchema>;
export type NestedTaskListCreate = z.infer<typeof NestedTaskListCreateSchema>;
export type TaskListUpdate = z.infer<typeof TaskListUpdateSchema>;
