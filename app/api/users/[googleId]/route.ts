import prisma from "@/_/common/lib/prisma";
import { UsersPutBodySchema } from "@/api/_/common/schema/users";
import {
    forbiddenErrorResponse,
    unauthorizedErrorResponse,
    unprocessableEntityErrorResponse,
} from "@/api/_/utils/errorResponse";
import verifyToken from "@/api/_/utils/verifyToken";
import { NextRequest, NextResponse } from "next/server";

interface Segment {
    params: {
        googleId: string;
    };
}

export async function PUT(request: NextRequest, { params }: Segment) {
    const userInfo = await verifyToken();

    if (userInfo === null) {
        return unauthorizedErrorResponse({ user: null });
    }

    const { googleId } = params;
    if (userInfo.sub !== googleId) {
        return forbiddenErrorResponse({ user: null });
    }

    let data;

    try {
        const rawBody = await request.json();
        data = UsersPutBodySchema.parse(rawBody);
    } catch (e) {
        return unprocessableEntityErrorResponse({ user: null });
    }

    const user = await prisma.user.upsert({
        where: { googleId },
        create: { ...data, googleId },
        update: data,
    });

    return NextResponse.json({ user });
}
