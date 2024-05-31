"use client";

import { TaskBoardModel } from "@/schema/taskBoard";
import { Droppable } from "@hello-pangea/dnd";
import { Box } from "@mui/material";
import { useDirection } from "../../providers/DirectionProvider";
import { useTaskQuery } from "../../providers/TaskQueryProvider";
import AddTaskList from "./AddTaskList";
import TaskBoardHeader from "./TaskBoardHeader";
import TaskList from "./TaskList";

interface TaskBoardProps extends TaskBoardModel {}

export default function TaskBoard({ uniqueName, displayName }: TaskBoardProps) {
    const { taskListsQuery, taskLists } = useTaskQuery();
    const { direction } = useDirection();
    const { isFetchedAfterMount } = taskListsQuery;

    return (
        <Box
            component="main"
            sx={{
                minWidth: "calc(100vw - (100vw - 100%))",
                width: "fit-content",
                position: "relative",
                py: 4,
                flex: 1,
            }}
        >
            <TaskBoardHeader displayName={displayName} />
            <Droppable
                droppableId={uniqueName}
                type="taskList"
                direction={direction === "row" ? "horizontal" : "vertical"}
            >
                {({ innerRef, placeholder, droppableProps }) => (
                    <Box
                        {...droppableProps}
                        ref={innerRef}
                        sx={{
                            px: 6,
                            display: "flex",
                            flexDirection: direction,
                            alignItems:
                                direction === "row" ? "start" : "center",
                        }}
                    >
                        {isFetchedAfterMount && (
                            <>
                                {taskLists.map((taskList) => (
                                    <TaskList key={taskList.id} {...taskList} />
                                ))}
                                {placeholder}
                                <AddTaskList />
                            </>
                        )}
                    </Box>
                )}
            </Droppable>
        </Box>
    );
}
