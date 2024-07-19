import { z } from "zod";
import { TaskBoardModelSchema } from "./taskBoard";
import { UserModelSchema } from "./user";

export const TaskBoardUserModelSchema = z.object({
    id: z.string(),
    userGoogleId: z.string(),
    taskBoardId: z.string(),
    permission: z.number().int(),
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
