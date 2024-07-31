import "server-only";

import { gauth } from "@/_/common/lib/google";
import { UserInfoSchema } from "@/_/common/schema/userInfo";
import axios from "axios";
import { cookies } from "next/headers";
import { z } from "zod";
import saveTokens from "./saveTokens";

async function getUserInfo(accessToken: string) {
    const { data } = await axios.get(
        `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`
    );
    return UserInfoSchema.parse(data);
}

async function refreshAccessToken() {
    const { credentials } = await gauth.refreshAccessToken();
    const newAccessToken = z.string().parse(credentials.access_token);
    const newRefreshToken = z.string().parse(credentials.refresh_token);
    const accessTokenExpiration = z.number().parse(credentials.expiry_date);

    saveTokens({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        accessTokenExpiration,
    });

    return getUserInfo(newAccessToken);
}

export default async function verifyToken() {
    const accessToken = cookies().get("accessToken")?.value ?? null;
    const refreshToken = cookies().get("refreshToken")?.value ?? null;

    if (accessToken === null && refreshToken === null) {
        return null;
    }

    gauth.setCredentials({
        access_token: accessToken,
        refresh_token: refreshToken,
    });

    try {
        if (accessToken === null) {
            throw new Error("Access token needs to be refreshed.");
        }

        const userInfo = await getUserInfo(accessToken);
        return userInfo;
    } catch (e) {
        if (refreshToken === null) {
            return null;
        }

        const userInfo = await refreshAccessToken();
        return userInfo;
    }
}
