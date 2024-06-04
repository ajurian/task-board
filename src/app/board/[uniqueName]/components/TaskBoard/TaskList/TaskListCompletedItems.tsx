import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import useHeight from "./hooks/useHeight";
import { TaskItemProps } from "./TaskItem";
import TaskListItemsWrapper from "./TaskListItemsWrapper";
import {
    TaskListCompletedItemsContainer,
    TaskListCompletedItemsTrigger,
    TaskListCompletedItemsTriggerIcon,
    TaskListCompletedItemsTriggerText,
    TaskListCompletedItemsWrapper,
} from "./ui";
import { TaskItemCompletedProps } from "./TaskItem/TaskItemCompleted";

interface TaskListCompletedItemsProps {
    tasks: (TaskItemProps | TaskItemCompletedProps)[];
    order: number;
    isOpen: boolean;
    onOpen: Dispatch<SetStateAction<boolean>>;
}

export default function TaskListCompletedItems({
    tasks,
    order,
    isOpen,
    onOpen,
}: TaskListCompletedItemsProps) {
    const { ref: itemsWrapperRef, height } = useHeight<HTMLDivElement>();

    return (
        <TaskListCompletedItemsContainer>
            <TaskListCompletedItemsTrigger
                onClick={() => onOpen((isOpen) => !isOpen)}
            >
                <TaskListCompletedItemsTriggerText>
                    Completed ({tasks.length})
                </TaskListCompletedItemsTriggerText>
                <Box sx={{ px: 0.5 }}>
                    <TaskListCompletedItemsTriggerIcon isOpen={isOpen}>
                        <FontAwesomeIcon icon={faChevronLeft} />
                    </TaskListCompletedItemsTriggerIcon>
                </Box>
            </TaskListCompletedItemsTrigger>
            <TaskListCompletedItemsWrapper height={height} isOpen={isOpen}>
                <TaskListItemsWrapper
                    ref={itemsWrapperRef}
                    order={order}
                    tasks={tasks}
                />
            </TaskListCompletedItemsWrapper>
        </TaskListCompletedItemsContainer>
    );
}
