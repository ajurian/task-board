import {
    PERMISSION_CONTENT_READ,
    PERMISSION_TASK_LIST_CREATE_DELETE,
    PERMISSION_TASK_LIST_UPDATE_TITLE,
} from "@/_/common/constants/permissions";
import prisma from "@/_/common/lib/prisma";
import { TaskListUpdateSchema } from "@/_/common/schema/taskList";
import {
    TaskListDeleteResponse,
    TaskListGetResponse,
    TaskListPatchResponse,
} from "@/api/_/common/schema/taskLists";
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
        documentType: "taskList",
        documentId: id,
    });

    if (!authority.success) {
        return authority.errorResponse<TaskListGetResponse>({ taskList: null });
    }

    const taskList = await prisma.taskList.findUnique({ where: { id } });

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

    const authority = await checkAuthorityWithDocument({
        requiredPermission: PERMISSION_TASK_LIST_UPDATE_TITLE,
        documentType: "taskList",
        documentId: id,
    });

    if (!authority.success) {
        return authority.errorResponse<TaskListPatchResponse>({
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
    const authority = await checkAuthorityWithDocument({
        requiredPermission: PERMISSION_TASK_LIST_CREATE_DELETE,
        documentType: "taskList",
        documentId: id,
    });

    if (!authority.success) {
        return authority.errorResponse<TaskListDeleteResponse>({
            taskList: null,
        });
    }

    const deletedTaskList = await prisma.$transaction(async (prisma) => {
        await prisma.task.deleteMany({ where: { taskListId: id } });
        const deletedTaskList = await prisma.taskList.delete({ where: { id } });

        await prisma.taskList.updateMany({
            where: {
                taskBoardId: deletedTaskList.taskBoardId,
                order: { gt: deletedTaskList.order },
            },
            data: { order: { decrement: 1 } },
        });

        return deletedTaskList;
    });

    return NextResponse.json({ taskList: deletedTaskList });
}
