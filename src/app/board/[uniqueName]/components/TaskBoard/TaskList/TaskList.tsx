import { TaskListModel } from "@/schema/taskList";
import { Draggable } from "@hello-pangea/dnd";
import { TaskStatus } from "@prisma/client";
import { useState } from "react";
import { useDirection } from "../../../providers/DirectionProvider";
import { useTaskQuery } from "../../../providers/TaskQueryProvider";
import TaskItemPlaceholder from "./TaskItem/TaskItemPlaceholder";
import TaskListCollapsibleItems from "./TaskListCollapsibleItems";
import TaskListHeader from "./TaskListHeader";
import TaskListItemsWrapper from "./TaskListItemsWrapper";
import { TaskListContainer } from "./ui";

export interface TaskListProps extends TaskListModel {}

export default function TaskList({ id, order, title }: TaskListProps) {
    const { taskLists } = useTaskQuery();
    const { direction } = useDirection();
    const { tasks } = taskLists[order];

    const [openedStatus, setOpenedStatus] = useState<Exclude<
        TaskStatus,
        "pending"
    > | null>(null);

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
                        status="pending"
                        order={order}
                        tasks={tasks}
                    />
                    <TaskListCollapsibleItems
                        tasks={tasks}
                        status="ongoing"
                        order={order}
                        isOpen={openedStatus === "ongoing"}
                        onOpen={setOpenedStatus}
                    />
                    <TaskListCollapsibleItems
                        tasks={tasks}
                        status="completed"
                        order={order}
                        isOpen={openedStatus === "completed"}
                        onOpen={setOpenedStatus}
                    />
                </TaskListContainer>
            )}
        </Draggable>
    );
}
