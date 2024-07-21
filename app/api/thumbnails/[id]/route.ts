import { PERMISSION_CONTENT_READ } from "@/_/common/constants/permissions";
import prisma from "@/_/common/lib/prisma";
import {
    checkAuthority,
    checkAuthorityWithDocument,
} from "@/api/_/utils/checkAuthority";
import { notFoundErrorResponse } from "@/api/_/utils/errorResponse";
import { NextRequest, NextResponse } from "next/server";

interface Segment {
    params: {
        id: string;
    };
}

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest, { params }: Segment) {
    const { id } = params;
    const authority = await checkAuthorityWithDocument({
        requiredPermission: PERMISSION_CONTENT_READ,
        documentType: "taskBoard",
        documentId: id,
    });

    if (!authority.success) {
        return authority.errorResponse({});
    }

    const taskBoard = await prisma.taskBoard.findUniqueOrThrow({
        where: { id },
    });

    return new NextResponse(taskBoard.thumbnailData, {
        headers: {
            "Content-Type": "image/jpeg",
        },
    });
}
