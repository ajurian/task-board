import { TaskModel } from "@/_/common/schema/task";
import { useTaskBoard } from "@/board/[id]/_/providers/TaskBoardProvider";
import { faTrash, faUndo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useHover } from "@mantine/hooks";
import { Fade, IconButton, useTheme } from "@mui/material";
import { TransitionEventHandler, useCallback, useState } from "react";
import {
    TaskItemCompletedContainer,
    TaskItemTitleContainer,
    TaskItemTitleText,
} from "./ui";

export interface TaskItemCompletedProps extends Omit<TaskModel, "isDone"> {}

export default function TaskItemCompleted({
    id,
    title,
}: TaskItemCompletedProps) {
    const theme = useTheme();
    const { editTask, deleteTask } = useTaskBoard();
    const [actionAfterFade, setActionAfterFade] = useState<(() => void) | null>(
        null
    );
    const { ref, hovered: isDeleteIconVisible } = useHover();

    const handleTransitionEnd: TransitionEventHandler<HTMLElement> =
        useCallback(
            (e) => {
                if (e.target !== e.currentTarget) {
                    return;
                }

                actionAfterFade?.();
                setActionAfterFade(null);
            },
            [actionAfterFade]
        );

    return (
        <Fade
            in={actionAfterFade === null}
            timeout={{
                enter: 0,
                exit: theme.transitions.duration.shortest,
            }}
            onTransitionEnd={handleTransitionEnd}
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
                    <TaskItemTitleText
                        isContainerFocused={false}
                        variant="subtitle1"
                        sx={{ textDecoration: "line-through" }}
                    >
                        {title}
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
