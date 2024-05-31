import { TaskBoardsGetResponse } from "@/app/api/taskBoards/route";
import { Box, NoSsr, Typography } from "@mui/material";
import HeaderContainer from "./HeaderContainer";
import SearchInput from "./SearchInput";
import Sidebar from "./Sidebar";
import SwitchDirectionButton from "./SwitchDirectionButton";
import SyncIndicator from "./SyncIndicator";
import User from "./User";

interface HeaderProps {
    taskBoards: TaskBoardsGetResponse;
}

export default async function Header({ taskBoards }: HeaderProps) {
    return (
        <HeaderContainer>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Sidebar taskBoards={taskBoards} />
                <Typography variant="h6" color="text.secondary">
                    TaskManager
                </Typography>
            </Box>
            <SearchInput />
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    ml: "auto",
                    gap: 2,
                }}
            >
                <NoSsr>
                    <SyncIndicator />
                </NoSsr>
                <SwitchDirectionButton />
                <User />
            </Box>
        </HeaderContainer>
    );
}
