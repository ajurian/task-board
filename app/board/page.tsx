import withProtectedRoute from "@/_/common/hoc/withProtectedRoute";
import { UserInfo } from "@/_/common/schema/userInfo";
import { NoSsr } from "@mui/material";
import Header from "./_/components/Header";
import Main from "./_/components/Main";
import TaskBoardsProvider from "./_/providers/TaskBoardsProvider";

interface BoardPageProps {
    userInfo: UserInfo;
}

const BoardPage = async ({ userInfo }: BoardPageProps) => {
    return (
        <TaskBoardsProvider userInfo={userInfo}>
            <Header />
            <NoSsr>
                <Main />
            </NoSsr>
        </TaskBoardsProvider>
    );
};

export default withProtectedRoute(BoardPage);
