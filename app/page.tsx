"use client";

import { Box, Button } from "@mui/material";
import { useEffect } from "react";
import useAuth from "./_/hooks/useAuth";
import { useSession } from "./_/providers/SessionProvider";

export default function Home() {
    const session = useSession();
    const { signIn } = useAuth();

    useEffect(() => {
        console.log(session);
    }, [session]);

    return (
        <>
            <header>
                <nav>
                    <Button onClick={signIn}>Sign in with Google</Button>
                </nav>
            </header>
            <Box component="main">
                <div className=""></div>
            </Box>
            <footer></footer>
        </>
    );
}
