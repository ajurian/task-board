import "server-only";

import { adminAuth } from "@/_/lib/firebaseAdmin";
import axios from "axios";
import { FirebaseAuthError } from "firebase-admin/auth";
import { cookies } from "next/headers";
import { z } from "zod";

interface SecureTokenApiResponse {
    expires_in: string;
    token_type: "Bearer";
    refresh_token: string;
    id_token: string;
    user_id: string;
    project_id: string;
}

export default async function verifyIdToken() {
    try {
        const idToken = cookies().get("idToken")?.value || "";
        const payload = await adminAuth.verifyIdToken(idToken, true);
        return payload;
    } catch (e) {
        if (!(e instanceof FirebaseAuthError)) {
            return null;
        }

        if (
            e.code !== "auth/id-token-expired" &&
            e.code !== "auth/argument-error"
        ) {
            return null;
        }

        const { success, data: refreshToken } = z
            .string()
            .safeParse(cookies().get("refreshToken")?.value);

        if (!success) {
            return null;
        }

        const { data } = await axios.post<SecureTokenApiResponse>(
            `https://securetoken.googleapis.com/v1/token?key=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`,
            {
                grant_type: "refresh_token",
                refresh_token: refreshToken,
            }
        );

        cookies().set({
            name: "idToken",
            value: data.id_token,
            sameSite: "strict",
            maxAge: 60 * 60,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
        });

        cookies().set({
            name: "refreshToken",
            value: data.refresh_token,
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 400,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
        });

        return adminAuth.verifyIdToken(data.id_token);
    }
}
