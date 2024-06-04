import { Droppable } from "@hello-pangea/dnd";
import { forwardRef } from "react";
import TaskItem, { TaskItemProps } from "./TaskItem";
import TaskItemCompleted, {
    TaskItemCompletedProps,
} from "./TaskItem/TaskItemCompleted";
import { TaskListItemsContainer } from "./ui";

interface TaskListItemsWrapperProps {
    order: number;
    tasks: (TaskItemProps | TaskItemCompletedProps)[];
}

const TaskListItemsWrapper = forwardRef<HTMLElement, TaskListItemsWrapperProps>(
    ({ order, tasks }, ref) => {
        return (
            <Droppable
                droppableId={`${order}`}
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
                        {tasks.map((task) =>
                            task.isDone ? (
                                <TaskItemCompleted key={task.id} {...task} />
                            ) : (
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
