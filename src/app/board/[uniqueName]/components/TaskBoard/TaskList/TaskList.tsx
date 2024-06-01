import { TaskListModel } from "@/schema/taskList";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import { useDirection } from "../../../providers/DirectionProvider";
import { useTaskQuery } from "../../../providers/TaskQueryProvider";
import TaskItem from "./TaskItem";
import TaskItemPlaceholder from "./TaskItem/TaskItemPlaceholder";
import TaskListHeader from "./TaskListHeader";
import { TaskItemsWrapper, TaskListContainer } from "./ui";

interface TaskListProps extends TaskListModel {}

export default function TaskList({ id, order, title }: TaskListProps) {
    const { taskLists } = useTaskQuery();
    const { direction } = useDirection();
    const { tasks } = taskLists[order];

    return (
        <Draggable draggableId={id} index={order}>
            {({ draggableProps, dragHandleProps, innerRef: draggableRef }) => (
                <TaskListContainer
                    {...draggableProps}
                    {...dragHandleProps}
                    ref={draggableRef}
                    direction={direction}
                    tabIndex={0}
                >
                    <TaskListHeader listId={id} title={title} />
                    <Droppable
                        droppableId={order.toString()}
                        type="task"
                        direction="vertical"
                    >
                        {({
                            innerRef: droppableRef,
                            placeholder,
                            droppableProps,
                        }) => (
                            <TaskItemsWrapper
                                {...droppableProps}
                                ref={droppableRef}
                            >
                                <TaskItemPlaceholder listId={id} />
                                {tasks.map((task) => (
                                    <TaskItem key={task.id} {...task} />
                                ))}
                                {placeholder}
                            </TaskItemsWrapper>
                        )}
                    </Droppable>
                </TaskListContainer>
            )}
        </Draggable>
    );
}
