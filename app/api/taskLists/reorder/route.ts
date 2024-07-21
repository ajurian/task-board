import { PERMISSION_TASK_LIST_REORDER } from "@/_/common/constants/permissions";
import prisma from "@/_/common/lib/prisma";
import { TaskListsReorderPostBodySchema } from "@/api/_/common/schema/taskLists";
import { checkAuthorityWithDocument } from "@/api/_/utils/checkAuthority";
import runTransaction from "@/api/_/utils/runTransaction";
import { NextRequest, NextResponse } from "next/server";
import {
    badRequestErrorResponse,
    unprocessableEntityErrorResponse,
} from "../../_/utils/errorResponse";

export async function POST(request: NextRequest) {
    let data;

    try {
        const rawBody = await request.json();
        data = TaskListsReorderPostBodySchema.parse(rawBody);
    } catch (e) {
        return unprocessableEntityErrorResponse({});
    }

    const { boardId, fromIndex, toIndex } = data;

    if (fromIndex === toIndex) {
        return unprocessableEntityErrorResponse({});
    }

    const authority = await checkAuthorityWithDocument({
        requiredPermission: PERMISSION_TASK_LIST_REORDER,
        documentType: "taskBoard",
        documentId: boardId,
    });

    if (!authority.success) {
        return authority.errorResponse({});
    }

    const targetList = await prisma.taskList.findFirst({
        where: { taskBoardId: boardId, order: fromIndex },
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

    if (targetList === null) {
        return badRequestErrorResponse({});
    }

    const { id } = targetList;

    await runTransaction(async (prisma) => {
        await prisma.taskList.update({
            where: { id },
            data: { order: toIndex },
        });

        if (toIndex > fromIndex) {
            await prisma.taskList.updateMany({
                where: {
                    id: { not: id },
                    taskBoardId: boardId,
                    order: { gt: fromIndex, lte: toIndex },
                },
                data: { order: { decrement: 1 } },
            });

            return;
        }

        await prisma.taskList.updateMany({
            where: {
                id: { not: id },
                taskBoardId: boardId,
                order: { gte: toIndex, lt: fromIndex },
            },
            data: { order: { increment: 1 } },
        });
    });

    return NextResponse.json({});
}
