import { z } from "zod";

export const TaskModelSchema = z.object({
    id: z.string(),
    taskListId: z.string(),
    order: z.number().int(),
    title: z.string(),
    details: z.string(),
    status: z.enum(["pending", "ongoing", "done"]),
    createdAt: z.date(),
    dueAt: z.date().nullable(),
});

export const TaskCreateSchema = TaskModelSchema.omit({
    order: true,
    status: true,
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
        ({ title, details, status, dueAt }) =>
            title !== undefined ||
            details !== undefined ||
            status !== undefined ||
            dueAt !== undefined
    );

export type TaskModel = z.infer<typeof TaskModelSchema>;
export type TaskCreate = z.infer<typeof TaskCreateSchema>;
export type TaskUpdate = z.infer<typeof TaskUpdateSchema>;
