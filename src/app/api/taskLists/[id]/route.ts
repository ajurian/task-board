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

export type TaskListGetResponse = TaskListModel | null;
export type TaskListPatchBody = TaskListUpdate;
export type TaskListPatchResponse = TaskListModel;
export type TaskListDeleteResponse = TaskListModel;

export async function GET(request: NextRequest, { params }: Segment) {
    const { id } = params;
    const taskList = await prisma.taskList.findUnique({ where: { id } });

    return NextResponse.json(taskList);
}

export async function PATCH(request: NextRequest, { params }: Segment) {
    const { id } = params;
    const rawBody = await request.json();
    const data = TaskListUpdateSchema.parse(rawBody);

    const taskList = await prisma.taskList.update({
        where: { id },
        data,
    });

    return NextResponse.json(taskList);
}

export async function DELETE(request: NextRequest, { params }: Segment) {
    const { id } = params;
    const taskList = await prisma.taskList.delete({ where: { id } });

    return NextResponse.json(taskList);
}
