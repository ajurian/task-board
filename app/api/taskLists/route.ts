import {
    PERMISSION_CONTENT_READ,
    PERMISSION_TASK_LIST_CREATE_DELETE,
} from "@/_/common/constants/permissions";
import prisma from "@/_/common/lib/prisma";
import { TaskListCreateSchema } from "@/_/common/schema/taskList";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
    TaskListsGetResponse,
    TaskListsPostResponse,
} from "../_/common/schema/taskLists";
import { checkAuthorityWithDocument } from "../_/utils/checkAuthority";
import { unprocessableEntityErrorResponse } from "../_/utils/errorResponse";
import runTransaction from "../_/utils/runTransaction";

export async function GET(request: NextRequest) {
    const { nextUrl } = request;
    const { success, data: boardId } = z
        .string()
        .safeParse(nextUrl.searchParams.get("boardId"));

    if (!success) {
        return unprocessableEntityErrorResponse<TaskListsGetResponse>({
            taskLists: [],
        });
    }

    const authority = await checkAuthorityWithDocument({
        requiredPermission: PERMISSION_CONTENT_READ,
        documentType: "taskBoard",
        documentId: boardId,
    });

    if (!authority.success) {
        return authority.errorResponse<TaskListsGetResponse>({
            taskLists: [],
        });
    }

    const { user } = authority;
    const taskLists = await prisma.taskList.findMany({
        where: {
            taskBoard: {
                id: boardId,
                users: { some: { userGoogleId: user.googleId } },
            },
        },
        orderBy: { order: "asc" },
    });

    return NextResponse.json({ taskLists });
}

export async function POST(request: NextRequest) {
    let data;

    try {
        const rawBody = await request.json();
        data = TaskListCreateSchema.parse(rawBody);
    } catch (e) {
        return unprocessableEntityErrorResponse<TaskListsPostResponse>({
            taskList: null,
        });
    }

    const authority = await checkAuthorityWithDocument({
        requiredPermission: PERMISSION_TASK_LIST_CREATE_DELETE,
        documentType: "taskBoard",
        documentId: data.taskBoardId,
    });

    if (!authority.success) {
        return authority.errorResponse<TaskListsPostResponse>({
            taskList: null,
        });
    }

    const taskList = await runTransaction(async (prisma) => {
        const order = await prisma.taskList.count({
            where: { taskBoardId: data.taskBoardId },
        });

        return prisma.taskList.create({
            data: {
                ...data,
                order,
            },
        });
    });

    return NextResponse.json({ taskList });
}
