import prisma from "@/_/lib/prisma";
import { TaskBoardCreateSchema } from "@/_/schema/taskBoard";
import { NextRequest, NextResponse } from "next/server";
import {
    TaskBoardsGetResponse,
    TaskBoardsPostResponse,
} from "../_/schema/taskBoards";
import {
    badRequestErrorResponse,
    forbiddenErrorResponse,
    unauthorizedErrorResponse,
    unprocessableEntityErrorResponse,
} from "../_/utils/errorResponse";
import getPayloadEmail from "../_/utils/getPayloadEmail";

export async function GET(request: NextRequest) {
    const payloadEmail = await getPayloadEmail();

    if (payloadEmail === null) {
        return unauthorizedErrorResponse<TaskBoardsGetResponse>({
            taskBoards: [],
        });
    }

    const taskBoards = await prisma.taskBoard.findMany({
        where: { owner: { email: payloadEmail } },
    });

    return NextResponse.json<TaskBoardsGetResponse>({ taskBoards });
}

export async function POST(request: NextRequest) {
    let data;

    try {
        const rawBody = await request.json();
        data = TaskBoardCreateSchema.parse(rawBody);
    } catch (e) {
        return unprocessableEntityErrorResponse<TaskBoardsPostResponse>({
            taskBoard: null,
        });
    }

    const payloadEmail = await getPayloadEmail();

    if (payloadEmail === null) {
        return unauthorizedErrorResponse<TaskBoardsPostResponse>({
            taskBoard: null,
        });
    }

    const user = await prisma.user.findUnique({
        where: { email: payloadEmail },
        select: { id: true },
    });

    if (user === null) {
        return badRequestErrorResponse<TaskBoardsPostResponse>({
            taskBoard: null,
        });
    }

    const taskBoard = await prisma.taskBoard.create({
        data: {
            ...data,
            ownerId: user.id,
        },
    });

    return NextResponse.json({ taskBoard });
}
