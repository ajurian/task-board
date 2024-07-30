import { ObjectId } from "bson";
import { z } from "zod";
import {
    TASK_DETAILS_MAX_LEN,
    TASK_DETAILS_MIN_LEN,
    TASK_TITLE_MAX_LEN,
    TASK_TITLE_MIN_LEN,
} from "../constants/constraints";

export const TaskModelSchema = z.object({
    id: z.string().refine(ObjectId.isValid),
    taskListId: z.string().refine(ObjectId.isValid),
    order: z.number().int().min(0),
    title: z.string().min(TASK_TITLE_MIN_LEN).max(TASK_TITLE_MAX_LEN),
    details: z.string().min(TASK_DETAILS_MIN_LEN).max(TASK_DETAILS_MAX_LEN),
    isDone: z.boolean(),
    createdAt: z.coerce.date(),
    dueAt: z.coerce.date().nullable(),
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
export type TaskCreate = z.infer<typeof TaskCreateSchema>;
export type TaskUpdate = z.infer<typeof TaskUpdateSchema>;
