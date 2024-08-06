import { ObjectId } from "bson";
import { z } from "zod";
import { TaskModelSchema } from "./task";
import {
    TASK_LIST_TITLE_MAX_LEN,
    TASK_LIST_TITLE_MIN_LEN,
} from "../constants/constraints";

export const TaskListModelSchema = z.object({
    id: z.string().refine(ObjectId.isValid),
    taskBoardId: z.string().refine(ObjectId.isValid),
    order: z.number().int().min(0),
    title: z.string().min(TASK_LIST_TITLE_MIN_LEN).max(TASK_LIST_TITLE_MAX_LEN),
    sortBy: z.enum(["order", "dueAt"]),
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
    sortBy: true,
    createdAt: true,
});

export const TaskListUpdateSchema = TaskListModelSchema.pick({
    title: true,
    sortBy: true,
})
    .partial()
    .refine(({ title, sortBy }) => title !== undefined || sortBy !== undefined);

export type TaskListModel = z.infer<typeof TaskListModelSchema>;
export type TaskListRelation = z.infer<typeof TaskListRelationSchema>;
export type AggregatedTaskListModel = z.infer<
    typeof AggregatedTaskListModelSchema
>;
export type TaskListCreate = z.infer<typeof TaskListCreateSchema>;
export type TaskListUpdate = z.infer<typeof TaskListUpdateSchema>;
