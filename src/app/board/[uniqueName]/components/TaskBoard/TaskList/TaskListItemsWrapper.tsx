import { TaskModel } from "@/schema/task";
import { Droppable } from "@hello-pangea/dnd";
import { forwardRef } from "react";
import TaskItem, { TaskItemProps } from "./TaskItem";
import { TaskListItemsContainer } from "./ui";

interface TaskListItemsWrapperProps {
    status: TaskModel["status"];
    order: number;
    tasks: TaskItemProps[];
}

const TaskListItemsWrapper = forwardRef<HTMLElement, TaskListItemsWrapperProps>(
    ({ status, order, tasks }, ref) => {
        return (
            <Droppable
                droppableId={`${status}-${order}`}
                type="task"
                direction="vertical"
            >
                {({ innerRef: droppableRef, placeholder, droppableProps }) => (
                    <TaskListItemsContainer
                        {...droppableProps}
                        ref={(node: HTMLElement) => {
                            droppableRef(node);

                            if (typeof ref === "function") {
                                ref(node);
                            } else if (ref !== null) {
                                ref.current = node;
                            }
                        }}
                    >
                        {tasks.map(
                            (task) =>
                                task.status === status && (
                                    <TaskItem key={task.id} {...task} />
                                )
                        )}
                        {placeholder}
                    </TaskListItemsContainer>
                )}
            </Droppable>
        );
    }
);
TaskListItemsWrapper.displayName = "TaskListItemsWrapper";

export default TaskListItemsWrapper;
