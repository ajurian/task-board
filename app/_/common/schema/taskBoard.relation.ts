import { z } from "zod";
import { TaskBoardUserModelSchema } from "./taskBoardUser";
import { TaskListModelSchema } from "./taskList";

export const TaskBoardRelationSchema = z.object({
    taskLists: TaskListModelSchema.array(),
    users: TaskBoardUserModelSchema.array(),
});

export type TaskBoardRelation = z.infer<typeof TaskBoardRelationSchema>;
