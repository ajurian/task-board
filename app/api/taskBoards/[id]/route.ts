import prisma from "@/_/lib/prisma";
import { TaskBoardUpdateSchema } from "@/_/schema/taskBoard";
import {
    TaskBoardDeleteResponse,
    TaskBoardGetResponse,
    TaskBoardPatchResponse,
} from "@/api/_/schema/taskBoards";
import { NextRequest, NextResponse } from "next/server";
import {
    badRequestErrorResponse,
    forbiddenErrorResponse,
    notFoundErrorResponse,
    unauthorizedErrorResponse,
    unprocessableEntityErrorResponse,
} from "../../_/utils/errorResponse";
import getPayloadEmail from "../../_/utils/getPayloadEmail";

interface Segment {
    params: {
        id: string;
    };
}

export async function GET(request: NextRequest, { params }: Segment) {
    const { id } = params;
    const { searchParams } = request.nextUrl;
    const searchQuery = searchParams.get("searchQuery");

    const payloadEmail = await getPayloadEmail();

    if (payloadEmail === null) {
        return unauthorizedErrorResponse<TaskBoardGetResponse>({
            taskBoard: null,
        });
    }

    const taskBoard = await prisma.taskBoard.findUnique({
        where: { id },
        select: { owner: { select: { email: true } } },
    });

    if (taskBoard === null) {
        return notFoundErrorResponse<TaskBoardGetResponse>({ taskBoard: null });
    }

    if (taskBoard.owner.email !== payloadEmail) {
        return forbiddenErrorResponse<TaskBoardGetResponse>({
            taskBoard: null,
        });
    }

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
    let data;

    try {
        const rawBody = await request.json();
        data = TaskBoardUpdateSchema.parse(rawBody);
    } catch (e) {
        return unprocessableEntityErrorResponse<TaskBoardPatchResponse>({
            taskBoard: null,
        });
    }

    const payloadEmail = await getPayloadEmail();

    if (payloadEmail === null) {
        return unauthorizedErrorResponse<TaskBoardPatchResponse>({
            taskBoard: null,
        });
    }

    const taskBoard = await prisma.taskBoard.findUnique({
        where: { id },
        select: { owner: { select: { email: true } } },
    });

    if (taskBoard === null) {
        return badRequestErrorResponse<TaskBoardPatchResponse>({
            taskBoard: null,
        });
    }

    if (taskBoard.owner.email !== payloadEmail) {
        return forbiddenErrorResponse<TaskBoardPatchResponse>({
            taskBoard: null,
        });
    }

    const updatedTaskBoard = await prisma.taskBoard.update({
        where: { id },
        data,
    });

    return NextResponse.json({ taskBoard: updatedTaskBoard });
}

export async function DELETE(request: NextRequest, { params }: Segment) {
    const { id } = params;
    const payloadEmail = await getPayloadEmail();

    if (payloadEmail === null) {
        return unauthorizedErrorResponse<TaskBoardDeleteResponse>({
            taskBoard: null,
        });
    }

    const taskBoard = await prisma.taskBoard.findUnique({
        where: { id },
        select: { owner: { select: { email: true } } },
    });

    if (taskBoard === null) {
        return badRequestErrorResponse<TaskBoardDeleteResponse>({
            taskBoard: null,
        });
    }

    if (taskBoard.owner.email !== payloadEmail) {
        return forbiddenErrorResponse<TaskBoardDeleteResponse>({
            taskBoard: null,
        });
    }

    await prisma.task.deleteMany({ where: { taskList: { taskBoardId: id } } });
    await prisma.taskList.deleteMany({ where: { taskBoardId: id } });

    const deletedTaskBoard = await prisma.taskBoard.delete({
        where: { id },
    });

    return NextResponse.json({ taskBoard: deletedTaskBoard });
}
