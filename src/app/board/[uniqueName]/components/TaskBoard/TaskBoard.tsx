"use client";

import { TaskBoardModel } from "@/schema/taskBoard";
import { Droppable } from "@hello-pangea/dnd";
import { useDirection } from "../../providers/DirectionProvider";
import { useTaskQuery } from "../../providers/TaskQueryProvider";
import AddTaskList from "./AddTaskList";
import TaskBoardHeader from "./TaskBoardHeader";
import TaskList from "./TaskList";
import { TaskBoardContainer, TaskBoardListContainer } from "./ui";

interface TaskBoardProps extends TaskBoardModel {}

export default function TaskBoard({ uniqueName, displayName }: TaskBoardProps) {
    const { taskListsQuery, taskLists } = useTaskQuery();
    const { direction } = useDirection();
    const { isFetchedAfterMount } = taskListsQuery;

    return (
        <TaskBoardContainer component="main">
            <TaskBoardHeader displayName={displayName} />
            <Droppable
                droppableId={uniqueName}
                type="taskList"
                direction={direction === "row" ? "horizontal" : "vertical"}
            >
                {({ innerRef, placeholder, droppableProps }) => (
                    <TaskBoardListContainer
                        {...droppableProps}
                        ref={innerRef}
                        direction={direction}
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
                    </TaskBoardListContainer>
                )}
            </Droppable>
        </TaskBoardContainer>
    );
}
