import { TaskModel } from "@/_/common/schema/task";
import { TaskBoardContextValue } from "@/board/[id]/_/providers/TaskBoardProvider/TaskBoardProviderTypes";
import { faTrash, faUndo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useHover } from "@mantine/hooks";
import { Fade, IconButton, useTheme } from "@mui/material";
import { TransitionEventHandler, useCallback, useState } from "react";
import {
    TaskItemCompletedContainer,
    TaskItemFade,
    TaskItemTitleContainer,
    TaskItemTitleText,
} from "./ui";

export interface TaskItemCompletedProps
    extends Omit<TaskModel, "isDone">,
        Pick<
            TaskBoardContextValue,
            | "canUserCreateOrDeleteTask"
            | "canUserCompleteTask"
            | "editTask"
            | "deleteTask"
        > {}

export default function TaskItemCompleted({
    id,
    title,
    canUserCreateOrDeleteTask,
    canUserCompleteTask,
    editTask,
    deleteTask,
}: TaskItemCompletedProps) {
    const theme = useTheme();
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
        <TaskItemFade
            shouldFadeOut={actionAfterFade !== null}
            onTransitionEnd={handleTransitionEnd}
        >
            <TaskItemCompletedContainer ref={ref}>
                <TaskItemTitleContainer>
                    {canUserCompleteTask && (
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
                    )}
                    <TaskItemTitleText
                        shouldClampLine
                        variant="subtitle1"
                        sx={{
                            textDecoration: "line-through",
                            ml: canUserCompleteTask ? 0 : 9,
                        }}
                    >
                        {title}
                    </TaskItemTitleText>
                    {canUserCreateOrDeleteTask && (
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
                    )}
                </TaskItemTitleContainer>
            </TaskItemCompletedContainer>
        </TaskItemFade>
    );
}
