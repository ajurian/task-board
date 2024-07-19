import { TaskBoardRelation } from "@/_/common/schema/taskBoard.relation";
import { UserModel } from "@/_/common/schema/user";

interface CheckUserAccessOptions {
    taskBoard: {
        users: Pick<TaskBoardRelation["users"][number], "userGoogleId">[];
    };
    user: Pick<UserModel, "googleId">;
}

export default function checkUserAccess({
    taskBoard,
    user,
}: CheckUserAccessOptions) {
    return taskBoard.users.some(
        (taskBoardUser) => taskBoardUser.userGoogleId === user.googleId
    );
}
