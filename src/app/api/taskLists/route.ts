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
export type TaskListsPostResponse =
    | {
          status: "success";
          taskList: TaskListModel;
      }
    | { status: "error" };

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
    const data = TaskListCreateSchema.parse(rawBody);
    const order = await prisma.taskList.count({
        where: { taskBoardId: data.taskBoardId },
    });

    try {
        const taskList = await prisma.taskList.create({
            data: {
                ...data,
                order,
            },
        });

        return NextResponse.json({ status: "success", taskList });
    } catch (e) {
        return NextResponse.json({ status: "error" });
    }
}
