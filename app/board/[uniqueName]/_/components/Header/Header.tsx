import { TaskBoardModel } from "@/_/schema/taskBoard";
import { Box, NoSsr, Typography } from "@mui/material";
import HeaderContainer from "./HeaderContainer";
import HeaderDirectionButton from "./HeaderDirectionButton";
import HeaderProfile from "./HeaderProfile";
import HeaderSearchInput from "./HeaderSearchInput";
import HeaderSyncIndicator from "./HeaderSyncIndicator";
import Sidebar from "./Sidebar";

interface HeaderProps {
    taskBoards: TaskBoardModel[];
}

export default async function Header({ taskBoards }: HeaderProps) {
    return (
        <HeaderContainer component="header">
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Sidebar taskBoards={taskBoards} />
                <Typography variant="h6" color="text.secondary">
                    TaskManager
                </Typography>
            </Box>
            <HeaderSearchInput />
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    ml: "auto",
                    gap: 2,
                }}
            >
                <NoSsr>
                    <HeaderSyncIndicator />
                </NoSsr>
                <HeaderDirectionButton />
                <HeaderProfile />
            </Box>
        </HeaderContainer>
    );
}
