"use client";

import ClientTaskBoardAPI from "@/api/_/common/layers/client/TaskBoardAPI";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, CircularProgress, Divider, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { useTaskBoards } from "../../providers/TaskBoardsProvider";
import TaskBoardCard from "./TaskBoardCard";
import {
    MainContainer,
    NewTaskBoardCard,
    NewTaskBoardCardLabel,
    NewTaskBoardContainer,
    TaskBoardsContainer,
    TaskBoardsEmptyListContainer,
    TaskBoardsGrid,
    TaskBoardsLoadingContainer,
    TaskBoardsRecentBoards,
} from "./ui";

export default function Main() {
    const [isGeneratingNewBoard, setIsGeneratingNewBoard] = useState(false);
    const router = useRouter();

    const { taskBoardsQuery } = useTaskBoards();

    const taskBoards = useMemo(
        () => taskBoardsQuery.data ?? [],
        [taskBoardsQuery.data]
    );

    const generateNewBoard = useCallback(async () => {
        setIsGeneratingNewBoard(true);

        const {
            data: { taskBoard },
        } = await ClientTaskBoardAPI.post({ displayName: "Untitled" });

        setIsGeneratingNewBoard(false);

        if (taskBoard === null) {
            return;
        }

        router.push(`/board/${taskBoard.id}`);
    }, [router]);

    return (
        <MainContainer component="main">
            <NewTaskBoardContainer>
                <Box>
                    <NewTaskBoardCard
                        onClick={generateNewBoard}
                        isDisabled={isGeneratingNewBoard}
                    >
                        {isGeneratingNewBoard && (
                            <CircularProgress
                                size={24}
                                sx={{ color: "inherit" }}
                            />
                        )}
                        {!isGeneratingNewBoard && (
                            <FontAwesomeIcon icon={faAdd} />
                        )}
                    </NewTaskBoardCard>
                    <NewTaskBoardCardLabel variant="subtitle2">
                        New board
                    </NewTaskBoardCardLabel>
                </Box>
            </NewTaskBoardContainer>
            <Divider />
            <TaskBoardsContainer>
                <TaskBoardsRecentBoards>Recent boards</TaskBoardsRecentBoards>
                <TaskBoardsGrid>
                    {taskBoardsQuery.isLoading && (
                        <TaskBoardsLoadingContainer>
                            <CircularProgress color="inherit" />
                        </TaskBoardsLoadingContainer>
                    )}
                    {!taskBoardsQuery.isLoading && taskBoards.length === 0 && (
                        <TaskBoardsEmptyListContainer>
                            <Typography
                                variant="h6"
                                sx={{
                                    "::after": {
                                        content: "'List is empty'",
                                    },
                                }}
                            />
                        </TaskBoardsEmptyListContainer>
                    )}
                    {!taskBoardsQuery.isLoading &&
                        taskBoards.length > 0 &&
                        taskBoards.map(
                            (
                                {
                                    id,
                                    permission,
                                    recentlyAccessedAt,
                                    taskBoard,
                                },
                                index
                            ) => (
                                <TaskBoardCard
                                    key={index}
                                    boardUserId={id}
                                    permission={permission}
                                    accessedAt={recentlyAccessedAt}
                                    boardId={taskBoard.id}
                                    title={taskBoard.displayName}
                                    isShared={taskBoard.users.length > 1}
                                />
                            )
                        )}
                </TaskBoardsGrid>
            </TaskBoardsContainer>
        </MainContainer>
    );
}
