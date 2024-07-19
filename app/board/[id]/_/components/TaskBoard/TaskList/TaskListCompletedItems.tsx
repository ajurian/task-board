import { TaskModel } from "@/_/common/schema/task";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import useHeight from "./hooks/useHeight";
import TaskItemCompleted from "./TaskItem/TaskItemCompleted";
import {
    TaskListCompletedItemsContainer,
    TaskListCompletedItemsTrigger,
    TaskListCompletedItemsTriggerIcon,
    TaskListCompletedItemsTriggerText,
    TaskListCompletedItemsWrapper,
    TaskListItemsContainer,
} from "./ui";

interface TaskListCompletedItemsProps {
    tasks: TaskModel[];
    isOpen: boolean;
    onOpen: Dispatch<SetStateAction<boolean>>;
}

export default function TaskListCompletedItems({
    tasks,
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
                <TaskListItemsContainer ref={itemsWrapperRef}>
                    {tasks.map((task, index) => (
                        <TaskItemCompleted key={index} {...task} />
                    ))}
                </TaskListItemsContainer>
            </TaskListCompletedItemsWrapper>
        </TaskListCompletedItemsContainer>
    );
}
