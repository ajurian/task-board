import prisma from "@/_/lib/prisma";
import { TasksReorderPostBodySchema } from "@/api/_/schema/tasks";
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
        data = TasksReorderPostBodySchema.parse(rawBody);
    } catch (e) {
        return unprocessableEntityErrorResponse({});
    }

    const payloadEmail = await getPayloadEmail();

    if (payloadEmail === null) {
        return unauthorizedErrorResponse({});
    }

    const { boardId, fromListIndex, toListIndex, fromIndex, toIndex } = data;

    if (fromListIndex === toListIndex && fromIndex === toIndex) {
        return badRequestErrorResponse({});
    }

    const fromList = await prisma.taskList.findFirst({
        where: {
            taskBoardId: boardId,
            order: fromListIndex,
        },
        select: {
            id: true,
            taskBoard: { select: { owner: { select: { email: true } } } },
        },
    });

    if (fromList === null) {
        return badRequestErrorResponse({});
    }

    if (fromList.taskBoard.owner.email !== payloadEmail) {
        return forbiddenErrorResponse({});
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
    const isIntoNewList = fromListIndex !== toListIndex;

    if (isIntoNewList) {
        await prisma.task.update({
            where: { id },
            data: { taskListId: toList.id, order: toIndex },
        });

        await prisma.task.updateMany({
            where: {
                taskListId: fromList.id,
                order: { gt: fromIndex },
            },
            data: { order: { decrement: 1 } },
        });

        await prisma.task.updateMany({
            where: {
                id: { not: id },
                taskListId: toList.id,
                order: { gte: toIndex },
            },
            data: { order: { increment: 1 } },
        });
    } else {
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
        } else {
            await prisma.task.updateMany({
                where: {
                    id: { not: id },
                    taskListId: toList.id,
                    order: { gte: toIndex, lt: fromIndex },
                },
                data: { order: { increment: 1 } },
            });
        }
    }

    return NextResponse.json({});
}
