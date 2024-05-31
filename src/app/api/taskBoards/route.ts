import prisma from "@/lib/prisma";
import {
    TaskBoardCreate,
    TaskBoardCreateSchema,
    TaskBoardModel,
} from "@/schema/taskBoard";
import { NextRequest, NextResponse } from "next/server";

export type TaskBoardsGetResponse = TaskBoardModel[];
export type TaskBoardsPostBody = TaskBoardCreate;
export type TaskBoardsPostResponse = TaskBoardModel;

export async function GET(request: NextRequest) {
    const taskBoards = await prisma.taskBoard.findMany();
    return NextResponse.json(taskBoards);
}

export async function POST(request: NextRequest) {
    const rawBody = await request.json();
    const data = TaskBoardCreateSchema.parse(rawBody);
    const taskBoard = await prisma.taskBoard.create({ data });

    return NextResponse.json(taskBoard);
}
