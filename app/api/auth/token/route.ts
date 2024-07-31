import { gauth } from "@/_/common/lib/google";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import verifyToken from "../../_/utils/verifyToken";

export async function GET(request: NextRequest) {
    const userInfo = await verifyToken();
    return NextResponse.json({ userInfo });
}

export async function DELETE(request: NextRequest) {
    const accessToken = cookies().get("accessToken")?.value ?? null;
    const refreshToken = cookies().get("refreshToken")?.value ?? null;
    const response = NextResponse.json({});

    gauth.setCredentials({
        access_token: accessToken,
        refresh_token: refreshToken,
    });

    await gauth.revokeCredentials();
    cookies().delete("accessToken");
    cookies().delete("refreshToken");

    return response;
}
