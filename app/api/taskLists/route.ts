import prisma from "@/_/lib/prisma";
import { TaskListCreateSchema } from "@/_/schema/taskList";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
    badRequestErrorResponse,
    forbiddenErrorResponse,
    unauthorizedErrorResponse,
    unprocessableEntityErrorResponse,
} from "../_/utils/errorResponse";
import getPayloadEmail from "../_/utils/getPayloadEmail";
import { TaskListsGetResponse, TaskListsPostResponse } from "../_/schema/taskLists";

export async function GET(request: NextRequest) {
    const { nextUrl } = request;

    const { success, data: boardId } = z
        .string()
        .safeParse(nextUrl.searchParams.get("boardId"));

    if (!success) {
        return unprocessableEntityErrorResponse<TaskListsGetResponse>({
            taskLists: [],
        });
    }

    const payloadEmail = await getPayloadEmail();

    if (payloadEmail === null) {
        return unauthorizedErrorResponse<TaskListsGetResponse>({
            taskLists: [],
        });
    }

    const taskLists = await prisma.taskList.findMany({
        where: {
            taskBoard: {
                id: boardId,
                owner: { email: payloadEmail },
            },
        },
        orderBy: { order: "asc" },
    });

    return NextResponse.json({ taskLists });
}

export async function POST(request: NextRequest) {
    let data;

    try {
        const rawBody = await request.json();
        data = TaskListCreateSchema.parse(rawBody);
    } catch (e) {
        return unprocessableEntityErrorResponse<TaskListsPostResponse>({
            taskList: null,
        });
    }

    const payloadEmail = await getPayloadEmail();

    if (payloadEmail === null) {
        return unauthorizedErrorResponse<TaskListsPostResponse>({
            taskList: null,
        });
    }

    const taskBoard = await prisma.taskBoard.findUnique({
        where: { id: data.taskBoardId },
        select: { owner: { select: { email: true } } },
    });

    if (taskBoard === null) {
        return badRequestErrorResponse<TaskListsPostResponse>({
            taskList: null,
        });
    }

    if (taskBoard.owner.email !== payloadEmail) {
        return forbiddenErrorResponse<TaskListsPostResponse>({
            taskList: null,
        });
    }

    const order = await prisma.taskList.count({
        where: { taskBoardId: data.taskBoardId },
    });

    const taskList = await prisma.taskList.create({
        data: {
            ...data,
            order,
        },
    });

    return NextResponse.json({ taskList });
}
