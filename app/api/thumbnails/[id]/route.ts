import prisma from "@/_/common/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

interface Segment {
    params: {
        id: string;
    };
}

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest, { params }: Segment) {
    const { id } = params;
    const { thumbnailData } = await prisma.taskBoard.findUniqueOrThrow({
        where: { id },
    });

    return new NextResponse(new Uint8Array(thumbnailData), {
        headers: {
            "Content-Type": "image/jpeg",
        },
    });
}
