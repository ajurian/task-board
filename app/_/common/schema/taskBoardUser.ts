import { ObjectId } from "bson";
import { z } from "zod";
import {
    PERMISSION_ROLE_NONE,
    PERMISSION_ROLE_OWNER,
} from "../constants/permissions";
import { TaskBoardModelSchema } from "./taskBoard";
import { UserModelSchema } from "./user";

export const TaskBoardUserModelSchema = z.object({
    id: z.string().refine(ObjectId.isValid),
    userGoogleId: z.string(),
    taskBoardId: z.string().refine(ObjectId.isValid),
    permission: z
        .number()
        .int()
        .min(PERMISSION_ROLE_NONE)
        .max(PERMISSION_ROLE_OWNER),
    isVisitor: z.boolean(),
    joinedAt: z.coerce.date(),
    recentlyAccessedAt: z.coerce.date(),
});

export const TaskBoardUserRelationSchema = z.object({
    user: UserModelSchema,
    taskBoard: TaskBoardModelSchema,
});

export const TaskBoardUserCreateSchema = TaskBoardUserModelSchema.pick({
    userGoogleId: true,
    taskBoardId: true,
    permission: true,
    isVisitor: true,
});

export const TaskBoardUserUpdateSchema = TaskBoardUserModelSchema.pick({
    recentlyAccessedAt: true,
});

export type TaskBoardUserModel = z.infer<typeof TaskBoardUserModelSchema>;
export type TaskBoardUserRelation = z.infer<typeof TaskBoardUserRelationSchema>;
export type TaskBoardUserCreate = z.infer<typeof TaskBoardUserCreateSchema>;
export type TaskBoardUserUpdate = z.infer<typeof TaskBoardUserUpdateSchema>;
