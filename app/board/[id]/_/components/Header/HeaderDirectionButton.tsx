"use client";

import {
    faArrowsLeftRight,
    faArrowsUpDown,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconButton } from "@mui/material";
import { useTaskBoard } from "../../providers/TaskBoardProvider";

export default function HeaderDirectionButton() {
    const { flowDirection, updateFlowDirection } = useTaskBoard();

    return (
        <IconButton
            onClick={() =>
                updateFlowDirection({
                    flowDirection: flowDirection === "row" ? "column" : "row",
                })
            }
            size="small"
            tabIndex={-1}
        >
            <FontAwesomeIcon
                icon={
                    flowDirection === "row" ? faArrowsLeftRight : faArrowsUpDown
                }
            />
        </IconButton>
    );
}
