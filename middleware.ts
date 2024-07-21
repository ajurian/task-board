import ServerAuthTokenAPI from "@/api/_/common/layers/server/AuthTokenAPI";
import { NextRequest, NextResponse } from "next/server";
import { splitCookiesString } from "set-cookie-parser";

export async function middleware(request: NextRequest) {
    const response = NextResponse.next();

    try {
        const { headers } = await ServerAuthTokenAPI.get();
        const SetCookie = headers["set-cookie"]?.toString();

        splitCookiesString(SetCookie).forEach((cookie) =>
            response.headers.append("set-cookie", cookie)
        );
    } catch (e) {}

    response.headers.set("x-url", request.url);

    return response;
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
