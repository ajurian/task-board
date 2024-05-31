import { TaskListModel } from "@/schema/taskList";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import { useClickOutside, useDisclosure } from "@mantine/hooks";
import { useDirection } from "../../../_providers/DirectionProvider";
import { useTaskQuery } from "../../../_providers/TaskQueryProvider";
import TaskItem from "./TaskItem";
import TaskItemPlaceholder from "./TaskItem/TaskItemPlaceholder";
import TaskListMenu from "./TaskListMenu";
import TaskListTitle from "./TaskListTitle";
import {
    AddTaskButton,
    TaskItemsWrapper,
    TaskListContainer,
    TaskListTitleContainer,
} from "./ui";

interface TaskListProps extends TaskListModel {}

export default function TaskList({ id, order, title }: TaskListProps) {
    const { taskLists } = useTaskQuery();
    const { direction } = useDirection();
    const { tasks } = taskLists[order];

    const [isTitleFocused, { open: focusTitle, close: blurTitle }] =
        useDisclosure(false);

    const [
        isTaskPlaceholderVisible,
        { open: showTaskPlaceholder, close: hideTaskPlaceholder },
    ] = useDisclosure(false);

    const taskPlaceholderRef = useClickOutside(hideTaskPlaceholder);

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
                    <TaskListTitleContainer>
                        <TaskListTitle
                            listId={id}
                            title={title}
                            isFocused={isTitleFocused}
                            onFocus={focusTitle}
                            onBlur={blurTitle}
                        />
                        <TaskListMenu listId={id} onRenameTitle={focusTitle} />
                    </TaskListTitleContainer>
                    <AddTaskButton
                        size="small"
                        startIcon={<FontAwesomeIcon icon={faAdd} />}
                        onClick={showTaskPlaceholder}
                    >
                        Add task
                    </AddTaskButton>
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
                                <TaskItemPlaceholder
                                    ref={taskPlaceholderRef}
                                    listId={id}
                                    isVisible={isTaskPlaceholderVisible}
                                    onHide={hideTaskPlaceholder}
                                />
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
