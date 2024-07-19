import { z } from "zod";
import { TaskBoardModelSchema } from "./taskBoard";
import { TaskBoardUserModelSchema } from "./taskBoardUser";
import { AggregatedTaskListModelSchema } from "./taskList";
import { UserModelSchema } from "./user";

export const AggregatedTaskBoardModelSchema = TaskBoardModelSchema.extend({
    taskLists: AggregatedTaskListModelSchema.array(),
    users: TaskBoardUserModelSchema.extend({ user: UserModelSchema }).array(),
});

export type AggregatedTaskBoardModel = z.infer<
    typeof AggregatedTaskBoardModelSchema
>;
