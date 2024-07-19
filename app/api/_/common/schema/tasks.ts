import {
    TaskCreate,
    TaskModelSchema,
    TaskUpdate,
} from "@/_/common/schema/task";
import { z } from "zod";

export const TasksGetResponseSchema = z.object({
    tasks: TaskModelSchema.array(),
});
export const TasksPostResponseSchema = z.object({
    task: TaskModelSchema.nullable(),
});

export const TaskGetResponseSchema = z.object({
    task: TaskModelSchema.nullable(),
});
export const TaskPatchResponseSchema = TaskGetResponseSchema;
export const TaskDeleteResponseSchema = TaskGetResponseSchema;

export const TasksReorderPostBodySchema = z.object({
    boardId: z.string(),
    fromListIndex: z.number(),
    toListIndex: z.number(),
    fromIndex: z.number(),
    toIndex: z.number(),
});

export type TasksGetResponse = z.infer<typeof TasksGetResponseSchema>;
export type TasksPostBody = TaskCreate;
export type TasksPostResponse = z.infer<typeof TasksPostResponseSchema>;

export type TaskGetResponse = z.infer<typeof TaskGetResponseSchema>;
export type TaskPatchBody = TaskUpdate;
export type TaskPatchResponse = z.infer<typeof TaskPatchResponseSchema>;
export type TaskDeleteResponse = z.infer<typeof TaskDeleteResponseSchema>;

export type TasksReorderPostBody = z.infer<typeof TasksReorderPostBodySchema>;
