import { z } from "zod";
import { TaskModelSchema } from "./task";

export const TaskListModelSchema = z.object({
    id: z.string(),
    taskBoardId: z.string(),
    order: z.number().int(),
    title: z.string(),
    createdAt: z.coerce.date(),
});

export const TaskListRelationSchema = z.object({
    tasks: TaskModelSchema.array(),
});

export const AggregatedTaskListModelSchema = TaskListModelSchema.extend({
    tasks: TaskModelSchema.array(),
});

export const TaskListCreateSchema = TaskListModelSchema.omit({
    order: true,
    createdAt: true,
});

export const TaskListUpdateSchema = TaskListCreateSchema.omit({
    id: true,
    taskBoardId: true,
});

export type TaskListModel = z.infer<typeof TaskListModelSchema>;
export type TaskListRelation = z.infer<typeof TaskListRelationSchema>;
export type AggregatedTaskListModel = z.infer<
    typeof AggregatedTaskListModelSchema
>;
export type TaskListCreate = z.infer<typeof TaskListCreateSchema>;
export type TaskListUpdate = z.infer<typeof TaskListUpdateSchema>;
