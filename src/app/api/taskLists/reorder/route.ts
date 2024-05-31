import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const TaskListsReorderPostBodySchema = z.object({
    boardId: z.string(),
    fromIndex: z.number(),
    toIndex: z.number(),
});

export type TaskListsReorderPostBody = z.infer<
    typeof TaskListsReorderPostBodySchema
>;

export async function POST(request: NextRequest) {
    const rawBody = await request.json();
    const { boardId, fromIndex, toIndex } =
        TaskListsReorderPostBodySchema.parse(rawBody);

    if (fromIndex === toIndex) {
        return NextResponse.json("Unprocessable entity", { status: 422 });
    }

    const targetList = await prisma.taskList.findFirst({
        where: { order: fromIndex },
        select: { id: true },
    });

    if (targetList === null) {
        return NextResponse.json("`fromIndex` is out of bounds", {
            status: 400,
        });
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
