import { z } from "zod";

export const UserInfoSchema = z.object({
    sub: z.string(),
    name: z.string(),
    given_name: z.string(),
    family_name: z.string(),
    picture: z.string().url(),
    email: z.string().email(),
    email_verified: z.boolean(),
});

export type UserInfo = z.infer<typeof UserInfoSchema>;
