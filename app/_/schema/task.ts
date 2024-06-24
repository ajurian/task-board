import { z } from "zod";

export const TaskModelSchema = z.object({
    id: z.string(),
    taskListId: z.string(),
    order: z.number().int(),
    title: z.string(),
    details: z.string(),
    isDone: z.boolean(),
    createdAt: z.coerce.date(),
    dueAt: z.coerce.date().nullable(),
});

export const AggregatedTaskModelSchema = TaskModelSchema.extend({
    highlights: z
        .object({
            score: z.number(),
            path: z.enum(["title", "details"]),
            texts: z
                .object({ value: z.string(), type: z.enum(["text", "hit"]) })
                .array(),
        })
        .array(),
});

export const TaskCreateSchema = TaskModelSchema.omit({
    order: true,
    isDone: true,
    createdAt: true,
});

export const TaskUpdateSchema = TaskModelSchema.omit({
    id: true,
    order: true,
    taskListId: true,
    createdAt: true,
})
    .partial()
    .refine(
        ({ title, details, isDone, dueAt }) =>
            title !== undefined ||
            details !== undefined ||
            isDone !== undefined ||
            dueAt !== undefined
    );

export type TaskModel = z.infer<typeof TaskModelSchema>;
export type AggregatedTaskModel = z.infer<typeof AggregatedTaskModelSchema>;
export type TaskCreate = z.infer<typeof TaskCreateSchema>;
export type TaskUpdate = z.infer<typeof TaskUpdateSchema>;
