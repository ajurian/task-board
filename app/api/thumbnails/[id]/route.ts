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
    let imageData = thumbnailData;

    if (imageData === null) {
        imageData = Buffer.alloc(512 * 512 * 3);

        for (let i = 0; i < imageData.length; i += 3) {
            imageData[i] = 0xfa;
            imageData[i + 1] = 0xfa;
            imageData[i + 2] = 0xfa;
        }
    }

    return new NextResponse(imageData, {
        headers: {
            "Content-Type": "image/jpeg",
        },
    });
}
