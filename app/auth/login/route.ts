import { gauth } from "@/_/common/lib/google";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const { searchParams } = request.nextUrl;
    const hint = searchParams.get("hint");
    const redirectUri = searchParams.get("redirectUri");

    return NextResponse.redirect(
        gauth.generateAuthUrl({
            access_type: "offline",
            prompt: "consent",
            scope: ["profile", "email"],
            ...(hint !== null && { login_hint: hint }),
            ...(redirectUri !== null &&
                redirectUri.length > 0 && {
                    state: Buffer.from(
                        JSON.stringify({ redirectUri })
                    ).toString("base64url"),
                }),
        })
    );
}
