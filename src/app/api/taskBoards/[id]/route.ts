import prisma from "@/lib/prisma";
import {
    TaskBoardModel,
    TaskBoardUpdate,
    TaskBoardUpdateSchema,
} from "@/schema/taskBoard";
import { NextRequest, NextResponse } from "next/server";

interface Segment {
    params: {
        id: string;
    };
}

export type TaskBoardGetResponse = TaskBoardModel | null;
export type TaskBoardPatchBody = TaskBoardUpdate;
export type TaskBoardPatchResponse = TaskBoardModel;
export type TaskBoardDeleteResponse = TaskBoardModel;

export async function GET(request: NextRequest, { params }: Segment) {
    const { id } = params;
    const taskBoard = await prisma.taskBoard.findUnique({
        where: { id },
    });

    return NextResponse.json(taskBoard);
}

export async function PATCH(request: NextRequest, { params }: Segment) {
    const { id } = params;
    const rawBody = await request.json();
    const data = TaskBoardUpdateSchema.parse(rawBody);

    const taskBoard = await prisma.taskBoard.update({
        where: { id },
        data,
    });

    return NextResponse.json(taskBoard);
}

export async function DELETE(request: NextRequest, { params }: Segment) {
    const { id } = params;
    const taskBoard = await prisma.taskBoard.delete({
        where: { id },
    });

    return NextResponse.json(taskBoard);
}
