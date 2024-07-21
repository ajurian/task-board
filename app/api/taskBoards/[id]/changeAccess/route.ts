import {
    PERMISSION_ROLE_EDITOR,
    PERMISSION_ROLE_VIEWER,
    PERMISSION_ROLE_WORKER,
    PERMISSION_TASK_BOARD_USER_UPDATE_PERMISSION,
} from "@/_/common/constants/permissions";
import {
    TaskBoardChangeAccessBody,
    TaskBoardChangeAccessBodySchema,
} from "@/api/_/common/schema/taskBoards";
import { checkAuthorityWithDocument } from "@/api/_/utils/checkAuthority";
import {
    forbiddenErrorResponse,
    unprocessableEntityErrorResponse,
} from "@/api/_/utils/errorResponse";
import runTransaction from "@/api/_/utils/runTransaction";
import { NextRequest, NextResponse } from "next/server";

interface Segment {
    params: {
        id: string;
    };
}

export async function POST(request: NextRequest, { params }: Segment) {
    let data;

    try {
        const rawBody = await request.json();
        data = TaskBoardChangeAccessBodySchema.parse(rawBody);
    } catch (e) {
        return unprocessableEntityErrorResponse<TaskBoardChangeAccessBody>({});
    }

    const { id } = params;
    const authority = await checkAuthorityWithDocument({
        requiredPermission: PERMISSION_TASK_BOARD_USER_UPDATE_PERMISSION,
        documentType: "taskBoard",
        documentId: id,
    });

    if (!authority.success) {
        return authority.errorResponse<TaskBoardChangeAccessBody>({});
    }

    const { taskBoardUser } = authority;

    const canUserChangeRole =
        (taskBoardUser.permission &
            PERMISSION_TASK_BOARD_USER_UPDATE_PERMISSION) !==
        0;
    const isUserVisitor = taskBoardUser.isVisitor;

    if (!canUserChangeRole || isUserVisitor) {
        return forbiddenErrorResponse<TaskBoardChangeAccessBody>({});
    }

    const { editorEmails = [], workerEmails = [], viewerEmails = [] } = data;

    await runTransaction(async (prisma) => {
        const queries = [];

        if (editorEmails.length > 0) {
            queries.push(
                prisma.taskBoardUser.updateMany({
                    where: {
                        user: { email: { in: editorEmails } },
                    },
                    data: { permission: PERMISSION_ROLE_EDITOR },
                })
            );
        }

        if (workerEmails.length > 0) {
            queries.push(
                prisma.taskBoardUser.updateMany({
                    where: {
                        user: { email: { in: workerEmails } },
                    },
                    data: { permission: PERMISSION_ROLE_WORKER },
                })
            );
        }

        if (viewerEmails.length > 0) {
            queries.push(
                prisma.taskBoardUser.updateMany({
                    where: {
                        user: { email: { in: viewerEmails } },
                    },
                    data: { permission: PERMISSION_ROLE_VIEWER },
                })
            );
        }

        await Promise.all(queries);
    });

    return NextResponse.json({});
}
