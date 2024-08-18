"use client";

import ClientTaskBoardAPI from "@/api/_/common/layers/client/TaskBoardAPI";
import { Box, Button, TextField, Typography } from "@mui/material";
import { FormEventHandler, useCallback, useRef } from "react";
import { Container, Wrapper } from "./ui";
import Link from "next/link";

interface ForbiddenErrorProps {
    taskBoardId: string;
}

export default function ForbiddenError({ taskBoardId }: ForbiddenErrorProps) {
    const messageInputRef = useRef<HTMLTextAreaElement | null>(null);

    const handleSubmit: FormEventHandler<HTMLFormElement> = useCallback(
        (e) => {
            e.preventDefault();
            const messageInputElement = messageInputRef.current;

            if (messageInputElement === null) {
                return;
            }

            ClientTaskBoardAPI.requestAccess(taskBoardId, {
                message: messageInputElement.value,
            });
        },
        [taskBoardId]
    );

    return (
        <Wrapper>
            <Container>
                <Typography
                    component={Link}
                    variant="h6"
                    color="text.secondary"
                    href="/board"
                    sx={{ textDecoration: "none" }}
                >
                    TaskBoard
                </Typography>
                <Typography variant="h4" sx={{ mt: 4 }}>
                    You need access
                </Typography>
                <Typography sx={{ mt: 2 }}>
                    Request access, or switch to an account with access.
                </Typography>
                <Box component="form" sx={{ mt: 4 }} onSubmit={handleSubmit}>
                    <TextField
                        inputRef={messageInputRef}
                        label="Message (optional)"
                        fullWidth
                        multiline
                        rows={5}
                        sx={{ display: "block" }}
                    />
                    <Button type="submit" variant="contained" sx={{ mt: 2 }}>
                        Request access
                    </Button>
                </Box>
            </Container>
        </Wrapper>
    );
}
