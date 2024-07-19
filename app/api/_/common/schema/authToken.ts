import { UserInfo } from "@/_/common/schema/userInfo";
import { z } from "zod";

export const AuthTokenPostBodySchema = z.object({
    idToken: z.string(),
    refreshToken: z.string(),
});

export type AuthTokenGetResponse = {
    userInfo: UserInfo | null;
};

export type AuthTokenPostBody = z.infer<typeof AuthTokenPostBodySchema>;
