import { z } from "zod";
import {
    AggregatedTaskListModelSchema,
    NestedTaskListCreateSchema,
} from "./taskList";

export const TaskBoardModelSchema = z.object({
    id: z.string(),
    ownerId: z.string(),
    uniqueName: z.string(),
    displayName: z.string(),
    createdAt: z.coerce.date(),
});

export const AggregatedTaskBoardModelSchema = TaskBoardModelSchema.extend({
    taskLists: AggregatedTaskListModelSchema.array(),
});

export const TaskBoardCreateSchema = TaskBoardModelSchema.omit({
    id: true,
    ownerId: true,
    createdAt: true,
});

export const NestedTaskBoardCreateSchema = TaskBoardModelSchema.extend({
    taskLists: NestedTaskListCreateSchema.array(),
});

export const TaskBoardUpdateSchema = TaskBoardCreateSchema.partial().refine(
    ({ uniqueName, displayName }) =>
        uniqueName !== undefined || displayName !== undefined
);

export type TaskBoardModel = z.infer<typeof TaskBoardModelSchema>;
export type AggregatedTaskBoardModel = z.infer<
    typeof AggregatedTaskBoardModelSchema
>;
export type TaskBoardCreate = z.infer<typeof TaskBoardCreateSchema>;
export type NestedTaskBoardCreate = z.infer<typeof NestedTaskBoardCreateSchema>;
export type TaskBoardUpdate = z.infer<typeof TaskBoardUpdateSchema>;
