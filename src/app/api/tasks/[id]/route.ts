import prisma from "@/lib/prisma";
import { TaskModel, TaskUpdate, TaskUpdateSchema } from "@/schema/task";
import { NextRequest, NextResponse } from "next/server";

interface Segment {
    params: {
        id: string;
    };
}

export type TaskGetResponse = { task: TaskModel | null };
export type TaskPatchBody = TaskUpdate;
export type TaskPatchResponse = { task: TaskModel };
export type TaskDeleteResponse =
    | { status: "success"; task: TaskModel }
    | { status: "error" };

export async function GET(request: NextRequest, { params }: Segment) {
    const { id } = params;
    const task = await prisma.task.findUnique({ where: { id } });

    return NextResponse.json({ task });
}

export async function PATCH(request: NextRequest, { params }: Segment) {
    const { id } = params;
    const rawBody = await request.json();
    const data = TaskUpdateSchema.parse(rawBody);

    const task = await prisma.task.update({
        where: { id },
        data,
    });

    return NextResponse.json({ task });
}

export async function DELETE(request: NextRequest, { params }: Segment) {
    const { id } = params;

    try {
        const task = await prisma.task.delete({ where: { id } });

        await prisma.task.updateMany({
            where: {
                taskListId: task.taskListId,
                order: { gt: task.order },
            },
            data: { order: { decrement: 1 } },
        });

        return NextResponse.json({ status: "success", task });
    } catch (e) {
        return NextResponse.json({ status: "error" });
    }
}
