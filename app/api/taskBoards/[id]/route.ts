import {
    PERMISSION_CONTENT_READ,
    PERMISSION_ROLE_NONE,
    PERMISSION_TASK_BOARD_DELETE,
    PERMISSION_TASK_BOARD_UPDATE_DEFAULT_PERMISSION,
    PERMISSION_TASK_BOARD_UPDATE_DISPLAY_NAME,
    PERMISSION_TASK_BOARD_UPDATE_FLOW_DIRECTION,
    PERMISSION_TASK_BOARD_UPDATE_THUMBNAIL,
} from "@/_/common/constants/permissions";
import prisma from "@/_/common/lib/prisma";
import { TaskBoardUpdateSchema } from "@/_/common/schema/taskBoard";
import {
    TaskBoardDeleteResponse,
    TaskBoardGetResponse,
    TaskBoardPatchResponse,
} from "@/api/_/common/schema/taskBoards";
import { checkAuthorityWithDocument } from "@/api/_/utils/checkAuthority";
import runTransaction from "@/api/_/utils/runTransaction";
import { EJSON } from "bson";
import { NextRequest, NextResponse } from "next/server";
import { unprocessableEntityErrorResponse } from "../../_/utils/errorResponse";

interface Segment {
    params: {
        id: string;
    };
}

export async function GET(request: NextRequest, { params }: Segment) {
    const { searchParams } = request.nextUrl;
    const searchQuery = searchParams.get("searchQuery");

    const { id } = params;
    const authority = await checkAuthorityWithDocument({
        requiredPermission: PERMISSION_CONTENT_READ,
        documentType: "taskBoard",
        documentId: id,
    });

    if (!authority.success) {
        return authority.errorResponse<TaskBoardGetResponse>({
            taskBoard: null,
        });
    }

    const tasksPipeline = [];
    const shouldFilterBySearchQuery =
        searchQuery !== null && searchQuery.length > 0;

    if (shouldFilterBySearchQuery) {
        tasksPipeline.push({
            $search: {
                index: "tasks-search",
                text: {
                    query: searchQuery,
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
                score: { $ifNull: [{ $meta: "searchScore" }, 0] },
                fakeDueAt: {
                    $cond: [
                        { $eq: ["$dueAt", null] },
                        EJSON.serialize(new Date(8640000000000000)),
                        "$dueAt",
                    ],
                },
            },
        },
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
                    let: { sortBy: "$sortBy" },
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
                                tasks: {
                                    $cond: [
                                        { $eq: ["$sortBy", "dueAt"] },
                                        {
                                            $sortArray: {
                                                input: "$tasks",
                                                sortBy: shouldFilterBySearchQuery
                                                    ? {
                                                          score: -1,
                                                          fakeDueAt: 1,
                                                      }
                                                    : { fakeDueAt: 1 },
                                            },
                                        },
                                        {
                                            $sortArray: {
                                                input: "$tasks",
                                                sortBy: shouldFilterBySearchQuery
                                                    ? { score: -1, order: 1 }
                                                    : { order: 1 },
                                            },
                                        },
                                    ],
                                },
                            },
                        },
                        {
                            $addFields: {
                                tasks: {
                                    $map: {
                                        input: "$tasks",
                                        as: "task",
                                        in: {
                                            $mergeObjects: [
                                                "$$task",
                                                {
                                                    dueAt: {
                                                        $toString:
                                                            "$$task.dueAt",
                                                    },
                                                },
                                            ],
                                        },
                                    },
                                },
                            },
                        },
                        {
                            $sort: shouldFilterBySearchQuery
                                ? { score: -1, order: 1 }
                                : { order: 1 },
                        },
                        {
                            $unset: [
                                "_id",
                                "score",
                                "tasks.score",
                                "tasks.fakeDueAt",
                            ],
                        },
                    ],
                },
            },
            {
                $lookup: {
                    from: "taskBoardUsers",
                    localField: "_id",
                    foreignField: "taskBoardId",
                    as: "users",
                    pipeline: [
                        {
                            $lookup: {
                                from: "users",
                                localField: "userGoogleId",
                                foreignField: "googleId",
                                as: "user",
                                pipeline: [
                                    {
                                        $addFields: {
                                            id: { $toString: "$_id" },
                                            createdAt: {
                                                $toString: "$createdAt",
                                            },
                                        },
                                    },
                                    { $unset: "_id" },
                                ],
                            },
                        },
                        { $sort: { joinedAt: 1 } },
                        {
                            $addFields: {
                                id: { $toString: "$_id" },
                                taskBoardId: { $toString: "$taskBoardId" },
                                joinedAt: { $toString: "$joinedAt" },
                                recentlyAccessedAt: {
                                    $toString: "$recentlyAccessedAt",
                                },
                                user: { $first: "$user" },
                            },
                        },
                        { $unset: "_id" },
                    ],
                },
            },
            {
                $addFields: {
                    id: { $toString: "$_id" },
                    createdAt: { $toString: "$createdAt" },
                },
            },
            { $unset: ["_id"] },
        ],
    });

    return NextResponse.json({ taskBoard: taskBoards[0] });
}

