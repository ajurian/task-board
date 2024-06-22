import { AuthSessionPostBodySchema } from "@/api/_/schema/authSession";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import verifyIdToken from "../../_/utils/verifyIdToken";

export async function GET(request: NextRequest) {
    const session = await verifyIdToken();
    return NextResponse.json({ session });
}

export async function POST(request: NextRequest) {
    const rawBody = await request.json();
    const { idToken, refreshToken } = AuthSessionPostBodySchema.parse(rawBody);

    cookies().set({
        name: "idToken",
        value: idToken,
        sameSite: "strict",
        maxAge: 60 * 60,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    });

    cookies().set({
        name: "refreshToken",
        value: refreshToken,
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 400,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    });

    return NextResponse.json({});
}

export async function DELETE(request: NextRequest) {
    cookies().delete("idToken");
    cookies().delete("refreshToken");

    return NextResponse.json({});
}
