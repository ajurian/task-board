import "server-only";

import { PERMISSION_ROLE_NONE } from "@/_/common/constants/permissions";
import prisma from "@/_/common/lib/prisma";
import { TaskBoardModel } from "@/_/common/schema/taskBoard";
import { TaskBoardUserModel } from "@/_/common/schema/taskBoardUser";
import { UserModel } from "@/_/common/schema/user";
import { ObjectId } from "bson";
import { NextResponse } from "next/server";
import checkUserAccess from "./checkUserAccess";
import {
    badRequestErrorResponse,
    forbiddenErrorResponse,
    notFoundErrorResponse,
    unauthorizedErrorResponse,
    unprocessableEntityErrorResponse,
} from "./errorResponse";
import runTransaction from "./runTransaction";
import verifyToken from "./verifyToken";

type DocumentType = "taskBoardUser" | "taskBoard" | "taskList" | "task";

type TaskBoardUserDocument = Pick<
    TaskBoardUserModel,
    "userGoogleId" | "permission" | "isVisitor"
>;

type TaskBoardDocument = Pick<TaskBoardModel, "id" | "defaultPermission"> & {
    users: Pick<TaskBoardUserModel, "userGoogleId">[];
};

type TaskListDocument = { taskBoard: TaskBoardDocument };

type TaskDocument = { taskList: TaskListDocument };

type Document = {
    taskBoardUser: TaskBoardUserDocument;
    taskBoard: TaskBoardDocument;
    taskList: TaskListDocument;
    task: TaskDocument;
};

type CheckAuthorityWithDocumentOptions<T extends DocumentType> = {
    requiredPermission: number;
    documentType: T;
    documentId: string;
};

type Authority =
    | { success: false; errorResponse: <D>(data: D) => NextResponse<D> }
    | {
          success: true;
          user: Pick<UserModel, "googleId" | "email" | "displayName">;
      };

type AuthorityWithDocument<T extends DocumentType> =
    | { success: false; errorResponse: <D>(data: D) => NextResponse<D> }
    | {
          success: true;
          user: Pick<UserModel, "googleId" | "email" | "displayName">;
          taskBoardUser: TaskBoardUserDocument;
          document: Document[T];
      };

export async function checkAuthority(): Promise<Authority> {
    const userInfo = await verifyToken();

    if (userInfo === null) {
        return { success: false, errorResponse: unauthorizedErrorResponse };
    }

    const user = await prisma.user.findUnique({
        where: { email: userInfo.email },
        select: { googleId: true, email: true, displayName: true },
    });

    if (user === null) {
        return { success: false, errorResponse: badRequestErrorResponse };
    }

    return { success: true, user };
}

