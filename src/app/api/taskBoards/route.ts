import prisma from "@/lib/prisma";
import {
    TaskBoardCreate,
    TaskBoardCreateSchema,
    TaskBoardModel,
} from "@/schema/taskBoard";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export type TaskBoardsGetResponse = { taskBoards: TaskBoardModel[] };
export type TaskBoardsPostBody = TaskBoardCreate;
export type TaskBoardsPostResponse = { taskBoard: TaskBoardModel };

export async function GET(request: NextRequest) {
    const { searchParams } = request.nextUrl;
    const ownerId = z.string().parse(searchParams.get("ownerId"));
    const taskBoards = await prisma.taskBoard.findMany({
        where: { ownerId },
    });

    return NextResponse.json({ taskBoards });
}

export async function POST(request: NextRequest) {
    const rawBody = await request.json();
    const data = TaskBoardCreateSchema.parse(rawBody);
    const taskBoard = await prisma.taskBoard.create({ data });

    return NextResponse.json({ taskBoard });
}
