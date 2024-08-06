import { TaskModel } from "@/_/common/schema/task";
import { Droppable } from "@hello-pangea/dnd";
import TaskItem from "./TaskItem";
import { TaskListItemsContainer } from "./ui";

interface TaskListItemsWrapperProps {
    order: number;
    tasks: TaskModel[];
}

export default function TaskListItemsWrapper({
    order,
    tasks,
}: TaskListItemsWrapperProps) {
    return (
        <Droppable droppableId={`${order}`} type="task" direction="vertical">
            {({ innerRef: droppableRef, placeholder, droppableProps }) => (
                <TaskListItemsContainer {...droppableProps} ref={droppableRef}>
                    {tasks.map((task, index) => (
                        <TaskItem key={index} {...task} />
                    ))}
                    {placeholder}
                </TaskListItemsContainer>
            )}
        </Droppable>
    );
}
