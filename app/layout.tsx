import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "@fortawesome/fontawesome-svg-core/styles.css";

import { config } from "@fortawesome/fontawesome-svg-core";
import { CssBaseline } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import type { Metadata } from "next";
import { z } from "zod";
import GlobalProviders from "./GlobalProviders";
import SessionProvider from "./_/providers/SessionProvider";
import ServerAuthSessionAPI from "./api/_/layers/server/AuthSessionAPI";

declare module "axios" {
    interface AxiosRequestConfig {
        schema?: z.Schema;
    }
}

config.autoAddCss = false;

export const metadata: Metadata = {
    title: "TaskBoard",
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const {
        data: { session },
    } = await ServerAuthSessionAPI.get();

    return (
        <html lang="en">
            <body>
                <AppRouterCacheProvider>
                    <SessionProvider session={session}>
                        <GlobalProviders>
                            <CssBaseline />
                            {children}
                        </GlobalProviders>
                    </SessionProvider>
                </AppRouterCacheProvider>
            </body>
        </html>
    );
}
