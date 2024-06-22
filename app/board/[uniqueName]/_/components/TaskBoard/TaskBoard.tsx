"use client";

import { TaskBoardModel } from "@/_/schema/taskBoard";
import { Droppable } from "@hello-pangea/dnd";
import { useDirection } from "../../_providers/DirectionProvider";
import { useTaskQuery } from "../../_providers/TaskQueryProvider";
import TaskBoardHeader from "./TaskBoardHeader";
import TaskList from "./TaskList";
import TaskListPlaceholder from "./TaskList/TaskListPlaceholder";
import { TaskBoardContainer, TaskBoardListContainer } from "./ui";

export interface TaskBoardProps extends TaskBoardModel {}

export default function TaskBoard({ uniqueName, displayName }: TaskBoardProps) {
    const { taskLists } = useTaskQuery();
    const { direction } = useDirection();

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
