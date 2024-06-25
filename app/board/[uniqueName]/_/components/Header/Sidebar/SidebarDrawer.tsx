import { TaskBoardModel } from "@/_/schema/taskBoard";
import { faAdd, faTableColumns } from "@fortawesome/free-solid-svg-icons";
import { Box, Divider, Drawer, List, Typography } from "@mui/material";
import SidebarDrawerItem from "./SidebarDrawerItem";

interface SidebarDrawerProps {
    taskBoards: TaskBoardModel[];
    activeBoard: string;
    isOpen: boolean;
    onClose: () => void;
    onDialogOpen: () => void;
}

export default function SidebarDrawer({
    taskBoards,
    activeBoard,
    isOpen,
    onClose,
    onDialogOpen,
}: SidebarDrawerProps) {
    return (
        <Drawer open={isOpen} onClose={onClose}>
            <Box
                role="presentation"
                sx={(theme) => ({
                    width: theme.spacing(64),
                    height: "100%",
                })}
                onClick={onClose}
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
                        TaskBoard
                    </Typography>
                </Box>
                <Divider />
                <List>
                    {taskBoards.map(({ uniqueName, displayName }, index) => (
                        <SidebarDrawerItem
                            key={index}
                            icon={faTableColumns}
                            id={uniqueName}
                            text={displayName}
                            active={activeBoard === uniqueName}
                        />
                    ))}
                    <SidebarDrawerItem
                        icon={faAdd}
                        text="Add board"
                        onClick={onDialogOpen}
                    />
                </List>
            </Box>
        </Drawer>
    );
}
