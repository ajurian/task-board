import { TaskBoardModel } from "@/_/schema/taskBoard";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconButton, Typography } from "@mui/material";
import { useDirection } from "../../_providers/DirectionProvider";
import { TaskBoardHeaderContainer, TaskBoardHeaderWrapper } from "./ui";

interface TaskBoardHeaderProps extends Pick<TaskBoardModel, "displayName"> {}

export default function TaskBoardHeader({ displayName }: TaskBoardHeaderProps) {
    const { direction } = useDirection();

    return (
        <TaskBoardHeaderWrapper direction={direction}>
            <TaskBoardHeaderContainer direction={direction}>
                <Typography
                    variant="h6"
                    color="text.secondary"
                    fontWeight={400}
                >
                    {displayName}
                </Typography>
                <IconButton size="small" tabIndex={-1}>
                    <FontAwesomeIcon icon={faEllipsisVertical} />
                </IconButton>
            </TaskBoardHeaderContainer>
        </TaskBoardHeaderWrapper>
    );
}
