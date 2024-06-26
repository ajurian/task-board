import { AggregatedTaskModel } from "@/_/schema/task";
import { Droppable } from "@hello-pangea/dnd";
import TaskItem from "./TaskItem";
import { TaskListItemsContainer } from "./ui";

interface TaskListItemsWrapperProps {
    order: number;
    tasks: AggregatedTaskModel[];
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
                        <TaskItem key={index} index={index} {...task} />
                    ))}
                    {placeholder}
                </TaskListItemsContainer>
            )}
        </Droppable>
    );
}
