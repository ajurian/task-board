import { TaskBoardGetResponse } from "@/app/api/taskBoards/[id]/route";
import { TaskBoardsGetResponse } from "@/app/api/taskBoards/route";
import {
    AggregatedTaskBoardModelSchema,
    TaskBoardModelSchema,
} from "@/schema/taskBoard";
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

const OWNER_ID = "6659316caa5d86e144e64e3b";

export default async function BoardPage({ params }: Segment) {
    const { uniqueName } = params;

    const {
        data: { taskBoards: taskBoardsRaw },
    } = await axios.get<TaskBoardsGetResponse>(
        `http://localhost:3000/api/taskBoards?ownerId=${OWNER_ID}`
    );
    const taskBoards = TaskBoardModelSchema.array().parse(taskBoardsRaw);

    const selectedTaskBoardIncomplete = taskBoards.find(
        (taskBoards) => taskBoards.uniqueName === uniqueName
    );

    if (selectedTaskBoardIncomplete === undefined) {
        return notFound();
    }

    const {
        data: { taskBoard: selectedTaskBoardRaw },
    } = await axios.get<TaskBoardGetResponse>(
        `http://localhost:3000/api/taskBoards/${selectedTaskBoardIncomplete.id}`
    );
    const selectedTaskBoard =
        AggregatedTaskBoardModelSchema.parse(selectedTaskBoardRaw);

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
            <TaskQueryProvider selectedTaskBoard={selectedTaskBoard}>
                <DragDropProvider>
                    <DirectionProvider>
                        <Header taskBoards={taskBoards} />
                        <TaskBoard {...selectedTaskBoard} />
                    </DirectionProvider>
                </DragDropProvider>
            </TaskQueryProvider>
        </Box>
    );
}
