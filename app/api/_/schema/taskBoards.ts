import {
    AggregatedTaskBoardModelSchema,
    TaskBoardCreate,
    TaskBoardModelSchema,
    TaskBoardUpdate,
} from "@/_/schema/taskBoard";
import { z } from "zod";

export const TaskBoardsGetResponseSchema = z.object({
    taskBoards: TaskBoardModelSchema.array(),
});

export const TaskBoardsPostResponseSchema = z.object({
    taskBoard: TaskBoardModelSchema.nullable(),
});

export const TaskBoardGetResponseSchema = z.object({
    taskBoard: AggregatedTaskBoardModelSchema.nullable(),
});
export const TaskBoardPatchResponseSchema = z.object({
    taskBoard: TaskBoardModelSchema.nullable(),
});
export const TaskBoardDeleteResponseSchema = TaskBoardPatchResponseSchema;

export type TaskBoardsGetResponse = z.infer<typeof TaskBoardsGetResponseSchema>;
export type TaskBoardsPostBody = TaskBoardCreate;
export type TaskBoardsPostResponse = z.infer<
    typeof TaskBoardsPostResponseSchema
>;

export type TaskBoardGetResponse = z.infer<typeof TaskBoardGetResponseSchema>;
export type TaskBoardPatchBody = TaskBoardUpdate;
export type TaskBoardPatchResponse = z.infer<
    typeof TaskBoardPatchResponseSchema
>;
export type TaskBoardDeleteResponse = z.infer<
    typeof TaskBoardDeleteResponseSchema
>;
