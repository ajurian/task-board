import prisma from "@/_/lib/prisma";
import { TaskCreateSchema } from "@/_/schema/task";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { TasksGetResponse, TasksPostResponse } from "../_/schema/tasks";
import {
    badRequestErrorResponse,
    forbiddenErrorResponse,
    unauthorizedErrorResponse,
    unprocessableEntityErrorResponse,
} from "../_/utils/errorResponse";
import getPayloadEmail from "../_/utils/getPayloadEmail";

export async function GET(request: NextRequest) {
    const { nextUrl } = request;

    const { success, data: listId } = z
        .string()
        .safeParse(nextUrl.searchParams.get("listId"));

    if (!success) {
        return unprocessableEntityErrorResponse<TasksGetResponse>({
            tasks: [],
        });
    }

    const payloadEmail = await getPayloadEmail();

    if (payloadEmail === null) {
        return unauthorizedErrorResponse<TasksGetResponse>({
            tasks: [],
        });
    }

    const tasks = await prisma.task.findMany({
        where: { taskListId: listId },
        orderBy: { order: "asc" },
    });

    return NextResponse.json({ tasks });
}

export async function POST(request: NextRequest) {
    let data;

    try {
        const rawBody = await request.json();
        data = TaskCreateSchema.parse(rawBody);
    } catch (e) {
        return unprocessableEntityErrorResponse<TasksPostResponse>({
            task: null,
        });
    }

    const payloadEmail = await getPayloadEmail();

    if (payloadEmail === null) {
        return unauthorizedErrorResponse<TasksPostResponse>({
            task: null,
        });
    }

    const taskList = await prisma.taskList.findUnique({
        where: { id: data.taskListId },
        select: {
            taskBoard: { select: { owner: { select: { email: true } } } },
        },
    });

    if (taskList === null) {
        return badRequestErrorResponse<TasksPostResponse>({
            task: null,
        });
    }

    if (taskList.taskBoard.owner.email !== payloadEmail) {
        return forbiddenErrorResponse<TasksPostResponse>({
            task: null,
        });
    }

    await prisma.task.updateMany({
        where: { taskListId: data.taskListId },
        data: { order: { increment: 1 } },
    });

    const task = await prisma.task.create({ data });

    return NextResponse.json({ task });
}
