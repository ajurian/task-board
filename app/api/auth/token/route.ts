import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import verifyToken from "../../_/utils/verifyToken";

export async function GET(request: NextRequest) {
    const userInfo = await verifyToken();
    return NextResponse.json({ userInfo });
}

export async function DELETE(request: NextRequest) {
    const response = NextResponse.json({});

    cookies().delete("accessToken");
    cookies().delete("refreshToken");

    return response;
}
