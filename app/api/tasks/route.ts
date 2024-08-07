import {
    PERMISSION_CONTENT_READ,
    PERMISSION_TASK_CREATE_DELETE,
} from "@/_/common/constants/permissions";
import prisma from "@/_/common/lib/prisma";
import { TaskCreateSchema } from "@/_/common/schema/task";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { TasksGetResponse, TasksPostResponse } from "../_/common/schema/tasks";
import { checkAuthorityWithDocument } from "../_/utils/checkAuthority";
import { unprocessableEntityErrorResponse } from "../_/utils/errorResponse";
import runTransaction from "../_/utils/runTransaction";

export async function GET(request: NextRequest) {
    const { nextUrl } = request;
    const { success, data: listId } = z
        .string()
        .safeParse(nextUrl.searchParams.get("listId"));

    if (!success) {
        return unprocessableEntityErrorResponse<TasksGetResponse>({
            tasks: [],
        });
    }

    const authority = await checkAuthorityWithDocument({
        requiredPermission: PERMISSION_CONTENT_READ,
        documentType: "taskList",
        documentId: listId,
    });

    if (!authority.success) {
        return authority.errorResponse<TasksGetResponse>({ tasks: [] });
    }

    const { user } = authority;
    const tasks = await prisma.task.findMany({
        where: {
            taskList: {
                id: listId,
                taskBoard: {
                    users: { some: { userGoogleId: user.googleId } },
                },
            },
        },
        orderBy: { order: "asc" },
    });

    return NextResponse.json({ tasks });
}

export async function POST(request: NextRequest) {
    let data;

    try {
        const rawBody = await request.json();
        data = TaskCreateSchema.parse(rawBody);
    } catch (e) {
        return unprocessableEntityErrorResponse<TasksPostResponse>({
            task: null,
        });
    }

    const authority = await checkAuthorityWithDocument({
        requiredPermission: PERMISSION_TASK_CREATE_DELETE,
        documentType: "taskList",
        documentId: data.taskListId,
    });

    if (!authority.success) {
        return authority.errorResponse<TasksPostResponse>({ task: null });
    }

    const task = await runTransaction(async (prisma) => {
        const { maxTasks } = await prisma.taskBoard.findUniqueOrThrow({
            where: { id: authority.document.taskBoard.id },
            select: { maxTasks: true },
        });

        const taskCount = await prisma.task.count({
            where: { taskListId: data.taskListId },
        });

        if (taskCount >= maxTasks) {
            throw new Error("Task list reached maximum task limit");
        }

        await prisma.task.updateMany({
            where: { taskListId: data.taskListId },
            data: { order: { increment: 1 } },
        });

        return prisma.task.create({ data });
    });

    return NextResponse.json({ task });
}