export async function PATCH(request: NextRequest, { params }: Segment) {
    let data;

    try {
        const rawBody = await request.json();
        data = TaskBoardUpdateSchema.parse(rawBody);
    } catch (e) {
        return unprocessableEntityErrorResponse<TaskBoardPatchResponse>({
            taskBoard: null,
        });
    }

    const { displayName, flowDirection, defaultPermission, thumbnailData } =
        data;
    let requiredPermission = 0;

    if (displayName !== undefined)
        requiredPermission |= PERMISSION_TASK_BOARD_UPDATE_DISPLAY_NAME;
    if (flowDirection !== undefined)
        requiredPermission |= PERMISSION_TASK_BOARD_UPDATE_FLOW_DIRECTION;
    if (defaultPermission !== undefined)
        requiredPermission |= PERMISSION_TASK_BOARD_UPDATE_DEFAULT_PERMISSION;
    if (thumbnailData !== undefined)
        requiredPermission |= PERMISSION_TASK_BOARD_UPDATE_THUMBNAIL;

    const { id } = params;
    const authority = await checkAuthorityWithDocument({
        requiredPermission,
        documentType: "taskBoard",
        documentId: id,
    });

    if (!authority.success) {
        return authority.errorResponse<TaskBoardPatchResponse>({
            taskBoard: null,
        });
    }

    const updatedTaskBoard = await runTransaction(async (prisma) => {
        if (defaultPermission === PERMISSION_ROLE_NONE) {
            await prisma.taskBoardUser.deleteMany({
                where: { isVisitor: true },
            });
        } else {
            await prisma.taskBoardUser.updateMany({
                where: { isVisitor: true },
                data: { permission: defaultPermission },
            });
        }

        return prisma.taskBoard.update({
            where: { id },
            data,
            select: {
                id: true,
                displayName: true,
                flowDirection: true,
                defaultPermission: true,
                createdAt: true,
                maxTaskLists: true,
                maxTasks: true,
            },
        });
    });

    return NextResponse.json({ taskBoard: updatedTaskBoard });
}

export async function DELETE(request: NextRequest, { params }: Segment) {
    const { id } = params;
    const authority = await checkAuthorityWithDocument({
        requiredPermission: PERMISSION_TASK_BOARD_DELETE,
        documentType: "taskBoard",
        documentId: id,
    });

    if (!authority.success) {
        return authority.errorResponse<TaskBoardDeleteResponse>({
            taskBoard: null,
        });
    }

    const deletedTaskBoard = await runTransaction(async (prisma) => {
        await prisma.task.deleteMany({
            where: { taskList: { taskBoardId: id } },
        });
        await prisma.taskList.deleteMany({ where: { taskBoardId: id } });
        await prisma.taskBoardUser.deleteMany({ where: { taskBoardId: id } });

        return prisma.taskBoard.delete({
            where: { id },
            select: {
                id: true,
                displayName: true,
                flowDirection: true,
                defaultPermission: true,
                createdAt: true,
                maxTaskLists: true,
                maxTasks: true,
            },
        });
    });

    return NextResponse.json({ taskBoard: deletedTaskBoard });
}
