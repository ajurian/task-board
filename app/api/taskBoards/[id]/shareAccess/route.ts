import {
    PERMISSION_TASK_BOARD_USER_UPDATE_PERMISSION,
    ROLE_TO_PERMISSION,
} from "@/_/common/constants/permissions";
import prisma from "@/_/common/lib/prisma";
import Mail from "@/_/common/services/Mail";
import {
    TaskBoardShareAccessBodySchema,
    TaskBoardShareAccessResponse,
} from "@/api/_/common/schema/taskBoards";
import { checkAuthorityWithDocument } from "@/api/_/utils/checkAuthority";
import { unprocessableEntityErrorResponse } from "@/api/_/utils/errorResponse";
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
        documentType: "taskBoard",
        documentId: id,
        requiredPermission: PERMISSION_TASK_BOARD_USER_UPDATE_PERMISSION,
    });

    if (!authority.success) {
        return authority.errorResponse<TaskBoardShareAccessResponse>({});
    }

    const { userEmails, role } = data;

    await prisma.$transaction(async (prisma) => {
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

    const { user: owner } = authority;
    const baseUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/login`;
    const redirectUri = encodeURIComponent(
        `${process.env.NEXT_PUBLIC_SITE_URL}/board/${id}`
    );

    await Mail.sendMail({
        from: `${owner.displayName} <noreply.taskboard@gmail.com>`,
        to: userEmails.join(", "),
        subject: `${owner.displayName} shared a board with you`,
        html: `<p>${owner.displayName} ${owner.email} shared a board with you.</p><br /><a href='${baseUrl}?hint={{ contact.EMAIL }}&redirectUri=${redirectUri}'>Open board</a>`,
    });

    return NextResponse.json({});
}
