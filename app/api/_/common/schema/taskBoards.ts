import { PermissionRoleSchema } from "@/_/common/constants/permissions";
import {
    TaskBoardCreate,
    TaskBoardModelSchema,
    TaskBoardUpdateInput,
} from "@/_/common/schema/taskBoard";
import { AggregatedTaskBoardModelSchema } from "@/_/common/schema/taskBoard.aggregation";
import { z } from "zod";

export const TaskBoardsGetResponseSchema = z.object({
    taskBoards: TaskBoardModelSchema.omit({ thumbnailData: true }).array(),
});

export const TaskBoardsPostResponseSchema = z.object({
    taskBoard: TaskBoardModelSchema.omit({ thumbnailData: true }).nullable(),
});

export const TaskBoardGetResponseSchema = z.object({
    taskBoard: AggregatedTaskBoardModelSchema.omit({
        thumbnailData: true,
    }).nullable(),
});
export const TaskBoardPatchResponseSchema = z.object({
    taskBoard: TaskBoardModelSchema.omit({ thumbnailData: true }).nullable(),
});
export const TaskBoardDeleteResponseSchema = TaskBoardPatchResponseSchema;

export const TaskBoardRequestAccessBodySchema = z.object({
    message: z.string().optional(),
});
export const TaskBoardRequestAccessResponseSchema = z.object({});

export const TaskBoardShareAccessBodySchema = z.object({
    userEmails: z.string().array(),
    role: PermissionRoleSchema,
});
export const TaskBoardShareAccessResponseSchema = z.object({});

export const TaskBoardRequestShareAccessBodySchema = z.object({
    userEmails: z.string().array(),
});
export const TaskBoardRequestShareAccessResponseSchema = z.object({});

export const TaskBoardChangeAccessBodySchema = z
    .object({
        editorEmails: z.string().array(),
        workerEmails: z.string().array(),
        viewerEmails: z.string().array(),
    })
    .partial()
    .refine(
        ({ editorEmails, workerEmails, viewerEmails }) =>
            editorEmails !== undefined ||
            workerEmails !== undefined ||
            viewerEmails !== undefined
    );
export const TaskBoardChangeAccessResponseSchema = z.object({});

export type TaskBoardsGetResponse = z.infer<typeof TaskBoardsGetResponseSchema>;
export type TaskBoardsPostBody = TaskBoardCreate;
export type TaskBoardsPostResponse = z.infer<
    typeof TaskBoardsPostResponseSchema
>;

export type TaskBoardGetResponse = z.infer<typeof TaskBoardGetResponseSchema>;
export type TaskBoardPatchBody = TaskBoardUpdateInput;
export type TaskBoardPatchResponse = z.infer<
    typeof TaskBoardPatchResponseSchema
>;
export type TaskBoardDeleteResponse = z.infer<
    typeof TaskBoardDeleteResponseSchema
>;

export type TaskBoardRequestAccessBody = z.infer<
    typeof TaskBoardRequestAccessBodySchema
>;
export type TaskBoardRequestAccessResponse = z.infer<
    typeof TaskBoardRequestAccessResponseSchema
>;

export type TaskBoardShareAccessBody = z.infer<
    typeof TaskBoardShareAccessBodySchema
>;
export type TaskBoardShareAccessResponse = z.infer<
    typeof TaskBoardShareAccessResponseSchema
>;

export type TaskBoardRequestShareAccessBody = z.infer<
    typeof TaskBoardRequestShareAccessBodySchema
>;
export type TaskBoardRequestShareAccessResponse = z.infer<
    typeof TaskBoardRequestShareAccessResponseSchema
>;

export type TaskBoardChangeAccessBody = z.infer<
    typeof TaskBoardChangeAccessBodySchema
>;
export type TaskBoardChangeAccessResponse = z.infer<
    typeof TaskBoardChangeAccessResponseSchema
>;
