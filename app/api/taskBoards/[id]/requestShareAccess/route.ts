import {
    PERMISSION_CONTENT_READ,
    PERMISSION_ROLE_OWNER,
} from "@/_/common/constants/permissions";
import prisma from "@/_/common/lib/prisma";
import Mail from "@/_/common/services/Mail";
import getCurrentURL from "@/_/utils/getCurrentURL";
import { TaskBoardRequestShareAccessBodySchema } from "@/api/_/common/schema/taskBoards";
import { checkAuthorityWithDocument } from "@/api/_/utils/checkAuthority";
import {
    badRequestErrorResponse,
    unprocessableEntityErrorResponse,
} from "@/api/_/utils/errorResponse";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

interface Segment {
    params: {
        id: string;
    };
}

export async function POST(request: NextRequest, { params }: Segment) {
    let data;

    try {
        const rawBody = await request.json();
        data = TaskBoardRequestShareAccessBodySchema.parse(rawBody);
    } catch (e) {
        return unprocessableEntityErrorResponse({});
    }

    const { id } = params;
    const authority = await checkAuthorityWithDocument({
        requiredPermission: PERMISSION_CONTENT_READ,
        documentType: "taskBoard",
        documentId: id,
    });

    if (!authority.success) {
        return authority.errorResponse({});
    }

    const owner = await prisma.taskBoardUser.findFirst({
        where: {
            taskBoardId: id,
            permission: PERMISSION_ROLE_OWNER,
        },
        select: {
            user: { select: { googleId: true, email: true } },
            taskBoard: { select: { displayName: true } },
        },
    });

    if (owner === null) {
        return badRequestErrorResponse({});
    }

    const { user } = authority;
    const { userEmails } = data;

    const validUserEmails = userEmails.filter((userEmail) => {
        const { success } = z.string().email().safeParse(userEmail);
        return success;
    });

    const redirectUri = `${getCurrentURL()}/board/${id}?share=${validUserEmails.join(
        ","
    )}`;
    const link = new URL(`${getCurrentURL()}/auth/login`);

    link.searchParams.set("redirectUri", redirectUri);
    link.searchParams.set("hint", owner.user.email);

    await Mail.sendMail({
        from: `${user.displayName} <${process.env.GMAIL_SERVICE_ACCOUNT!}>`,
        to: owner.user.email,
        subject: `Share access request for board '${owner.taskBoard.displayName}'`,
        html: `<p>${user.displayName} ${user.email} wants you to share access.</p><br /><a href='${link}'>Grant access</a>`,
    });

    return NextResponse.json({});
}
