import { TaskBoardModelSchema } from "@/_/common/schema/taskBoard";
import { TaskBoardRelationSchema } from "@/_/common/schema/taskBoard.relation";
import {
    TaskBoardUserModelSchema,
    TaskBoardUserUpdateSchema,
} from "@/_/common/schema/taskBoardUser";
import { UserModelSchema } from "@/_/common/schema/user";
import { UserRelationSchema } from "@/_/common/schema/user.relation";
import { z } from "zod";

export const TaskBoardUsersGetResponseManyWithTaskBoardsSchema = z.object({
    taskBoardUsers: TaskBoardUserModelSchema.and(
        z.object({
            taskBoard: TaskBoardModelSchema.omit({ thumbnailData: true }).and(
                TaskBoardRelationSchema.pick({ users: true })
            ),
        })
    ).array(),
});

export const TaskBoardUsersGetResponseSingleSchema = z.object({
    taskBoardUser: TaskBoardUserModelSchema.and(
        z.object({
            user: UserModelSchema.and(UserRelationSchema),
            taskBoard: TaskBoardModelSchema.omit({
                thumbnailData: true,
            }).and(TaskBoardRelationSchema.pick({ users: true })),
        })
    ).nullable(),
});

export const TaskBoardUserPatchBodySchema = TaskBoardUserUpdateSchema;

export const TaskBoardUserPatchResponseSchema = z.object({
    taskBoardUser: TaskBoardUserModelSchema.nullable(),
});

export const TaskBoardUserDeleteResponseSchema = z.object({
    taskBoardUser: TaskBoardUserModelSchema.nullable(),
});

export type TaskBoardUsersGetResponseManyWithTaskBoards = z.infer<
    typeof TaskBoardUsersGetResponseManyWithTaskBoardsSchema
>;

export type TaskBoardUsersGetResponseSingle = z.infer<
    typeof TaskBoardUsersGetResponseSingleSchema
>;

export type TaskBoardUserPatchBody = z.infer<
    typeof TaskBoardUserPatchBodySchema
>;

export type TaskBoardUserPatchResponse = z.infer<
    typeof TaskBoardUserPatchResponseSchema
>;

export type TaskBoardUserDeleteResponse = z.infer<
    typeof TaskBoardUserDeleteResponseSchema
>;
