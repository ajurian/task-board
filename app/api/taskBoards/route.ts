import { PERMISSION_ROLE_OWNER } from "@/_/common/constants/permissions";
import prisma from "@/_/common/lib/prisma";
import { TaskBoardCreateSchema } from "@/_/common/schema/taskBoard";
import { NextRequest, NextResponse } from "next/server";
import {
    TaskBoardsGetResponse,
    TaskBoardsPostResponse,
} from "../_/common/schema/taskBoards";
import { checkAuthority } from "../_/utils/checkAuthority";
import { unprocessableEntityErrorResponse } from "../_/utils/errorResponse";

export async function GET(request: NextRequest) {
    const authority = await checkAuthority();

    if (!authority.success) {
        return authority.errorResponse<TaskBoardsGetResponse>({
            taskBoards: [],
        });
    }

    const { user } = authority;
    const taskBoards = await prisma.taskBoard.findMany({
        where: {
            users: { some: { userGoogleId: user.googleId } },
        },
    });

    return NextResponse.json({ taskBoards });
}

export async function POST(request: NextRequest) {
    let data;

    try {
        const rawBody = await request.json();
        data = TaskBoardCreateSchema.parse(rawBody);
    } catch (e) {
        return unprocessableEntityErrorResponse<TaskBoardsPostResponse>({
            taskBoard: null,
        });
    }

    const authority = await checkAuthority();

    if (!authority.success) {
        return authority.errorResponse<TaskBoardsPostResponse>({
            taskBoard: null,
        });
    }

    const { user } = authority;
    const taskBoard = await prisma.taskBoard.create({
        data: {
            ...data,
            thumbnailData: null,
            users: {
                create: {
                    userGoogleId: user.googleId,
                    permission: PERMISSION_ROLE_OWNER,
                    isVisitor: false,
                },
            },
        },
    });

    return NextResponse.json({ taskBoard });
}
