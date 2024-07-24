import { PERMISSION_EMPTY } from "@/_/common/constants/permissions";
import prisma from "@/_/common/lib/prisma";
import {
    TaskBoardUserDeleteResponse,
    TaskBoardUserPatchBodySchema,
    TaskBoardUserPatchResponse,
} from "@/api/_/common/schema/taskBoardUsers";
import { checkAuthorityWithDocument } from "@/api/_/utils/checkAuthority";
import { unprocessableEntityErrorResponse } from "@/api/_/utils/errorResponse";
import { NextRequest, NextResponse } from "next/server";

interface Segment {
    params: {
        id: string;
    };
}

export async function PATCH(request: NextRequest, { params }: Segment) {
    let data;

    try {
        const rawBody = await request.json();
        data = TaskBoardUserPatchBodySchema.parse(rawBody);
    } catch (e) {
        return unprocessableEntityErrorResponse<TaskBoardUserPatchResponse>({
            taskBoardUser: null,
        });
    }

    const { id } = params;
    const authority = await checkAuthorityWithDocument({
        requiredPermission: PERMISSION_EMPTY,
        documentType: "taskBoardUser",
        documentId: id,
    });

    if (!authority.success) {
        return authority.errorResponse<TaskBoardUserPatchResponse>({
            taskBoardUser: null,
        });
    }

    const updatedTaskBoardUser = await prisma.taskBoardUser.update({
        where: { id },
        data,
    });

    return NextResponse.json({ taskBoardUser: updatedTaskBoardUser });
}

export async function DELETE(request: NextRequest, { params }: Segment) {
    const { id } = params;
    const authority = await checkAuthorityWithDocument({
        requiredPermission: PERMISSION_EMPTY,
        documentType: "taskBoardUser",
        documentId: id,
    });

    if (!authority.success) {
        return authority.errorResponse<TaskBoardUserDeleteResponse>({
            taskBoardUser: null,
        });
    }

    const deletedTaskBoardUser = await prisma.taskBoardUser.delete({
        where: { id },
    });

    return NextResponse.json({ taskBoardUser: deletedTaskBoardUser });
}
