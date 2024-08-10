import prisma from "@/_/common/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

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
        imageData = await sharp({
            create: {
                width: 512,
                height: 512,
                channels: 3,
                background: "#fafafa",
            },
        })
            .toFormat("jpeg")
            .raw()
            .toBuffer();
    }

    return new NextResponse(imageData, {
        headers: {
            "Content-Type": "image/jpeg",
        },
    });
}
