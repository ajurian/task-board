import { TaskBoardsGetResponse } from "@/app/api/taskBoards/route";
import { Box } from "@mui/material";
import axios from "axios";
import { notFound } from "next/navigation";
import Header from "./components/Header";
import TaskBoard from "./components/TaskBoard";
import DirectionProvider from "./providers/DirectionProvider";
import DragDropProvider from "./providers/DragDropProvider";
import TaskQueryProvider from "./providers/TaskQueryProvider";

interface Segment {
    params: {
        uniqueName: string;
    };
}

export default async function BoardPage({ params }: Segment) {
    const { uniqueName } = params;
    const { data: taskBoards } = await axios.get<TaskBoardsGetResponse>(
        "http://localhost:3000/api/taskBoards"
    );

    const taskBoard = taskBoards.find(
        (taskBoard) =>
            taskBoard.ownerId === "6659316caa5d86e144e64e3b" &&
            taskBoard.uniqueName === uniqueName
    );

    if (taskBoard === undefined) {
        return notFound();
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
            <TaskQueryProvider boardId={taskBoard.id}>
                <DragDropProvider>
                    <DirectionProvider>
                        <Header taskBoards={taskBoards} />
                        <TaskBoard {...taskBoard} />
                    </DirectionProvider>
                </DragDropProvider>
            </TaskQueryProvider>
        </Box>
    );
}
