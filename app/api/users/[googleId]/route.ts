import prisma from "@/_/common/lib/prisma";
import { UsersPutBodySchema } from "@/api/_/common/schema/users";
import { checkAuthority } from "@/api/_/utils/checkAuthority";
import {
    forbiddenErrorResponse,
    unprocessableEntityErrorResponse,
} from "@/api/_/utils/errorResponse";
import { NextRequest, NextResponse } from "next/server";

interface Segment {
    params: {
        googleId: string;
    };
}

export async function PUT(request: NextRequest, { params }: Segment) {
    const authority = await checkAuthority();

    if (!authority.success) {
        return authority.errorResponse({ user: null });
    }

    let data;

    try {
        const rawBody = await request.json();
        data = UsersPutBodySchema.parse(rawBody);
    } catch (e) {
        return unprocessableEntityErrorResponse({ user: null });
    }

    const { googleId } = params;

    if (authority.user.googleId !== googleId) {
        return forbiddenErrorResponse({ user: null });
    }

    const user = await prisma.user.upsert({
        where: { googleId },
        create: { ...data, googleId },
        update: data,
    });

    return NextResponse.json({ user });
}
