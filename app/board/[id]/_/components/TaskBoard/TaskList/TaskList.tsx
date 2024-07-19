import { PERMISSION_TASK_LIST_REORDER } from "@/_/common/constants/permissions";
import { AggregatedTaskListModel } from "@/_/common/schema/taskList";
import { Draggable } from "@hello-pangea/dnd";
import { useMemo, useState } from "react";
import { useTaskBoard } from "../../../providers/TaskBoardProvider";
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
    const { flowDirection, canUserReorderTaskList, searchQuery } =
        useTaskBoard();

    const isDragDisabled = searchQuery.length > 0 || !canUserReorderTaskList;

    const pendingTasks = useMemo(
        () => tasks.filter((task) => !task.isDone),
        [tasks]
    );

    const completedTasks = useMemo(
        () => tasks.filter((task) => task.isDone),
        [tasks]
    );

    return (
        <Draggable
            key={id}
            draggableId={id}
            index={index}
            isDragDisabled={isDragDisabled}
        >
            {(
                { draggableProps, dragHandleProps, innerRef: draggableRef },
                { isDragging }
            ) => (
                <TaskListContainer
                    {...draggableProps}
                    {...dragHandleProps}
                    ref={draggableRef}
                    direction={flowDirection}
                    isDragging={isDragging}
                    isDragDisabled={isDragDisabled}
                    tabIndex={0}
                >
                    <TaskListHeader listId={id} title={title} />
                    <TaskItemPlaceholder listId={id} />
                    <TaskListItemsWrapper order={order} tasks={pendingTasks} />
                    {completedTasks.length > 0 && (
                        <TaskListCompletedItems
                            tasks={completedTasks}
                            isOpen={isCompletedItemsOpen}
                            onOpen={setIsCompletedItemsOpen}
                        />
                    )}
                </TaskListContainer>
            )}
        </Draggable>
    );
}
