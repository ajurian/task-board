import {
    TaskListCreate,
    TaskListModelSchema,
    TaskListUpdate,
} from "@/_/schema/taskList";
import { z } from "zod";

export const TaskListsGetResponseSchema = z.object({
    taskLists: TaskListModelSchema.array(),
});
export const TaskListsPostResponseSchema = z.object({
    taskList: TaskListModelSchema.nullable(),
});

export const TaskListGetResponseSchema = z.object({
    taskList: TaskListModelSchema.nullable(),
});
export const TaskListPatchResponseSchema = TaskListGetResponseSchema;
export const TaskListDeleteResponseSchema = TaskListGetResponseSchema;

export const TaskListsReorderPostBodySchema = z.object({
    boardId: z.string(),
    fromIndex: z.number(),
    toIndex: z.number(),
});

export type TaskListsGetResponse = z.infer<typeof TaskListsGetResponseSchema>;
export type TaskListsPostBody = TaskListCreate;
export type TaskListsPostResponse = z.infer<typeof TaskListsPostResponseSchema>;

export type TaskListGetResponse = z.infer<typeof TaskListGetResponseSchema>;
export type TaskListPatchBody = TaskListUpdate;
export type TaskListPatchResponse = z.infer<typeof TaskListPatchResponseSchema>;
export type TaskListDeleteResponse = z.infer<
    typeof TaskListDeleteResponseSchema
>;

export type TaskListsReorderPostBody = z.infer<
    typeof TaskListsReorderPostBodySchema
>;
