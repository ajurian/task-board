import prisma from "@/_/common/lib/prisma";
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
    const taskBoard = await prisma.taskBoard.findUnique({
        where: { id },
    });

    if (taskBoard === null) {
        return notFoundErrorResponse({});
    }

    return new NextResponse(taskBoard.thumbnailData, {
        headers: {
            "Content-Type": "image/jpeg",
        },
    });
}
