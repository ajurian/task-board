"use client";

import { Box, LinearProgress } from "@mui/material";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function RouteProgress() {
    const [isLoading, setIsLoading] = useState(false);
    const pathname = usePathname();
    const searchParams = useSearchParams().toString();
    const router = useRouter();

    useEffect(() => {
        const _push = router.push.bind(router);

        router.push = (href, options) => {
            setIsLoading(true);
            _push(href, options);
        };
    }, [router]);

    useEffect(() => setIsLoading(false), [pathname, searchParams]);

    if (!isLoading) {
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