export async function checkAuthorityWithDocument<T extends DocumentType>(
    options: CheckAuthorityWithDocumentOptions<T>
): Promise<AuthorityWithDocument<T>> {
    if (options !== undefined) {
        const isValidDocumentId = ObjectId.isValid(options.documentId);

        if (!isValidDocumentId) {
            return {
                success: false,
                errorResponse: unprocessableEntityErrorResponse,
            };
        }
    }

    const userInfo = await verifyToken();

    if (userInfo === null) {
        return { success: false, errorResponse: unauthorizedErrorResponse };
    }

    const user = await prisma.user.findUnique({
        where: { email: userInfo.email },
        select: { googleId: true, email: true, displayName: true },
    });

    if (user === null) {
        return { success: false, errorResponse: badRequestErrorResponse };
    }

    const { requiredPermission, documentType, documentId } = options;

    if (documentType === "taskBoardUser") {
        const taskBoardUser = await prisma.taskBoardUser.findUnique({
            where: { id: documentId },
            select: {
                userGoogleId: true,
                permission: true,
                isVisitor: true,
            },
        });

        if (taskBoardUser === null) {
            return { success: false, errorResponse: notFoundErrorResponse };
        }

        if (
            taskBoardUser.userGoogleId !== user.googleId ||
            (taskBoardUser.permission & requiredPermission) !==
                requiredPermission
        ) {
            return { success: false, errorResponse: forbiddenErrorResponse };
        }

        return {
            success: true,
            user,
            taskBoardUser,
            document: taskBoardUser,
        } as AuthorityWithDocument<T>;
    }

    if (documentType === "taskBoard") {
        const result = await runTransaction(async (prisma) => {
            const taskBoard = await prisma.taskBoard.findUnique({
                where: { id: documentId },
                select: {
                    id: true,
                    defaultPermission: true,
                    users: { select: { userGoogleId: true } },
                },
            });

            if (taskBoard === null) {
                return {
                    success: false,
                    errorResponse: notFoundErrorResponse,
                };
            }

            const hasAccess = checkUserAccess({ taskBoard, user });

            if (
                taskBoard.defaultPermission === PERMISSION_ROLE_NONE &&
                !hasAccess
            ) {
                return {
                    success: false,
                    errorResponse: forbiddenErrorResponse,
                };
            }

            let taskBoardUser;

            if (
                taskBoard.defaultPermission !== PERMISSION_ROLE_NONE &&
                !hasAccess
            ) {
                taskBoardUser = await prisma.taskBoardUser.create({
                    data: {
                        userGoogleId: user.googleId,
                        taskBoardId: taskBoard.id,
                        permission: taskBoard.defaultPermission,
                        isVisitor: true,
                    },
                    select: {
                        userGoogleId: true,
                        permission: true,
                    },
                });
            } else {
                const nullableTaskBoardUser =
                    await prisma.taskBoardUser.findUnique({
                        where: {
                            index: {
                                userGoogleId: user.googleId,
                                taskBoardId: taskBoard.id,
                            },
                        },
                        select: {
                            userGoogleId: true,
                            permission: true,
                        },
                    });
                taskBoardUser = nullableTaskBoardUser!;
            }

            if (
                (taskBoardUser.permission & requiredPermission) !==
                requiredPermission
            ) {
                return {
                    success: false,
                    errorResponse: forbiddenErrorResponse,
                };
            }

            return {
                success: true,
                user,
                taskBoardUser,
                document: taskBoard,
            };
        });

        return result as AuthorityWithDocument<T>;
    }

    if (documentType === "taskList") {
        const result = await runTransaction(async (prisma) => {
            const taskList = await prisma.taskList.findUnique({
                where: { id: documentId },
                select: {
                    taskBoard: {
                        select: {
                            id: true,
                            defaultPermission: true,
                            users: { select: { userGoogleId: true } },
                        },
                    },
                },
            });

            if (taskList === null) {
                return { success: false, errorResponse: notFoundErrorResponse };
            }

            const { taskBoard } = taskList;
            const hasAccess = checkUserAccess({ taskBoard, user });

            if (
                taskBoard.defaultPermission === PERMISSION_ROLE_NONE &&
                !hasAccess
            ) {
                return {
                    success: false,
                    errorResponse: forbiddenErrorResponse,
                };
            }

            let taskBoardUser;

            if (
                taskBoard.defaultPermission !== PERMISSION_ROLE_NONE &&
                !hasAccess
            ) {
                taskBoardUser = await prisma.taskBoardUser.create({
                    data: {
                        userGoogleId: user.googleId,
                        taskBoardId: taskBoard.id,
                        permission: taskBoard.defaultPermission,
                        isVisitor: true,
                    },
                    select: {
                        userGoogleId: true,
                        permission: true,
                    },
                });
            } else {
                const nullableTaskBoardUser =
                    await prisma.taskBoardUser.findUnique({
                        where: {
                            index: {
                                userGoogleId: user.googleId,
                                taskBoardId: taskBoard.id,
                            },
                        },
                        select: {
                            userGoogleId: true,
                            permission: true,
                        },
                    });
                taskBoardUser = nullableTaskBoardUser!;
            }

            if (
                (taskBoardUser.permission & requiredPermission) !==
                requiredPermission
            ) {
                return {
                    success: false,
                    errorResponse: forbiddenErrorResponse,
                };
            }

            return { success: true, user, taskBoardUser, document: taskList };
        });

        return result as AuthorityWithDocument<T>;
    }

    const result = await runTransaction(async (prisma) => {
        const task = await prisma.task.findUnique({
            where: { id: documentId },
            select: {
                taskList: {
                    select: {
                        taskBoard: {
                            select: {
                                id: true,
                                defaultPermission: true,
                                users: { select: { userGoogleId: true } },
                            },
                        },
                    },
                },
            },
        });

        if (task === null) {
            return { success: false, errorResponse: notFoundErrorResponse };
        }

        const { taskBoard } = task.taskList;
        const hasAccess = checkUserAccess({ taskBoard, user });

        if (
            taskBoard.defaultPermission === PERMISSION_ROLE_NONE &&
            !hasAccess
        ) {
            return {
                success: false,
                errorResponse: forbiddenErrorResponse,
            };
        }

        let taskBoardUser;

        if (
            taskBoard.defaultPermission !== PERMISSION_ROLE_NONE &&
            !hasAccess
        ) {
            taskBoardUser = await prisma.taskBoardUser.create({
                data: {
                    userGoogleId: user.googleId,
                    taskBoardId: taskBoard.id,
                    permission: taskBoard.defaultPermission,
                    isVisitor: true,
                },
                select: {
                    userGoogleId: true,
                    permission: true,
                },
            });
        } else {
            const nullableTaskBoardUser = await prisma.taskBoardUser.findUnique(
                {
                    where: {
                        index: {
                            userGoogleId: user.googleId,
                            taskBoardId: taskBoard.id,
                        },
                    },
                    select: {
                        userGoogleId: true,
                        permission: true,
                    },
                }
            );
            taskBoardUser = nullableTaskBoardUser!;
        }

        if (
            (taskBoardUser.permission & requiredPermission) !==
            requiredPermission
        ) {
            return {
                success: false,
                errorResponse: forbiddenErrorResponse,
            };
        }

        return { success: true, user, taskBoardUser, document: task };
    });

    return result as AuthorityWithDocument<T>;
}
