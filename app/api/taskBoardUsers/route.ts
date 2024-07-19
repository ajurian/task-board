import prisma from "@/_/common/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { checkAuthority } from "../_/utils/checkAuthority";

export async function GET(request: NextRequest) {
    const authority = await checkAuthority();

    if (!authority.success) {
        return authority.errorResponse({});
    }

    const { searchParams } = request.nextUrl;
    const userGoogleId = authority.user.googleId;
    const taskBoardId = searchParams.get("taskBoardId");

    if (taskBoardId === null) {
        const taskBoardUsers = await prisma.taskBoardUser.findMany({
            where: { userGoogleId },
            include: { taskBoard: { include: { users: true } } },
            orderBy: { recentlyAccessedAt: "desc" },
        });

        return NextResponse.json({ taskBoardUsers });
    }

    const taskBoardUser = await prisma.taskBoardUser.findUnique({
        where: {
            index: {
                userGoogleId,
                taskBoardId,
            },
        },
        include: {
            user: { include: { taskBoards: true } },
            taskBoard: { include: { users: true } },
        },
    });

    return NextResponse.json({ taskBoardUser });
}
