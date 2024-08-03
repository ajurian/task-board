"use client";

import { faRefresh } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, CircularProgress, IconButton } from "@mui/material";
import { useCallback, useEffect } from "react";
import { useTaskBoard } from "../../providers/TaskBoardProvider";

export default function HeaderSyncIndicator() {
    const { taskBoardQuery, refreshBoard, refreshUser, isChangesSaved } =
        useTaskBoard();
    const isLoading = taskBoardQuery.isRefetching || !isChangesSaved;

    const refreshData = useCallback(() => {
        refreshBoard();
        refreshUser();
    }, [refreshBoard, refreshUser]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.key === "R") {
                e.preventDefault();
                refreshData();
            }
        };

        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isChangesSaved) {
                return false;
            }

            e.preventDefault();
            e.returnValue = true;
            return true;
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [isChangesSaved, refreshData]);

    if (isLoading) {
        return (
            <Box color="text.secondary" maxHeight={20} mr={2}>
                <CircularProgress size={20} color="inherit" />
            </Box>
        );
    }

    return (
        <IconButton tabIndex={-1} size="small" onClick={refreshData}>
            <FontAwesomeIcon icon={faRefresh} />
        </IconButton>
    );
}
