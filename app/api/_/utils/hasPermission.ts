import { TaskBoardUserModel } from "@/_/common/schema/taskBoardUser";

export default function hasPermission(
    taskBoardUserTest: Pick<
        TaskBoardUserModel,
        "userGoogleId" | "permission"
    > | null,
    taskBoard: {
        users: Pick<TaskBoardUserModel, "userGoogleId">[];
    },
    requiredPermission: number
) {
    if (taskBoardUserTest === null) {
        return false;
    }

    if (
        (taskBoardUserTest.permission & requiredPermission) !==
        requiredPermission
    ) {
        return false;
    }

    return taskBoard.users.some(
        (taskBoardUser) =>
            taskBoardUser.userGoogleId === taskBoardUserTest.userGoogleId
    );
}
