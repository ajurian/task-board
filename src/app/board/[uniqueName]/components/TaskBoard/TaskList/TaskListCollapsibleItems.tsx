import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box } from "@mui/material";
import { TaskStatus } from "@prisma/client";
import { Dispatch, SetStateAction } from "react";
import useHeight from "./hooks/useHeight";
import { TaskItemProps } from "./TaskItem";
import TaskListItemsWrapper from "./TaskListItemsWrapper";
import {
    TaskListCollapsibleItemsContainer,
    TaskListCollapsibleItemsTrigger,
    TaskListCollapsibleItemsTriggerIcon,
    TaskListCollapsibleItemsTriggerText,
    TaskListCollapsibleItemsWrapper,
} from "./ui";

type Status = Exclude<TaskStatus, "pending">;

interface TaskListCollapsibleItemsProps {
    tasks: TaskItemProps[];
    status: Status;
    order: number;
    isOpen: boolean;
    onOpen: Dispatch<SetStateAction<Status | null>>;
}

export default function TaskListCollapsibleItems({
    tasks,
    status,
    order,
    isOpen,
    onOpen,
}: TaskListCollapsibleItemsProps) {
    const { ref: itemsWrapperRef, height } = useHeight<HTMLDivElement>();

    return (
        <TaskListCollapsibleItemsContainer>
            <TaskListCollapsibleItemsTrigger
                onClick={() =>
                    onOpen((openedStatus) =>
                        openedStatus === status ? null : status
                    )
                }
            >
                <TaskListCollapsibleItemsTriggerText>
                    {status}
                </TaskListCollapsibleItemsTriggerText>
                <Box sx={{ px: 0.5 }}>
                    <TaskListCollapsibleItemsTriggerIcon isOpen={isOpen}>
                        <FontAwesomeIcon icon={faChevronLeft} />
                    </TaskListCollapsibleItemsTriggerIcon>
                </Box>
            </TaskListCollapsibleItemsTrigger>
            <TaskListCollapsibleItemsWrapper height={height} isOpen={isOpen}>
                <TaskListItemsWrapper
                    ref={itemsWrapperRef}
                    status={status}
                    order={order}
                    tasks={tasks}
                />
            </TaskListCollapsibleItemsWrapper>
        </TaskListCollapsibleItemsContainer>
    );
}
