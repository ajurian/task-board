import { z } from "zod";
import { TaskBoardUserModelSchema } from "./taskBoardUser";

export const UserRelationSchema = z.object({
    taskBoards: TaskBoardUserModelSchema.array(),
});

export type UserRelation = z.infer<typeof UserRelationSchema>;
