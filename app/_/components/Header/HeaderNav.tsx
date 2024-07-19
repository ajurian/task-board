"use client";

import { useAuth } from "@/_/providers/AuthProvider";
import { Button } from "@mui/material";
import { HeaderNavContainer } from "./ui";

export default function HeaderNav() {
    const { signIn, signOut } = useAuth();

    return (
        <HeaderNavContainer component="nav">
            <Button onClick={signIn}>Sign in with Google</Button>
            <Button onClick={signOut}>Sign out</Button>
        </HeaderNavContainer>
    );
}
