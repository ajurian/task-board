import {
    PERMISSION_TASK_BOARD_USER_UPDATE_PERMISSION,
    ROLE_TO_PERMISSION,
} from "@/_/common/constants/permissions";
import Mail from "@/_/common/services/Mail";
import getCurrentURL from "@/_/utils/getCurrentURL";
import {
    TaskBoardShareAccessBodySchema,
    TaskBoardShareAccessResponse,
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
        data = TaskBoardShareAccessBodySchema.parse(rawBody);
    } catch (e) {
        return unprocessableEntityErrorResponse<TaskBoardShareAccessResponse>(
            {}
        );
    }

    const { id } = params;
    const authority = await checkAuthorityWithDocument({
        requiredPermission: PERMISSION_TASK_BOARD_USER_UPDATE_PERMISSION,
        documentType: "taskBoard",
        documentId: id,
    });

    if (!authority.success) {
        return authority.errorResponse<TaskBoardShareAccessResponse>({});
    }

    const { user, taskBoardUser } = authority;

    const canUserChangeRole =
        (taskBoardUser.permission &
            PERMISSION_TASK_BOARD_USER_UPDATE_PERMISSION) !==
        0;
    const isUserVisitor = taskBoardUser.isVisitor;

    if (!canUserChangeRole || isUserVisitor) {
        return forbiddenErrorResponse<TaskBoardShareAccessResponse>({});
    }

    const { userEmails, role } = data;

    await runTransaction(async (prisma) => {
        const queries = [];

        for (const userEmail of userEmails) {
            const userWithRespectToEmail = await prisma.user.findUnique({
                where: { email: userEmail },
                select: { googleId: true },
            });

            if (userWithRespectToEmail === null) {
                continue;
            }

            queries.push(
                prisma.taskBoardUser.upsert({
                    where: {
                        index: {
                            userGoogleId: userWithRespectToEmail.googleId,
                            taskBoardId: id,
                        },
                    },
                    create: {
                        userGoogleId: userWithRespectToEmail.googleId,
                        taskBoardId: id,
                        permission: ROLE_TO_PERMISSION[role],
                        isVisitor: false,
                    },
                    update: {
                        permission: ROLE_TO_PERMISSION[role],
                        isVisitor: false,
                    },
                })
            );
        }

        await Promise.all(queries);
    });

    const baseUrl = `${getCurrentURL()}/auth/login`;
    const redirectUri = encodeURIComponent(`${getCurrentURL()}/board/${id}`);

    await Mail.sendMail({
        from: `${user.displayName} <${process.env.GMAIL_SERVICE_ACCOUNT!}>`,
        to: userEmails.join(", "),
        subject: `${user.displayName} shared a board with you`,
        html: `<p>${user.displayName} ${user.email} shared a board with you.</p><br /><a href='${baseUrl}?hint={{ contact.EMAIL }}&redirectUri=${redirectUri}'>Open board</a>`,
    });

    return NextResponse.json({});
}
