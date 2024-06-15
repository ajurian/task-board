import { AggregatedTaskListModel } from "@/schema/taskList";
import { Draggable } from "@hello-pangea/dnd";
import { useMemo, useState } from "react";
import { useDirection } from "../../../providers/DirectionProvider";
import { useTaskQuery } from "../../../providers/TaskQueryProvider";
import TaskItemPlaceholder from "./TaskItem/TaskItemPlaceholder";
import TaskListCompletedItems from "./TaskListCompletedItems";
import TaskListHeader from "./TaskListHeader";
import TaskListItemsWrapper from "./TaskListItemsWrapper";
import { TaskListContainer } from "./ui";

export interface TaskListProps extends AggregatedTaskListModel {
    index: number;
}

export default function TaskList({
    index,
    id,
    order,
    title,
    tasks,
}: TaskListProps) {
    const [isCompletedItemsOpen, setIsCompletedItemsOpen] = useState(false);
    const { direction } = useDirection();
    const { searchQuery } = useTaskQuery();

    const groupedTasks = useMemo(
        () =>
            Object.groupBy(tasks, ({ isDone }) =>
                isDone ? "completed" : "pending"
            ),
        [tasks]
    );

    return (
        <Draggable
            key={id}
            draggableId={id}
            index={index}
            isDragDisabled={searchQuery.length > 0}
        >
            {({ draggableProps, dragHandleProps, innerRef: draggableRef }) => (
                <TaskListContainer
                    {...draggableProps}
                    {...dragHandleProps}
                    ref={draggableRef}
                    direction={direction}
                    tabIndex={0}
                >
                    <TaskListHeader listId={id} title={title} />
                    <TaskItemPlaceholder listId={id} />
                    <TaskListItemsWrapper
                        order={order}
                        tasks={groupedTasks.pending || []}
                    />
                    {groupedTasks.completed && (
                        <TaskListCompletedItems
                            tasks={groupedTasks.completed}
                            isOpen={isCompletedItemsOpen}
                            onOpen={setIsCompletedItemsOpen}
                        />
                    )}
                </TaskListContainer>
            )}
        </Draggable>
    );
}
