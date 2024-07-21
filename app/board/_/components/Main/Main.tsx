"use client";

import ClientTaskBoardAPI from "@/api/_/common/layers/client/TaskBoardAPI";
import { faAdd, faUserGroup } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Divider, Typography } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { useTaskBoards } from "../../providers/TaskBoardsProvider";
import {
    MainContainer,
    NewTaskBoardCard,
    NewTaskBoardCardLabel,
    NewTaskBoardContainer,
    TaskBoardCard,
    TaskBoardCardHeader,
    TaskBoardCardTitleContainer,
    TaskBoardsContainer,
    TaskBoardsGrid,
    TaskBoardsRecentBoards,
    ThumbnailImageWrapper,
} from "./ui";

export default function Main() {
    const router = useRouter();

    const { taskBoardsQuery } = useTaskBoards();

    const taskBoards = useMemo(
        () => taskBoardsQuery.data ?? [],
        [taskBoardsQuery.data]
    );

    const generateNewBoard = useCallback(async () => {
        const {
            data: { taskBoard },
        } = await ClientTaskBoardAPI.post({ displayName: "Untitled" });

        if (taskBoard === null) {
            return;
        }

        router.push(`/board/${taskBoard.id}`);
    }, [router]);

    return (
        <MainContainer component="main">
            <NewTaskBoardContainer>
                <Box>
                    <NewTaskBoardCard onClick={generateNewBoard}>
                        <FontAwesomeIcon icon={faAdd} />
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
                    {taskBoards.map(
                        ({ recentlyAccessedAt, taskBoard }, index) => (
                            <TaskBoardCard
                                key={index}
                                role="option"
                                href={`/board/${taskBoard.id}`}
                            >
                                <TaskBoardCardHeader>
                                    <TaskBoardCardTitleContainer>
                                        <Typography>
                                            {taskBoard.displayName}
                                        </Typography>
                                        {taskBoard.users.length > 1 && (
                                            <FontAwesomeIcon
                                                icon={faUserGroup}
                                            />
                                        )}
                                    </TaskBoardCardTitleContainer>
                                    <Typography variant="caption">
                                        {recentlyAccessedAt.toLocaleString()}
                                    </Typography>
                                </TaskBoardCardHeader>
                                <Divider sx={{ borderColor: "inherit" }} />
                                <ThumbnailImageWrapper>
                                    <Image
                                        fill
                                        src={`${location.origin}/api/thumbnails/${taskBoard.id}`}
                                        alt="thumbnail"
                                    />
                                </ThumbnailImageWrapper>
                            </TaskBoardCard>
                        )
                    )}
                    {taskBoards.map(
                        ({ recentlyAccessedAt, taskBoard }, index) => (
                            <TaskBoardCard
                                key={index}
                                role="option"
                                href={`/board/${taskBoard.id}`}
                            >
                                <TaskBoardCardHeader>
                                    <TaskBoardCardTitleContainer>
                                        <Typography>
                                            {taskBoard.displayName}
                                        </Typography>
                                        {taskBoard.users.length > 1 && (
                                            <FontAwesomeIcon
                                                icon={faUserGroup}
                                            />
                                        )}
                                    </TaskBoardCardTitleContainer>
                                    <Typography variant="caption">
                                        {recentlyAccessedAt.toLocaleString()}
                                    </Typography>
                                </TaskBoardCardHeader>
                                <Divider sx={{ borderColor: "inherit" }} />
                                <ThumbnailImageWrapper>
                                    <Image
                                        fill
                                        src={`${location.origin}/api/thumbnails/${taskBoard.id}`}
                                        alt="thumbnail"
                                    />
                                </ThumbnailImageWrapper>
                            </TaskBoardCard>
                        )
                    )}
                    {taskBoards.map(
                        ({ recentlyAccessedAt, taskBoard }, index) => (
                            <TaskBoardCard
                                key={index}
                                role="option"
                                href={`/board/${taskBoard.id}`}
                            >
                                <TaskBoardCardHeader>
                                    <TaskBoardCardTitleContainer>
                                        <Typography>
                                            {taskBoard.displayName}
                                        </Typography>
                                        {taskBoard.users.length > 1 && (
                                            <FontAwesomeIcon
                                                icon={faUserGroup}
                                            />
                                        )}
                                    </TaskBoardCardTitleContainer>
                                    <Typography variant="caption">
                                        {recentlyAccessedAt.toLocaleString()}
                                    </Typography>
                                </TaskBoardCardHeader>
                                <Divider sx={{ borderColor: "inherit" }} />
                                <ThumbnailImageWrapper>
                                    <Image
                                        fill
                                        src={`${location.origin}/api/thumbnails/${taskBoard.id}`}
                                        alt="thumbnail"
                                    />
                                </ThumbnailImageWrapper>
                            </TaskBoardCard>
                        )
                    )}
                    {taskBoards.map(
                        ({ recentlyAccessedAt, taskBoard }, index) => (
                            <TaskBoardCard
                                key={index}
                                role="option"
                                href={`/board/${taskBoard.id}`}
                            >
                                <TaskBoardCardHeader>
                                    <TaskBoardCardTitleContainer>
                                        <Typography>
                                            {taskBoard.displayName}
                                        </Typography>
                                        {taskBoard.users.length > 1 && (
                                            <FontAwesomeIcon
                                                icon={faUserGroup}
                                            />
                                        )}
                                    </TaskBoardCardTitleContainer>
                                    <Typography variant="caption">
                                        {recentlyAccessedAt.toLocaleString()}
                                    </Typography>
                                </TaskBoardCardHeader>
                                <Divider sx={{ borderColor: "inherit" }} />
                                <ThumbnailImageWrapper>
                                    <Image
                                        fill
                                        src={`${location.origin}/api/thumbnails/${taskBoard.id}`}
                                        alt="thumbnail"
                                    />
                                </ThumbnailImageWrapper>
                            </TaskBoardCard>
                        )
                    )}
                    {taskBoards.map(
                        ({ recentlyAccessedAt, taskBoard }, index) => (
                            <TaskBoardCard
                                key={index}
                                role="option"
                                href={`/board/${taskBoard.id}`}
                            >
                                <TaskBoardCardHeader>
                                    <TaskBoardCardTitleContainer>
                                        <Typography>
                                            {taskBoard.displayName}
                                        </Typography>
                                        {taskBoard.users.length > 1 && (
                                            <FontAwesomeIcon
                                                icon={faUserGroup}
                                            />
                                        )}
                                    </TaskBoardCardTitleContainer>
                                    <Typography variant="caption">
                                        {recentlyAccessedAt.toLocaleString()}
                                    </Typography>
                                </TaskBoardCardHeader>
                                <Divider sx={{ borderColor: "inherit" }} />
                                <ThumbnailImageWrapper>
                                    <Image
                                        fill
                                        src={`${location.origin}/api/thumbnails/${taskBoard.id}`}
                                        alt="thumbnail"
                                    />
                                </ThumbnailImageWrapper>
                            </TaskBoardCard>
                        )
                    )}
                    {taskBoards.map(
                        ({ recentlyAccessedAt, taskBoard }, index) => (
                            <TaskBoardCard
                                key={index}
                                role="option"
                                href={`/board/${taskBoard.id}`}
                            >
                                <TaskBoardCardHeader>
                                    <TaskBoardCardTitleContainer>
                                        <Typography>
                                            {taskBoard.displayName}
                                        </Typography>
                                        {taskBoard.users.length > 1 && (
                                            <FontAwesomeIcon
                                                icon={faUserGroup}
                                            />
                                        )}
                                    </TaskBoardCardTitleContainer>
                                    <Typography variant="caption">
                                        {recentlyAccessedAt.toLocaleString()}
                                    </Typography>
                                </TaskBoardCardHeader>
                                <Divider sx={{ borderColor: "inherit" }} />
                                <ThumbnailImageWrapper>
                                    <Image
                                        fill
                                        src={`${location.origin}/api/thumbnails/${taskBoard.id}`}
                                        alt="thumbnail"
                                    />
                                </ThumbnailImageWrapper>
                            </TaskBoardCard>
                        )
                    )}
                </TaskBoardsGrid>
            </TaskBoardsContainer>
        </MainContainer>
    );
}
