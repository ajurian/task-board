import {
    PERMISSION_CONTENT_READ,
    PERMISSION_TASK_CREATE_DELETE,
    PERMISSION_TASK_UPDATE_DETAILS,
    PERMISSION_TASK_UPDATE_DUE_AT,
    PERMISSION_TASK_UPDATE_IS_DONE,
    PERMISSION_TASK_UPDATE_TITLE,
} from "@/_/common/constants/permissions";
import prisma from "@/_/common/lib/prisma";
import { TaskUpdateSchema } from "@/_/common/schema/task";
import {
    TaskDeleteResponse,
    TaskGetResponse,
    TaskPatchResponse,
} from "@/api/_/common/schema/tasks";
import { checkAuthorityWithDocument } from "@/api/_/utils/checkAuthority";
import { NextRequest, NextResponse } from "next/server";
import { unprocessableEntityErrorResponse } from "../../_/utils/errorResponse";

interface Segment {
    params: {
        id: string;
    };
}

export async function GET(request: NextRequest, { params }: Segment) {
    const { id } = params;
    const authority = await checkAuthorityWithDocument({
        requiredPermission: PERMISSION_CONTENT_READ,
        documentType: "task",
        documentId: id,
    });

    if (!authority.success) {
        return authority.errorResponse<TaskGetResponse>({ task: null });
    }

    const task = await prisma.task.findUnique({ where: { id } });

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

    console.log(data);
    const { title, details, isDone, dueAt } = data;
    let requiredPermission = 0;

    if (title !== undefined) requiredPermission |= PERMISSION_TASK_UPDATE_TITLE;
    if (details !== undefined)
        requiredPermission |= PERMISSION_TASK_UPDATE_DETAILS;
    if (isDone !== undefined)
        requiredPermission |= PERMISSION_TASK_UPDATE_IS_DONE;
    if (dueAt !== undefined)
        requiredPermission |= PERMISSION_TASK_UPDATE_DUE_AT;

    const authority = await checkAuthorityWithDocument({
        requiredPermission,
        documentType: "task",
        documentId: id,
    });

    if (!authority.success) {
        return authority.errorResponse<TaskPatchResponse>({ task: null });
    }

    const updatedTask = await prisma.task.update({
        where: { id },
        data,
    });

    return NextResponse.json({ task: updatedTask });
}

export async function DELETE(request: NextRequest, { params }: Segment) {
    const { id } = params;
    const authority = await checkAuthorityWithDocument({
        requiredPermission: PERMISSION_TASK_CREATE_DELETE,
        documentType: "task",
        documentId: id,
    });

    if (!authority.success) {
        return authority.errorResponse<TaskDeleteResponse>({ task: null });
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
