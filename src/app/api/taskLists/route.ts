import prisma from "@/lib/prisma";
import {
    TaskListCreate,
    TaskListCreateSchema,
    TaskListModel,
} from "@/schema/taskList";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export type TaskListsGetResponse = { taskLists: TaskListModel[] };
export type TaskListsPostBody = TaskListCreate;
export type TaskListsPostResponse = { taskList: TaskListModel };

export async function GET(request: NextRequest) {
    const { nextUrl } = request;
    const boardId = z.string().parse(nextUrl.searchParams.get("boardId"));
    const taskLists = await prisma.taskList.findMany({
        where: { taskBoardId: boardId },
        orderBy: { order: "asc" },
    });

    return NextResponse.json({ taskLists });
}

export async function POST(request: NextRequest) {
    const rawBody = await request.json();
    const { taskBoardId, title } = TaskListCreateSchema.parse(rawBody);
    const order = await prisma.taskList.count({ where: { taskBoardId } });

    const taskList = await prisma.taskList.create({
        data: {
            taskBoardId,
            order,
            title,
        },
    });

    return NextResponse.json({ taskList });
}
