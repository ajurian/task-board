import { PERMISSION_TASK_REORDER } from "@/_/common/constants/permissions";
import prisma from "@/_/common/lib/prisma";
import { TasksReorderPostBodySchema } from "@/api/_/common/schema/tasks";
import { checkAuthorityWithDocument } from "@/api/_/utils/checkAuthority";
import { NextRequest, NextResponse } from "next/server";
import {
    badRequestErrorResponse,
    unprocessableEntityErrorResponse,
} from "../../_/utils/errorResponse";

export async function POST(request: NextRequest) {
    let data;

    try {
        const rawBody = await request.json();
        data = TasksReorderPostBodySchema.parse(rawBody);
    } catch (e) {
        return unprocessableEntityErrorResponse({});
    }

    const { boardId, fromListIndex, toListIndex, fromIndex, toIndex } = data;

    if (fromListIndex === toListIndex && fromIndex === toIndex) {
        return unprocessableEntityErrorResponse({});
    }

    const authority = await checkAuthorityWithDocument({
        requiredPermission: PERMISSION_TASK_REORDER,
        documentType: "taskBoard",
        documentId: boardId,
    });

    if (!authority.success) {
        return authority.errorResponse({});
    }

    const fromList = await prisma.taskList.findFirst({
        where: {
            taskBoardId: boardId,
            order: fromListIndex,
        },
        select: {
            id: true,
            taskBoard: {
                select: {
                    id: true,
                    users: { select: { userGoogleId: true } },
                },
            },
        },
    });

    if (fromList === null) {
        return badRequestErrorResponse({});
    }

    const toList = await prisma.taskList.findFirst({
        where: {
            taskBoardId: boardId,
            order: toListIndex,
        },
        select: { id: true },
    });

    if (toList === null) {
        return badRequestErrorResponse({});
    }

    const targetTask = await prisma.task.findFirst({
        where: {
            taskListId: fromList.id,
            order: fromIndex,
        },
        select: { id: true },
    });

    if (targetTask === null) {
        return badRequestErrorResponse({});
    }

    const { id } = targetTask;

    if (fromListIndex === toListIndex) {
        await prisma.$transaction(async (prisma) => {
            await prisma.task.update({
                where: { id },
                data: { order: toIndex },
            });

            if (toIndex > fromIndex) {
                await prisma.task.updateMany({
                    where: {
                        id: { not: id },
                        taskListId: toList.id,
                        order: { gt: fromIndex, lte: toIndex },
                    },
                    data: { order: { decrement: 1 } },
                });

                return;
            }

            await prisma.task.updateMany({
                where: {
                    id: { not: id },
                    taskListId: toList.id,
                    order: { gte: toIndex, lt: fromIndex },
                },
                data: { order: { increment: 1 } },
            });
        });

        return NextResponse.json({});
    }

    await prisma.$transaction([
        prisma.task.update({
            where: { id },
            data: { taskListId: toList.id, order: toIndex },
        }),
        prisma.task.updateMany({
            where: {
                taskListId: fromList.id,
                order: { gt: fromIndex },
            },
            data: { order: { decrement: 1 } },
        }),
        prisma.task.updateMany({
            where: {
                id: { not: id },
                taskListId: toList.id,
                order: { gte: toIndex },
            },
            data: { order: { increment: 1 } },
        }),
    ]);

    return NextResponse.json({});
}
