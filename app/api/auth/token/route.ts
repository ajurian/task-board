import { gauth } from "@/_/common/lib/google";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import verifyToken from "../../_/utils/verifyToken";

export async function GET(request: NextRequest) {
    const userInfo = await verifyToken();
    return NextResponse.json({ userInfo });
}

export async function DELETE(request: NextRequest) {
    await gauth.revokeCredentials();
    cookies().delete("refreshToken");
    return NextResponse.json({});
}
