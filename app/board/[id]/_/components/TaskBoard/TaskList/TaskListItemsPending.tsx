import { TaskModel } from "@/_/common/schema/task";
import { Droppable } from "@hello-pangea/dnd";
import SelectFromTaskBoardContext from "../SelectFromTaskBoardContext/SelectFromTaskBoardContext";
import TaskItem from "./TaskItem";
import { TaskListItemsContainer } from "./ui";

interface TaskListItemsPendingProps {
    order: number;
    tasks: TaskModel[];
}

export default function TaskListItemsPending({
    order,
    tasks,
}: TaskListItemsPendingProps) {
    return (
        <Droppable droppableId={`${order}`} type="task" direction="vertical">
            {({ innerRef: droppableRef, placeholder, droppableProps }) => (
                <TaskListItemsContainer
                    {...droppableProps}
                    ref={droppableRef}
                    tabIndex={-1}
                >
                    <SelectFromTaskBoardContext
                        selector={(state) => ({
                            canUserCreateOrDeleteTask:
                                state.canUserCreateOrDeleteTask,
                            canUserUpdateTaskTitle:
                                state.canUserUpdateTaskTitle,
                            canUserUpdateTaskDetails:
                                state.canUserUpdateTaskDetails,
                            canUserCompleteTask: state.canUserCompleteTask,
                            canUserScheduleTask: state.canUserScheduleTask,
                            canUserReorderTask: state.canUserReorderTask,
                            editTask: state.editTask,
                            deleteTask: state.deleteTask,
                            searchQuery: state.searchQuery,
                        })}
                    >
                        {(state) =>
                            tasks.map((task, index) => (
                                <TaskItem key={index} {...task} {...state} />
                            ))
                        }
                    </SelectFromTaskBoardContext>
                    {placeholder}
                </TaskListItemsContainer>
            )}
        </Droppable>
    );
}
