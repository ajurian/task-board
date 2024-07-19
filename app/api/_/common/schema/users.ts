import { UserCreateSchema, UserModelSchema } from "@/_/common/schema/user";
import { z } from "zod";

export const UsersPutBodySchema = UserCreateSchema.omit({ googleId: true });
export const UsersPutResponseSchema = z.object({
    user: UserModelSchema,
});

export type UsersPutBody = z.infer<typeof UsersPutBodySchema>;
export type UsersPutResponse = z.infer<typeof UsersPutResponseSchema>;
