import withProtectedRoute from "@/_/common/hoc/withProtectedRoute";
import { NoSsr } from "@mui/material";
import Header from "./_/components/Header";
import Main from "./_/components/Main";
import TaskBoardsProvider from "./_/providers/TaskBoardsProvider";

const BoardPage = () => {
    return (
        <TaskBoardsProvider>
            <Header />
            <NoSsr>
                <Main />
            </NoSsr>
        </TaskBoardsProvider>
    );
};

export default withProtectedRoute(BoardPage);
