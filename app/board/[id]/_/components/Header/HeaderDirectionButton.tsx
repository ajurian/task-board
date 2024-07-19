"use client";

import {
    faArrowsLeftRight,
    faArrowsUpDown,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconButton } from "@mui/material";
import { useTaskBoard } from "../../providers/TaskBoardProvider";

export default function HeaderDirectionButton() {
    const { flowDirection, toggleFlowDirection } = useTaskBoard();

    return (
        <IconButton onClick={toggleFlowDirection} size="small" tabIndex={-1}>
            <FontAwesomeIcon
                icon={
                    flowDirection === "row" ? faArrowsLeftRight : faArrowsUpDown
                }
            />
        </IconButton>
    );
}
