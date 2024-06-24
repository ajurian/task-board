"use client";

import { TaskBoardModel } from "@/_/schema/taskBoard";
import {
    faAdd,
    faBars,
    faTableColumns,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDisclosure } from "@mantine/hooks";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    Divider,
    Drawer,
    IconButton,
    List,
    TextField,
    Typography,
} from "@mui/material";
import { useParams } from "next/navigation";
import { FormEventHandler, useCallback } from "react";
import { z } from "zod";
import SidebarItem from "./SidebarItem";
import ClientTaskBoardAPI from "@/api/_/layers/client/TaskBoardAPI";

interface SidebarProps {
    taskBoards: TaskBoardModel[];
}

export default function Sidebar({ taskBoards }: SidebarProps) {
    const { uniqueName: activeUniqueName } = useParams<{
        uniqueName: string;
    }>();
    const [isDrawerOpen, { open: openDrawer, close: closeDrawer }] =
        useDisclosure();
    const [isDialogOpen, { open: openDialog, close: closeDialog }] =
        useDisclosure();

    const handleDialogSubmit: FormEventHandler<HTMLFormElement> = useCallback(
        (e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const uniqueName = z
                .string()
                .toLowerCase()
                .regex(/^[A-Za-z0-9\-_]*$/g)
                .parse(formData.get("uniqueName"));
            const displayName = z.string().parse(formData.get("displayName"));

            ClientTaskBoardAPI.post({ uniqueName, displayName });
        },
        []
    );

    return (
        <>
            <IconButton size="small" onClick={openDrawer}>
                <FontAwesomeIcon icon={faBars} />
            </IconButton>
            <Drawer open={isDrawerOpen} onClose={closeDrawer}>
                <Box
                    role="presentation"
                    sx={(theme) => ({
                        width: theme.spacing(64),
                        height: "100%",
                    })}
                    onClick={closeDrawer}
                >
                    <Box
                        sx={{
                            px: 4,
                            height: "calc(2.5625rem + 17px)",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <Typography variant="h6" color="text.secondary">
                            TaskManager
                        </Typography>
                    </Box>
                    <Divider />
                    <List>
                        {taskBoards.map(
                            ({ uniqueName, displayName }, index) => (
                                <SidebarItem
                                    key={index}
                                    icon={faTableColumns}
                                    id={uniqueName}
                                    text={displayName}
                                    active={activeUniqueName === uniqueName}
                                />
                            )
                        )}
                        <SidebarItem
                            icon={faAdd}
                            text="Add board"
                            onClick={openDialog}
                        />
                    </List>
                </Box>
            </Drawer>
            <Dialog
                fullWidth
                maxWidth="xs"
                open={isDialogOpen}
                onClose={closeDialog}
            >
                <form onSubmit={handleDialogSubmit}>
                    <DialogContent
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                        }}
                    >
                        <TextField
                            label="Unique name"
                            name="uniqueName"
                            variant="standard"
                            size="small"
                        />
                        <TextField
                            label="Display name"
                            name="displayName"
                            variant="standard"
                            size="small"
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={closeDialog}>Cancel</Button>
                        <Button type="submit">Add board</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    );
}
