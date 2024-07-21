import "server-only";

import ServerAuthTokenAPI from "@/api/_/common/layers/server/AuthTokenAPI";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";
import { z } from "zod";

export default function withProtectedRoute<P = {}>(Page: React.FC<P>) {
    return async function WithProtectedRoute(props: P) {
        const {
            data: { userInfo },
        } = await ServerAuthTokenAPI.get();

        if (userInfo === null) {
            const currentUrl = z.string().parse(headers().get("x-url"));
            return redirect(`/auth/login?redirectUri=${currentUrl}`);
        }

        return <Page {...props} userInfo={userInfo} />;
    };
}
