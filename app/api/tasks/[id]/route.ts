import prisma from "@/_/lib/prisma";
import { TaskUpdateSchema } from "@/_/schema/task";
import {
    TaskDeleteResponse,
    TaskGetResponse,
    TaskPatchResponse,
} from "@/api/_/schema/tasks";
import { NextRequest, NextResponse } from "next/server";
import {
    badRequestErrorResponse,
    forbiddenErrorResponse,
    notFoundErrorResponse,
    unauthorizedErrorResponse,
    unprocessableEntityErrorResponse,
} from "../../_/utils/errorResponse";
import getPayloadEmail from "../../_/utils/getPayloadEmail";

interface Segment {
    params: {
        id: string;
    };
}

export async function GET(request: NextRequest, { params }: Segment) {
    const { id } = params;
    const payloadEmail = await getPayloadEmail();

    if (payloadEmail === null) {
        return unauthorizedErrorResponse<TaskGetResponse>({ task: null });
    }

    const task = await prisma.task.findUnique({
        where: { id },
        select: {
            taskList: {
                select: {
                    taskBoard: {
                        select: { owner: { select: { email: true } } },
                    },
                },
            },
        },
    });

    if (task === null) {
        return notFoundErrorResponse<TaskGetResponse>({ task: null });
    }

    if (task.taskList.taskBoard.owner.email !== payloadEmail) {
        return forbiddenErrorResponse<TaskGetResponse>({ task: null });
    }

    return NextResponse.json({ task });
}

export async function PATCH(request: NextRequest, { params }: Segment) {
    const { id } = params;
    let data;

    try {
        const rawBody = await request.json();
        data = TaskUpdateSchema.parse(rawBody);
    } catch (e) {
        return unprocessableEntityErrorResponse<TaskPatchResponse>({
            task: null,
        });
    }

    const payloadEmail = await getPayloadEmail();

    if (payloadEmail === null) {
        return unauthorizedErrorResponse<TaskGetResponse>({ task: null });
    }

    const task = await prisma.task.findUnique({
        where: { id },
        select: {
            taskList: {
                select: {
                    taskBoard: {
                        select: { owner: { select: { email: true } } },
                    },
                },
            },
        },
    });

    if (task === null) {
        return badRequestErrorResponse<TaskPatchResponse>({
            task: null,
        });
    }

    if (task.taskList.taskBoard.owner.email !== payloadEmail) {
        return forbiddenErrorResponse<TaskPatchResponse>({
            task: null,
        });
    }

    const updatedTask = await prisma.task.update({
        where: { id },
        data,
    });

    return NextResponse.json({ task: updatedTask });
}

export async function DELETE(request: NextRequest, { params }: Segment) {
    const { id } = params;
    const payloadEmail = await getPayloadEmail();

    if (payloadEmail === null) {
        return unauthorizedErrorResponse<TaskDeleteResponse>({ task: null });
    }

    const task = await prisma.task.findUnique({
        where: { id },
        select: {
            taskList: {
                select: {
                    taskBoard: {
                        select: { owner: { select: { email: true } } },
                    },
                },
            },
        },
    });

    if (task === null) {
        return badRequestErrorResponse<TaskDeleteResponse>({
            task: null,
        });
    }

    if (task.taskList.taskBoard.owner.email !== payloadEmail) {
        return forbiddenErrorResponse<TaskDeleteResponse>({
            task: null,
        });
    }

    const deletedTask = await prisma.task.delete({ where: { id } });

    await prisma.task.updateMany({
        where: {
            taskListId: deletedTask.taskListId,
            order: { gt: deletedTask.order },
        },
        data: { order: { decrement: 1 } },
    });

    return NextResponse.json({ task: deletedTask });
}
