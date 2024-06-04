import { useTaskQuery } from "@/app/board/[uniqueName]/providers/TaskQueryProvider";
import { TaskModel } from "@/schema/task";
import { faTrash, faUndo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useHover } from "@mantine/hooks";
import { Fade, IconButton, Typography, useTheme } from "@mui/material";
import { useMemo, useState } from "react";
import {
    TaskItemCompletedContainer,
    TaskItemTitleContainer,
    TaskItemTitleText,
} from "./ui";

export interface TaskItemCompletedProps extends Omit<TaskModel, "isDone"> {
    isDone: true;
}

export default function TaskItemCompleted({
    id,
    order,
    title,
}: TaskItemCompletedProps) {
    const initialTitle = useMemo(() => title.replace(/\\n/g, "\n"), [title]);

    const { editTask, deleteTask } = useTaskQuery();

    const theme = useTheme();
    const [isVisible, setIsVisible] = useState(true);
    const { ref, hovered: isDeleteIconVisible } = useHover();

    return (
        <Fade
            in={isVisible}
            timeout={{
                enter: 0,
                exit: theme.transitions.duration.shortest,
            }}
            onTransitionEnd={() =>
                !isVisible && editTask({ id, isDone: false })
            }
        >
            <TaskItemCompletedContainer ref={ref}>
                <TaskItemTitleContainer>
                    <IconButton
                        size="small"
                        color="primary"
                        tabIndex={-1}
                        onClick={() => setIsVisible(false)}
                    >
                        <FontAwesomeIcon icon={faUndo} />
                    </IconButton>
                    <Typography variant="subtitle1">({order})</Typography>
                    <TaskItemTitleText
                        isContainerFocused={false}
                        variant="subtitle1"
                        sx={{ textDecoration: "line-through" }}
                    >
                        {initialTitle}
                    </TaskItemTitleText>
                    <Fade
                        in={isDeleteIconVisible}
                        timeout={{
                            enter: theme.transitions.duration.shortest,
                            exit: theme.transitions.duration.shortest,
                        }}
                    >
                        <IconButton
                            size="small"
                            onClick={() => deleteTask({ id })}
                        >
                            <FontAwesomeIcon icon={faTrash} />
                        </IconButton>
                    </Fade>
                </TaskItemTitleContainer>
            </TaskItemCompletedContainer>
        </Fade>
    );
}
