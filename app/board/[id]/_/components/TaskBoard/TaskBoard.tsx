"use client";

import { Droppable } from "@hello-pangea/dnd";
import { useTaskBoard } from "../../providers/TaskBoardProvider";
import TaskBoardHeader from "./TaskBoardHeader";
import TaskList from "./TaskList";
import TaskListPlaceholder from "./TaskList/TaskListPlaceholder";
import {
    TaskBoardContainer,
    TaskBoardListContainer,
    TaskBoardWrapper,
} from "./ui";

export default function TaskBoard() {
    const { id, flowDirection, taskLists } = useTaskBoard();

    return (
        <TaskBoardWrapper component="main">
            <TaskBoardContainer direction={flowDirection} id="task-board">
                <TaskBoardHeader />
                <Droppable
                    droppableId={id}
                    type="taskList"
                    direction={
                        flowDirection === "row" ? "horizontal" : "vertical"
                    }
                >
                    {({ innerRef, placeholder, droppableProps }) => (
                        <TaskBoardListContainer
                            {...droppableProps}
                            ref={innerRef}
                            direction={flowDirection}
                        >
                            {taskLists.map((taskList, index) => (
                                <TaskList key={index} {...taskList} />
                            ))}
                            {placeholder}
                            <TaskListPlaceholder />
                        </TaskBoardListContainer>
                    )}
                </Droppable>
            </TaskBoardContainer>
        </TaskBoardWrapper>
    );
}
