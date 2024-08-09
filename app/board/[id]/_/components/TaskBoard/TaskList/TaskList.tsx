import { AggregatedTaskListModel } from "@/_/common/schema/taskList";
import { Draggable } from "@hello-pangea/dnd";
import _ from "lodash";
import { memo, useMemo, useState } from "react";
import { TaskBoardContextValue } from "../../../providers/TaskBoardProvider/TaskBoardProviderTypes";
import SelectFromTaskBoardContext from "../SelectFromTaskBoardContext";
import TaskItemPlaceholder from "./TaskItem/TaskItemPlaceholder";
import TaskListCompletedItems from "./TaskListCompletedItems";
import TaskListHeader from "./TaskListHeader";
import TaskListItemsPending from "./TaskListItemsPending";
import { TaskListContainer } from "./ui";

export interface TaskListProps
    extends AggregatedTaskListModel,
        Pick<
            TaskBoardContextValue,
            "flowDirection" | "canUserReorderTaskList" | "searchQuery"
        > {}

const TaskList = memo(function TaskList({
    id,
    order,
    title,
    sortBy,
    tasks,
    flowDirection,
    canUserReorderTaskList,
    searchQuery,
}: TaskListProps) {
    const [isCompletedItemsOpen, setIsCompletedItemsOpen] = useState(false);
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
            index={order}
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
                    scrollbarHeight={0}
                    direction={flowDirection}
                    isDragging={isDragging}
                    isDragDisabled={isDragDisabled}
                    tabIndex={0}
                >
                    <SelectFromTaskBoardContext
                        selector={(state) => ({
                            canUserCreateOrDeleteTaskList:
                                state.canUserCreateOrDeleteTaskList,
                            canUserRenameTaskList: state.canUserRenameTaskList,
                            editTaskList: state.editTaskList,
                            deleteTaskList: state.deleteTaskList,
                        })}
                    >
                        {(state) => (
                            <TaskListHeader
                                listId={id}
                                title={title}
                                sortBy={sortBy}
                                {...state}
                            />
                        )}
                    </SelectFromTaskBoardContext>
                    <SelectFromTaskBoardContext
                        selector={(state) => ({
                            maxTasks: state.maxTasks,
                            canUserCreateOrDeleteTask:
                                state.canUserCreateOrDeleteTask,
                            addTask: state.addTask,
                        })}
                    >
                        {(state) => (
                            <TaskItemPlaceholder
                                listId={id}
                                taskCount={tasks.length}
                                {...state}
                            />
                        )}
                    </SelectFromTaskBoardContext>
                    <TaskListItemsPending order={order} tasks={pendingTasks} />
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
},
_.isEqual);

export default TaskList;
