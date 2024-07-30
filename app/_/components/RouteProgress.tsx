"use client";

import { Box, LinearProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useTransition } from "react";

export default function RouteProgress() {
    const router = useRouter();
    const [isChangingRoute, startTransition] = useTransition();

    useEffect(() => {
        const _push = router.push.bind(router);

        router.push = (href, options) => {
            startTransition(() => _push(href, options));
        };
    }, [router]);

    if (!isChangingRoute) {
        return null;
    }

    return (
        <Box
            sx={(theme) => ({
                zIndex: theme.zIndex.appBar + 1,
                position: "absolute",
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
            })}
        >
            <LinearProgress />
        </Box>
    );
}
