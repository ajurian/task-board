"use client";

import { TaskBoardModel } from "@/schema/taskBoard";
import {
    faAdd,
    faBars,
    faTableColumns,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    Box,
    Divider,
    Drawer,
    IconButton,
    List,
    Typography,
} from "@mui/material";
import { useState } from "react";
import SidebarItem from "./SidebarItem";

interface SidebarProps {
    taskBoards: TaskBoardModel[];
}

export default function Sidebar({ taskBoards }: SidebarProps) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <IconButton size="small" onClick={() => setOpen(true)}>
                <FontAwesomeIcon icon={faBars} />
            </IconButton>
            <Drawer open={open} onClose={() => setOpen(false)}>
                <Box
                    role="presentation"
                    sx={(theme) => ({
                        width: theme.spacing(64),
                        height: "100%",
                    })}
                    onClick={() => setOpen(false)}
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
                        {taskBoards.map(({ displayName }, index) => (
                            <SidebarItem
                                key={index}
                                icon={faTableColumns}
                                text={displayName}
                            />
                        ))}
                        <SidebarItem icon={faAdd} text="Add board" />
                    </List>
                </Box>
            </Drawer>
        </>
    );
}
