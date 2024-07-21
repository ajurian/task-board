import {
    PERMISSION_ROLE_NONE,
    PERMISSION_ROLE_OWNER,
} from "@/_/common/constants/permissions";
import prisma from "@/_/common/lib/prisma";
import Mail from "@/_/common/services/Mail";
import getCurrentURL from "@/_/utils/getCurrentURL";
import { checkAuthorityWithDocument } from "@/api/_/utils/checkAuthority";
import { badRequestErrorResponse } from "@/api/_/utils/errorResponse";
import { NextRequest, NextResponse } from "next/server";

interface Segment {
    params: {
        id: string;
    };
}

export async function POST(request: NextRequest, { params }: Segment) {
    const { id } = params;
    const authority = await checkAuthorityWithDocument({
        requiredPermission: PERMISSION_ROLE_NONE,
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
    const redirectUri = `${getCurrentURL()}/board/${id}?share=${user.email}`;
    const link = new URL(`${getCurrentURL()}/auth/login`);

    link.searchParams.set("redirectUri", redirectUri);
    link.searchParams.set("hint", owner.user.email);

    await Mail.sendMail({
        from: `${user.displayName} <${process.env.GMAIL_SERVICE_ACCOUNT}>`,
        to: owner.user.email,
        subject: `Access request for board '${owner.taskBoard.displayName}'`,
        html: `<p>${user.displayName} ${user.email} wants to have access.</p><br /><a href='${link}'>Grant access</a>`,
    });

    return NextResponse.json({});
}
