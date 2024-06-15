import { z } from "zod";
import { AggregatedTaskListModelSchema } from "./taskList";

export const TaskBoardModelSchema = z.object({
    id: z.string(),
    ownerId: z.string(),
    uniqueName: z.string(),
    displayName: z.string(),
    createdAt: z.coerce.date(),
});

export const AggregatedTaskBoardModelSchema = TaskBoardModelSchema.extend({
    taskLists: z.array(AggregatedTaskListModelSchema),
});

export const TaskBoardCreateSchema = TaskBoardModelSchema.omit({
    id: true,
    createdAt: true,
});

export const TaskBoardUpdateSchema = TaskBoardCreateSchema.omit({
    ownerId: true,
});

export type TaskBoardModel = z.infer<typeof TaskBoardModelSchema>;
export type AggregatedTaskBoardModel = z.infer<
    typeof AggregatedTaskBoardModelSchema
>;
export type TaskBoardCreate = z.infer<typeof TaskBoardCreateSchema>;
export type TaskBoardUpdate = z.infer<typeof TaskBoardUpdateSchema>;
