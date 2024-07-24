import { TaskBoardModelSchema } from "@/_/common/schema/taskBoard";
import { TaskBoardRelationSchema } from "@/_/common/schema/taskBoard.relation";
import {
    TaskBoardUserModelSchema,
    TaskBoardUserRelationSchema,
    TaskBoardUserUpdateSchema,
} from "@/_/common/schema/taskBoardUser";
import { UserModelSchema } from "@/_/common/schema/user";
import { UserRelationSchema } from "@/_/common/schema/user.relation";
import { z } from "zod";

export const TaskBoardUsersGetResponseManyWithTaskBoardsSchema = z.object({
    taskBoardUsers: TaskBoardUserModelSchema.and(
        z.object({
            taskBoard: TaskBoardModelSchema.and(
                TaskBoardRelationSchema.pick({ users: true })
            ),
        })
    ).array(),
});

export const TaskBoardUsersGetResponseSingleSchema = z.object({
    taskBoardUser: TaskBoardUserModelSchema.and(
        TaskBoardUserRelationSchema.and(
            z.object({
                user: UserModelSchema.and(UserRelationSchema),
                taskBoard: TaskBoardModelSchema.and(
                    TaskBoardRelationSchema.pick({ users: true })
                ),
            })
        )
    ).nullable(),
});

export const TaskBoardUserPatchBodySchema = TaskBoardUserUpdateSchema;

export const TaskBoardUserPatchResponseSchema = z.object({
    taskBoardUser: TaskBoardUserModelSchema.nullable(),
});

export const TaskBoardUserDeleteResponseSchema = z.object({
    taskBoardUser: TaskBoardUserModelSchema.nullable(),
});

export type TaskBoardUsersGetResponse<Id extends string | null> = z.infer<
    Id extends null
        ? typeof TaskBoardUsersGetResponseManyWithTaskBoardsSchema
        : typeof TaskBoardUsersGetResponseSingleSchema
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
