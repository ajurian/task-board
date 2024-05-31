import { z } from "zod";

export const TaskBoardModelSchema = z.object({
    id: z.string(),
    ownerId: z.string(),
    uniqueName: z.string(),
    displayName: z.string(),
    createdAt: z.date(),
});

export const TaskBoardCreateSchema = TaskBoardModelSchema.omit({
    id: true,
    createdAt: true,
});

export const TaskBoardUpdateSchema = TaskBoardCreateSchema.omit({
    ownerId: true,
});

export type TaskBoardModel = z.infer<typeof TaskBoardModelSchema>;
export type TaskBoardCreate = z.infer<typeof TaskBoardCreateSchema>;
export type TaskBoardUpdate = z.infer<typeof TaskBoardUpdateSchema>;
