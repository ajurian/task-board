import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "@fortawesome/fontawesome-svg-core/styles.css";

import { config } from "@fortawesome/fontawesome-svg-core";
import { CssBaseline } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import type { Metadata } from "next";
import GlobalProviders from "./GlobalProviders";

config.autoAddCss = false;

export const metadata: Metadata = {
    title: "TaskManager",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                <AppRouterCacheProvider>
                    <GlobalProviders>
                        <CssBaseline />
                        {children}
                    </GlobalProviders>
                </AppRouterCacheProvider>
            </body>
        </html>
    );
}
