import prisma from "@/_/lib/prisma";
import { TaskListUpdateSchema } from "@/_/schema/taskList";
import {
    TaskListDeleteResponse,
    TaskListGetResponse,
    TaskListPatchResponse,
} from "@/api/_/schema/taskLists";
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
        return unauthorizedErrorResponse<TaskListGetResponse>({
            taskList: null,
        });
    }

    const taskList = await prisma.taskList.findUnique({
        where: { id },
        select: {
            taskBoard: { select: { owner: { select: { email: true } } } },
        },
    });

    if (taskList === null) {
        return notFoundErrorResponse<TaskListGetResponse>({ taskList: null });
    }

    if (taskList.taskBoard.owner.email !== payloadEmail) {
        return forbiddenErrorResponse<TaskListGetResponse>({ taskList: null });
    }

    return NextResponse.json({ taskList });
}

export async function PATCH(request: NextRequest, { params }: Segment) {
    const { id } = params;
    let data;

    try {
        const rawBody = await request.json();
        data = TaskListUpdateSchema.parse(rawBody);
    } catch (e) {
        return unprocessableEntityErrorResponse<TaskListPatchResponse>({
            taskList: null,
        });
    }

    const payloadEmail = await getPayloadEmail();

    if (payloadEmail === null) {
        return unauthorizedErrorResponse<TaskListPatchResponse>({
            taskList: null,
        });
    }

    const taskList = await prisma.taskList.findUnique({
        where: { id },
        select: {
            taskBoard: { select: { owner: { select: { email: true } } } },
        },
    });

    if (taskList === null) {
        return badRequestErrorResponse<TaskListPatchResponse>({
            taskList: null,
        });
    }

    if (taskList.taskBoard.owner.email !== payloadEmail) {
        return forbiddenErrorResponse<TaskListPatchResponse>({
            taskList: null,
        });
    }

    const updatedTaskList = await prisma.taskList.update({
        where: { id },
        data,
    });

    return NextResponse.json({ taskList: updatedTaskList });
}

export async function DELETE(request: NextRequest, { params }: Segment) {
    const { id } = params;
    const payloadEmail = await getPayloadEmail();

    if (payloadEmail === null) {
        return unauthorizedErrorResponse<TaskListDeleteResponse>({
            taskList: null,
        });
    }

    const taskList = await prisma.taskList.findUnique({
        where: { id },
        select: {
            taskBoard: { select: { owner: { select: { email: true } } } },
        },
    });

    if (taskList === null) {
        return badRequestErrorResponse<TaskListDeleteResponse>({
            taskList: null,
        });
    }

    if (taskList.taskBoard.owner.email !== payloadEmail) {
        return forbiddenErrorResponse<TaskListDeleteResponse>({
            taskList: null,
        });
    }

    await prisma.task.deleteMany({ where: { taskListId: id } });

    const deletedTaskList = await prisma.taskList.delete({ where: { id } });

    await prisma.taskList.updateMany({
        where: {
            taskBoardId: deletedTaskList.taskBoardId,
            order: { gt: deletedTaskList.order },
        },
        data: { order: { decrement: 1 } },
    });

    return NextResponse.json({ taskList: deletedTaskList });
}
