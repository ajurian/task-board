import prisma from "@/lib/prisma";
import { TaskModelSchema } from "@/schema/task";
import {
    AggregatedTaskBoardModel,
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

export type TaskBoardGetResponse = {
    taskBoard: AggregatedTaskBoardModel | null;
};
export type TaskBoardPatchBody = TaskBoardUpdate;
export type TaskBoardPatchResponse = { taskBoard: TaskBoardModel };
export type TaskBoardDeleteResponse = { taskBoard: TaskBoardModel };

export async function GET(request: NextRequest, { params }: Segment) {
    const { id } = params;
    const { searchParams } = request.nextUrl;
    const searchQuery = searchParams.get("searchQuery");

    const tasksPipeline = [];
    const shouldFilterBySearchQuery =
        searchQuery !== null && searchQuery.length > 0;

    const sortByField = shouldFilterBySearchQuery
        ? { score: -1, order: 1 }
        : { order: 1 };

    if (shouldFilterBySearchQuery) {
        tasksPipeline.push({
            $search: {
                index: "tasks-search",
                text: {
                    query: searchQuery,
                    path: ["title", "details"],
                },
                highlight: {
                    path: ["title", "details"],
                },
            },
        });
    }

    tasksPipeline.push(
        {
            $addFields: {
                id: { $toString: "$_id" },
                taskListId: {
                    $toString: "$taskListId",
                },
                createdAt: {
                    $toString: "$createdAt",
                },
                dueAt: { $toString: "$dueAt" },
                score: { $ifNull: [{ $meta: "searchScore" }, 0] },
                highlights: { $ifNull: [{ $meta: "searchHighlights" }, []] },
            },
        },
        { $sort: sortByField },
        { $unset: "_id" }
    );

    const taskBoards = await prisma.taskBoard.aggregateRaw({
        pipeline: [
            {
                $match: {
                    _id: { $oid: id },
                },
            },
            {
                $lookup: {
                    from: "taskLists",
                    localField: "_id",
                    foreignField: "taskBoardId",
                    as: "taskLists",
                    pipeline: [
                        {
                            $lookup: {
                                from: "tasks",
                                localField: "_id",
                                foreignField: "taskListId",
                                as: "tasks",
                                pipeline: tasksPipeline,
                            },
                        },
                        {
                            $addFields: {
                                id: { $toString: "$_id" },
                                taskBoardId: { $toString: "$taskBoardId" },
                                createdAt: { $toString: "$createdAt" },
                                score: { $sum: "$tasks.score" },
                                highlights: {
                                    $ifNull: [
                                        { $meta: "searchHighlights" },
                                        [],
                                    ],
                                },
                            },
                        },
                        { $sort: sortByField },
                        { $unset: ["_id", "score", "tasks.score"] },
                    ],
                },
            },
            {
                $addFields: {
                    id: { $toString: "$_id" },
                    ownerId: { $toString: "$ownerId" },
                    createdAt: { $toString: "$createdAt" },
                },
            },
            { $unset: "_id" },
        ],
    });

    return NextResponse.json({ taskBoard: taskBoards[0] });
}

export async function PATCH(request: NextRequest, { params }: Segment) {
    const { id } = params;
    const rawBody = await request.json();
    const data = TaskBoardUpdateSchema.parse(rawBody);

    const taskBoard = await prisma.taskBoard.update({
        where: { id },
        data,
    });

    return NextResponse.json({ taskBoard });
}

export async function DELETE(request: NextRequest, { params }: Segment) {
    const { id } = params;

    await prisma.taskList.deleteMany({ where: { taskBoardId: id } });

    const taskBoard = await prisma.taskBoard.delete({
        where: { id },
    });

    return NextResponse.json({ taskBoard });
}
