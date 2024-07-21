import { gauth } from "@/_/common/lib/google";
import { badRequestErrorResponse } from "@/api/_/utils/errorResponse";
import setCredentials from "@/api/_/utils/setCredentials";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const StateSchema = z.object({
    redirectUri: z.string().url(),
});

export async function GET(request: NextRequest) {
    const { nextUrl } = request;
    const { searchParams } = nextUrl;
    const { success, data } = z.string().safeParse(searchParams.get("code"));

    if (!success) {
        return NextResponse.redirect(new URL("/auth/login", nextUrl.origin));
    }

    try {
        const { tokens } = await gauth.getToken(data);
        setCredentials(tokens.refresh_token ?? null);

        console.log(cookies().getAll());

        const rawState = searchParams.get("state");

        if (!rawState) {
            return NextResponse.redirect(`${nextUrl.origin}/board`);
        }

        const { success, data: state } = StateSchema.safeParse(
            JSON.parse(Buffer.from(rawState, "base64url").toString("utf-8"))
        );

        if (!success) {
            return NextResponse.redirect(`${nextUrl.origin}/board`);
        }

        return NextResponse.redirect(state.redirectUri);
    } catch (e) {
        return badRequestErrorResponse({
            error: { message: "Failed to retrieve tokens", code: 400 },
        });
    }
}
