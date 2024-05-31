"use client";

import { faArrowRotateLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, CircularProgress, IconButton } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";
import { useTaskQuery } from "../../providers/TaskQueryProvider";

export default function SyncIndicator() {
    const queryClient = useQueryClient();
    const { taskListsQuery, isMutationPending } = useTaskQuery();
    const isLoading = taskListsQuery.isRefetching || isMutationPending;

    const refetchData = useCallback(
        () => queryClient.invalidateQueries({ queryKey: ["taskLists"] }),
        [queryClient]
    );

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.key === "R") {
                e.preventDefault();
                refetchData();
            }
        };

        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (!isMutationPending) {
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
    }, [isMutationPending, refetchData]);

    return isLoading ? (
        <Box color="text.secondary" maxHeight={20} mr={2}>
            <CircularProgress size={20} color="inherit" />
        </Box>
    ) : (
        <IconButton tabIndex={-1} size="small" onClick={refetchData}>
            <FontAwesomeIcon icon={faArrowRotateLeft} />
        </IconButton>
    );
}
