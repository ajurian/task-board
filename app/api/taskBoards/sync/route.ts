import prisma from "@/_/lib/prisma";
import { NestedTaskBoardCreateSchema } from "@/_/schema/taskBoard";
import {
    badRequestErrorResponse,
    unauthorizedErrorResponse,
    unprocessableEntityErrorResponse,
} from "@/api/_/utils/errorResponse";
import getPayloadEmail from "@/api/_/utils/getPayloadEmail";
import { NextRequest, NextResponse } from "next/server";

export default async function POST(request: NextRequest) {
    let data;

    try {
        const rawBody = await request.json();
        data = NestedTaskBoardCreateSchema.parse(rawBody);
    } catch (e) {
        return unprocessableEntityErrorResponse({});
    }

    const payloadEmail = await getPayloadEmail();

    if (payloadEmail === null) {
        return unauthorizedErrorResponse({});
    }

    const user = await prisma.user.findUnique({
        where: { email: payloadEmail },
        select: { id: true },
    });

    if (user === null) {
        return badRequestErrorResponse({});
    }

    const batchCreate = [];

    batchCreate.push(
        prisma.taskBoard.create({
            data: {
                id: data.id,
                ownerId: data.ownerId,
                uniqueName: data.uniqueName,
                displayName: data.displayName,
                createdAt: data.createdAt,
            },
        })
    );

    batchCreate.push(
        prisma.taskList.createMany({
            data: data.taskLists,
        })
    );

    for (const taskList of data.taskLists) {
        batchCreate.push(
            prisma.task.createMany({
                data: taskList.tasks,
            })
        );
    }

    await prisma.$transaction(batchCreate);

    return NextResponse.json({});
}
