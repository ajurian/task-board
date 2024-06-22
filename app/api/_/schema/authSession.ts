import { DecodedIdToken } from "firebase-admin/auth";
import { z } from "zod";

export const AuthSessionPostBodySchema = z.object({
    idToken: z.string(),
    refreshToken: z.string(),
});

export type AuthSessionGetResponse = {
    session: DecodedIdToken | null;
};

export type AuthSessionPostBody = z.infer<typeof AuthSessionPostBodySchema>;
