import "server-only";

import { gauth } from "@/_/common/lib/google";
import { cookies } from "next/headers";

export default function setCredentials(refreshToken: string | null) {
    if (refreshToken === null) {
        refreshToken = cookies().get("refreshToken")?.value ?? null;

        if (refreshToken === null) {
            return false;
        }
    }

    gauth.setCredentials({ refresh_token: refreshToken });

    cookies().set({
        name: "refreshToken",
        value: refreshToken,
        maxAge: 60 * 60 * 24 * 400,
        sameSite: "lax",
        httpOnly: true,
        secure: process.env.NEXT_PUBLIC_VERCEL_ENV === "production",
    });

    return true;
}
