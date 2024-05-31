"use client";

import {
    faArrowsLeftRight,
    faArrowsUpDown,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconButton } from "@mui/material";
import { useDirection } from "../../providers/DirectionProvider";

export default function SwitchDirectionButton() {
    const { direction, toggleDirection } = useDirection();

    return (
        <IconButton onClick={toggleDirection} size="small" tabIndex={-1}>
            <FontAwesomeIcon
                icon={direction === "row" ? faArrowsLeftRight : faArrowsUpDown}
            />
        </IconButton>
    );
}
