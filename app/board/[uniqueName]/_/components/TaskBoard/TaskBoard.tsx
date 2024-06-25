"use client";

import { Droppable } from "@hello-pangea/dnd";
import { useDirection } from "../../providers/DirectionProvider";
import { useTaskBoard } from "../../providers/TaskBoardProvider";
import TaskBoardHeader from "./TaskBoardHeader";
import TaskList from "./TaskList";
import TaskListPlaceholder from "./TaskList/TaskListPlaceholder";
import { TaskBoardContainer, TaskBoardListContainer } from "./ui";

export default function TaskBoard() {
    const { uniqueName, taskLists } = useTaskBoard();
    const { direction } = useDirection();

    return (
        <TaskBoardContainer component="main">
            <TaskBoardHeader />
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
                        {taskLists.map((taskList, index) => (
                            <TaskList key={index} index={index} {...taskList} />
                        ))}
                        {placeholder}
                        <TaskListPlaceholder />
                    </TaskBoardListContainer>
                )}
            </Droppable>
        </TaskBoardContainer>
    );
}
