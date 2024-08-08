"use client";

import { Droppable } from "@hello-pangea/dnd";
import SelectFromTaskBoardContext from "./SelectFromTaskBoardContext";
import TaskBoardHeader from "./TaskBoardHeader";
import TaskList from "./TaskList";
import TaskListPlaceholder from "./TaskList/TaskListPlaceholder";
import {
    TaskBoardContainer,
    TaskBoardListContainer,
    TaskBoardWrapper,
} from "./ui";

export default function TaskBoard() {
    return (
        <SelectFromTaskBoardContext
            selector={(state) => ({
                id: state.id,
                flowDirection: state.flowDirection,
                taskLists: state.taskLists,
                canUserReorderTaskList: state.canUserReorderTaskList,
                searchQuery: state.searchQuery,
            })}
        >
            {({
                id,
                flowDirection,
                taskLists,
                canUserReorderTaskList,
                searchQuery,
            }) => (
                <TaskBoardWrapper component="main">
                    <TaskBoardContainer
                        direction={flowDirection}
                        id="task-board"
                    >
                        <TaskBoardHeader />
                        <Droppable
                            droppableId={id}
                            type="taskList"
                            direction={
                                flowDirection === "row"
                                    ? "horizontal"
                                    : "vertical"
                            }
                        >
                            {({ innerRef, placeholder, droppableProps }) => (
                                <TaskBoardListContainer
                                    {...droppableProps}
                                    ref={innerRef}
                                    direction={flowDirection}
                                >
                                    {taskLists.map((taskList, index) => (
                                        <TaskList
                                            key={index}
                                            {...taskList}
                                            flowDirection={flowDirection}
                                            canUserReorderTaskList={
                                                canUserReorderTaskList
                                            }
                                            searchQuery={searchQuery}
                                        />
                                    ))}
                                    {placeholder}
                                    <TaskListPlaceholder
                                        taskListCount={taskLists.length}
                                    />
                                </TaskBoardListContainer>
                            )}
                        </Droppable>
                    </TaskBoardContainer>
                </TaskBoardWrapper>
            )}
        </SelectFromTaskBoardContext>
    );
}
