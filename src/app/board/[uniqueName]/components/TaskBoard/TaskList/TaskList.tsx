import { TaskListModel } from "@/schema/taskList";
import { Draggable } from "@hello-pangea/dnd";
import { useMemo, useState } from "react";
import { useDirection } from "../../../providers/DirectionProvider";
import { useTaskQuery } from "../../../providers/TaskQueryProvider";
import TaskItemPlaceholder from "./TaskItem/TaskItemPlaceholder";
import TaskListCompletedItems from "./TaskListCompletedItems";
import TaskListHeader from "./TaskListHeader";
import TaskListItemsWrapper from "./TaskListItemsWrapper";
import { TaskListContainer } from "./ui";

export interface TaskListProps extends TaskListModel {}

export default function TaskList({ id, order, title }: TaskListProps) {
    const { taskLists } = useTaskQuery();
    const { direction } = useDirection();
    const { tasks } = taskLists[order];

    const groupedTasks = useMemo(
        () =>
            Object.groupBy(tasks, ({ isDone }) =>
                isDone ? "completed" : "pending"
            ),
        [tasks]
    );

    const [isCompletedItemsOpen, setIsCompletedItemsOpen] = useState(false);

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
                    <TaskItemPlaceholder listId={id} />
                    <TaskListItemsWrapper
                        order={order}
                        tasks={groupedTasks.pending || []}
                    />
                    {groupedTasks.completed && (
                        <TaskListCompletedItems
                            tasks={groupedTasks.completed}
                            order={order}
                            isOpen={isCompletedItemsOpen}
                            onOpen={setIsCompletedItemsOpen}
                        />
                    )}
                </TaskListContainer>
            )}
        </Draggable>
    );
}
