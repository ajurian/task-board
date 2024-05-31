import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const TasksReorderPostBodySchema = z.object({
    boardId: z.string(),
    fromListIndex: z.number(),
    toListIndex: z.number(),
    fromIndex: z.number(),
    toIndex: z.number(),
});

export type TasksReorderPostBody = z.infer<typeof TasksReorderPostBodySchema>;

export async function POST(request: NextRequest) {
    const rawBody = await request.json();
    const { boardId, fromListIndex, toListIndex, fromIndex, toIndex } =
        TasksReorderPostBodySchema.parse(rawBody);

    if (fromListIndex === toListIndex && fromIndex === toIndex) {
        return NextResponse.json("Unprocessable entity", { status: 422 });
    }

    const fromList = await prisma.taskList.findFirst({
        where: {
            taskBoardId: boardId,
            order: fromListIndex,
        },
        select: { id: true },
    });

    if (fromList === null) {
        return NextResponse.json("`fromListIndex` is out of bounds", {
            status: 400,
        });
    }

    const toList = await prisma.taskList.findFirst({
        where: {
            taskBoardId: boardId,
            order: toListIndex,
        },
        select: { id: true },
    });

    if (toList === null) {
        return NextResponse.json("`toListIndex` is out of bounds", {
            status: 400,
        });
    }

    const targetTask = await prisma.task.findFirst({
        where: {
            taskListId: fromList.id,
            order: fromIndex,
        },
        select: { id: true },
    });

    if (targetTask === null) {
        return NextResponse.json("`fromIndex` is out of bounds", {
            status: 400,
        });
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
