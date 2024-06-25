"use client";

import { TaskBoardModel } from "@/_/schema/taskBoard";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDisclosure } from "@mantine/hooks";
import { IconButton } from "@mui/material";
import { useParams } from "next/navigation";
import SidebarDialog from "./SidebarDialog";
import SidebarDrawer from "./SidebarDrawer";

interface SidebarProps {
    taskBoards: TaskBoardModel[];
}

export default function Sidebar({ taskBoards }: SidebarProps) {
    const { uniqueName: activeBoard } = useParams<{
        uniqueName: string;
    }>();
    const [isDrawerOpen, { open: openDrawer, close: closeDrawer }] =
        useDisclosure();
    const [isDialogOpen, { open: openDialog, close: closeDialog }] =
        useDisclosure();

    return (
        <>
            <IconButton size="small" onClick={openDrawer}>
                <FontAwesomeIcon icon={faBars} />
            </IconButton>
            <SidebarDrawer
                taskBoards={taskBoards}
                activeBoard={activeBoard}
                isOpen={isDrawerOpen}
                onClose={closeDrawer}
                onDialogOpen={openDialog}
            />
            <SidebarDialog isOpen={isDialogOpen} onClose={closeDialog} />
        </>
    );
}
