import { UserCreate, UserModelSchema } from "@/_/schema/user";
import { z } from "zod";

export const UsersPostResponseSchema = z.object({
    user: UserModelSchema,
});

export type UsersPostBody = UserCreate;
export type UsersPostResponse = z.infer<typeof UsersPostResponseSchema>;
