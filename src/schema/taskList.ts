import { z } from "zod";

export const TaskListModelSchema = z.object({
    id: z.string(),
    taskBoardId: z.string(),
    order: z.number().int(),
    title: z.string(),
    createdAt: z.date(),
});

export const TaskListCreateSchema = TaskListModelSchema.omit({
    id: true,
    order: true,
    createdAt: true,
});

export const TaskListUpdateSchema = TaskListCreateSchema.omit({
    taskBoardId: true,
});

export type TaskListModel = z.infer<typeof TaskListModelSchema>;
export type TaskListCreate = z.infer<typeof TaskListCreateSchema>;
export type TaskListUpdate = z.infer<typeof TaskListUpdateSchema>;
