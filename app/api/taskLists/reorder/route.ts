import prisma from "@/_/lib/prisma";
import { TaskListsReorderPostBodySchema } from "@/api/_/schema/taskLists";
import { NextRequest, NextResponse } from "next/server";
import {
    badRequestErrorResponse,
    forbiddenErrorResponse,
    unauthorizedErrorResponse,
    unprocessableEntityErrorResponse,
} from "../../_/utils/errorResponse";
import getPayloadEmail from "../../_/utils/getPayloadEmail";

export async function POST(request: NextRequest) {
    let data;

    try {
        const rawBody = await request.json();
        data = TaskListsReorderPostBodySchema.parse(rawBody);
    } catch (e) {
        return unprocessableEntityErrorResponse({});
    }

    const payloadEmail = await getPayloadEmail();

    if (payloadEmail === null) {
        return unauthorizedErrorResponse({});
    }

    const { boardId, fromIndex, toIndex } = data;

    if (fromIndex === toIndex) {
        return badRequestErrorResponse({});
    }

    const targetList = await prisma.taskList.findFirst({
        where: { taskBoardId: boardId, order: fromIndex },
        select: {
            id: true,
            taskBoard: { select: { owner: { select: { email: true } } } },
        },
    });

    if (targetList === null) {
        return badRequestErrorResponse({});
    }

    if (targetList.taskBoard.owner.email !== payloadEmail) {
        return forbiddenErrorResponse({});
    }

    const { id } = targetList;

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
    } else {
        await prisma.taskList.updateMany({
            where: {
                id: { not: id },
                taskBoardId: boardId,
                order: { gte: toIndex, lt: fromIndex },
            },
            data: { order: { increment: 1 } },
        });
    }

    return NextResponse.json({});
}
