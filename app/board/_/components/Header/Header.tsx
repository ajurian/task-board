import { Box } from "@mui/material";
import HeaderProfile from "../common/HeaderProfile";
import HeaderTitle from "../common/HeaderTitle";
import HeaderContainer from "./HeaderContainer";

export default function Header() {
    return (
        <HeaderContainer component="header">
            <HeaderTitle />
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    ml: "auto",
                    gap: 2,
                }}
            >
                <HeaderProfile />
            </Box>
        </HeaderContainer>
    );
}
