import HeaderProfile from "@/board/_/components/common/HeaderProfile";
import HeaderTitle from "@/board/_/components/common/HeaderTitle";
import { Box } from "@mui/material";
import HeaderContainer from "./HeaderContainer";
import HeaderDirectionButton from "./HeaderDirectionButton";
import HeaderSearchInput from "./HeaderSearchInput";
import HeaderSyncIndicator from "./HeaderSyncIndicator";

export default async function Header() {
    return (
        <HeaderContainer component="header">
            <HeaderTitle />
            <HeaderSearchInput />
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    ml: "auto",
                    gap: 2,
                }}
            >
                <HeaderSyncIndicator />
                <HeaderDirectionButton />
                <HeaderProfile />
            </Box>
        </HeaderContainer>
    );
}
