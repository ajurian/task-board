import ServerAuthSessionAPI from "@/api/_/layers/server/AuthSessionAPI";
import ServerTaskBoardAPI from "@/api/_/layers/server/TaskBoardAPI";
import { Box } from "@mui/material";
import { notFound, redirect } from "next/navigation";
import Header from "./_/components/Header";
import TaskBoard from "./_/components/TaskBoard";
import DirectionProvider from "./_/providers/DirectionProvider";
import DragDropProvider from "./_/providers/DragDropProvider";
import TaskBoardProvider from "./_/providers/TaskBoardProvider";

interface Segment {
    params: {
        uniqueName: string;
    };
}

export default async function BoardPage({ params }: Segment) {
    const { uniqueName } = params;

    const {
        data: { session },
    } = await ServerAuthSessionAPI.get();

    if (session === null) {
        return redirect("/");
    }

    const {
        data: { taskBoards },
    } = await ServerTaskBoardAPI.getAll();

    const selectedTaskBoardIncomplete = taskBoards.find(
        (taskBoards) => taskBoards.uniqueName === uniqueName
    );

    if (selectedTaskBoardIncomplete === undefined) {
        return notFound();
    }

    const {
        data: { taskBoard: selectedTaskBoard },
    } = await ServerTaskBoardAPI.get(selectedTaskBoardIncomplete.id);

    if (selectedTaskBoard === null) {
        throw new Error(
            "`selectedTaskBoardIncomplete.id` is existent and yet we reached this code. (selectedTaskBoard === null)"
        );
    }

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                overflow: "auto",
                minHeight: "100vh",
                maxHeight: "100vh",
            }}
        >
            <TaskBoardProvider selectedTaskBoard={selectedTaskBoard}>
                <DragDropProvider>
                    <DirectionProvider>
                        <Header taskBoards={taskBoards} />
                        <TaskBoard />
                    </DirectionProvider>
                </DragDropProvider>
            </TaskBoardProvider>
        </Box>
    );
}
