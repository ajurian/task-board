import withProtectedRoute from "@/_/common/hoc/withProtectedRoute";
import ServerTaskBoardAPI from "@/api/_/common/layers/server/TaskBoardAPI";
import ServerTaskBoardUserAPI from "@/api/_/common/layers/server/TaskBoardUserAPI";
import { NoSsr } from "@mui/material";
import { isAxiosError } from "axios";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import ForbiddenError from "./_/components/ForbiddenError";
import Header from "./_/components/Header";
import TaskBoard from "./_/components/TaskBoard";
import DragDropProvider from "./_/providers/DragDropProvider";
import TaskBoardProvider from "./_/providers/TaskBoardProvider";

interface BoardPageProps {
    params: {
        id: string;
    };
}

const BoardPage: React.FC<BoardPageProps> = async ({ params }) => {
    const { id } = params;
    let selectedTaskBoard = null;

    try {
        const {
            data: { taskBoard },
        } = await ServerTaskBoardAPI.get(id);
        selectedTaskBoard = taskBoard;
    } catch (e) {
        console.log(e);
        if (isAxiosError(e) && e.response?.status === 403) {
            return <ForbiddenError taskBoardId={id} />;
        }
    }

    const {
        data: { taskBoardUser },
    } = await ServerTaskBoardUserAPI.getFromTaskBoard(id);

    if (selectedTaskBoard === null || taskBoardUser === null) {
        return notFound();
    }

    return (
        <NoSsr>
            <TaskBoardProvider
                selectedTaskBoard={selectedTaskBoard}
                taskBoardUser={taskBoardUser}
            >
                <DragDropProvider>
                    <Header />
                    <TaskBoard />
                </DragDropProvider>
            </TaskBoardProvider>
        </NoSsr>
    );
};

export async function generateMetadata({
    params,
}: BoardPageProps): Promise<Metadata> {
    const { id } = params;
    let pageTitle = "TaskBoard";

    try {
        const {
            data: { taskBoard },
        } = await ServerTaskBoardAPI.get(id);

        if (taskBoard !== null) {
            pageTitle = `${taskBoard.displayName} - ${pageTitle}`;
        }
    } catch (e) {}

    return { title: pageTitle };
}

export default withProtectedRoute(BoardPage);
