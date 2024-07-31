import "server-only";

import { cookies } from "next/headers";

interface Tokens {
    accessToken: string;
    refreshToken: string;
    accessTokenExpiration: number;
}

export default function saveTokens({
    accessToken,
    refreshToken,
    accessTokenExpiration,
}: Tokens) {
    cookies().set({
        name: "accessToken",
        value: accessToken,
        expires: accessTokenExpiration,
        sameSite: "lax",
        httpOnly: true,
        secure: process.env.NEXT_PUBLIC_VERCEL_ENV! === "production",
    });

    cookies().set({
        name: "refreshToken",
        value: refreshToken,
        maxAge: 60 * 60 * 24 * 400,
        sameSite: "lax",
        httpOnly: true,
        secure: process.env.NEXT_PUBLIC_VERCEL_ENV! === "production",
    });
}
