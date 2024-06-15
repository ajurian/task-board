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

export interface TaskItemCompletedProps extends Omit<TaskModel, "isDone"> {}

export default function TaskItemCompleted({
    id,
    order,
    title,
}: TaskItemCompletedProps) {
    const initialTitle = useMemo(() => title.replace(/\\n/g, "\n"), [title]);

    const theme = useTheme();
    const { editTask, deleteTask } = useTaskQuery();
    const [actionAfterFade, setActionAfterFade] = useState<(() => void) | null>(
        null
    );
    const { ref, hovered: isDeleteIconVisible } = useHover();

    return (
        <Fade
            in={actionAfterFade === null}
            timeout={{
                enter: 0,
                exit: theme.transitions.duration.shortest,
            }}
            onTransitionEnd={() => {
                actionAfterFade?.();
                setActionAfterFade(null);
            }}
        >
            <TaskItemCompletedContainer ref={ref}>
                <TaskItemTitleContainer>
                    <IconButton
                        size="small"
                        color="primary"
                        tabIndex={-1}
                        onClick={() =>
                            setActionAfterFade(
                                () => () => editTask({ id, isDone: false })
                            )
                        }
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
                            onClick={() =>
                                setActionAfterFade(
                                    () => () => deleteTask({ id })
                                )
                            }
                        >
                            <FontAwesomeIcon icon={faTrash} />
                        </IconButton>
                    </Fade>
                </TaskItemTitleContainer>
            </TaskItemCompletedContainer>
        </Fade>
    );
}
