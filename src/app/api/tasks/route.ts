import prisma from "@/lib/prisma";
import { TaskCreate, TaskCreateSchema, TaskModel } from "@/schema/task";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export type TasksGetResponse = { tasks: TaskModel[] };
export type TasksPostBody = TaskCreate;
export type TasksPostResponse = { task: TaskModel };

export async function GET(request: NextRequest) {
    const { nextUrl } = request;
    const listId = z.string().parse(nextUrl.searchParams.get("listId"));
    const tasks = await prisma.task.findMany({
        where: { taskListId: listId },
        orderBy: { order: "asc" },
    });

    return NextResponse.json({ tasks });
}

export async function POST(request: NextRequest) {
    const rawBody = await request.json();
    const data = TaskCreateSchema.parse(rawBody);

    await prisma.task.updateMany({
        where: { taskListId: data.taskListId },
        data: { order: { increment: 1 } },
    });

    const task = await prisma.task.create({ data });

    return NextResponse.json({ task });
}
