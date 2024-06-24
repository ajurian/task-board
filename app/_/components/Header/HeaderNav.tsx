"use client";

import React from "react";
import { HeaderNavContainer } from "./ui";
import { Button } from "@mui/material";
import useAuth from "@/_/hooks/useAuth";

export default function HeaderNav() {
    const { signIn } = useAuth();

    return (
        <HeaderNavContainer component="nav">
            <Button onClick={signIn}>Sign in with Google</Button>
        </HeaderNavContainer>
    );
}
