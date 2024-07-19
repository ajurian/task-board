import "server-only";

import { gauth } from "@/_/common/lib/google";
import { UserInfoSchema } from "@/_/common/schema/userInfo";
import axios from "axios";
import { cookies } from "next/headers";
import { z } from "zod";
import setCredentials from "./setCredentials";

export default async function verifyToken() {
    const refreshToken = cookies().get("refreshToken")?.value ?? null;

    if (refreshToken === null) {
        return null;
    }

    let accessToken;

    gauth.setCredentials({ refresh_token: refreshToken });

    try {
        const { token } = await gauth.getAccessToken();
        accessToken = token;
    } catch (e) {
        const { credentials } = await gauth.refreshAccessToken();
        accessToken = z.string().parse(credentials.access_token);
        setCredentials(credentials.refresh_token ?? null);
    }

    const { data } = await axios.get(
        `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`
    );
    const userInfo = UserInfoSchema.parse(data);

    return userInfo;
}
