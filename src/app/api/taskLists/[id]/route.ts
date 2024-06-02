import prisma from "@/lib/prisma";
import {
    TaskListModel,
    TaskListUpdate,
    TaskListUpdateSchema,
} from "@/schema/taskList";
import { NextRequest, NextResponse } from "next/server";

interface Segment {
    params: {
        id: string;
    };
}

export type TaskListGetResponse = { taskList: TaskListModel | null };
export type TaskListPatchBody = TaskListUpdate;
export type TaskListPatchResponse = { taskList: TaskListModel };
export type TaskListDeleteResponse = { taskList: TaskListModel };

export async function GET(request: NextRequest, { params }: Segment) {
    const { id } = params;
    const taskList = await prisma.taskList.findUnique({ where: { id } });

    return NextResponse.json({ taskList });
}

export async function PATCH(request: NextRequest, { params }: Segment) {
    const { id } = params;
    const rawBody = await request.json();
    const data = TaskListUpdateSchema.parse(rawBody);

    const taskList = await prisma.taskList.update({
        where: { id },
        data,
    });

    return NextResponse.json({ taskList });
}

export async function DELETE(request: NextRequest, { params }: Segment) {
    const { id } = params;

    await prisma.task.deleteMany({ where: { taskListId: id } });

    const taskList = await prisma.taskList.delete({ where: { id } });

    await prisma.taskList.updateMany({
        where: {
            taskBoardId: taskList.taskBoardId,
            order: { gt: taskList.order },
        },
        data: { order: { decrement: 1 } },
    });

    return NextResponse.json({ taskList });
}
