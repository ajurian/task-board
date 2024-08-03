import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "@fortawesome/fontawesome-svg-core/styles.css";

import { config } from "@fortawesome/fontawesome-svg-core";
import { CssBaseline } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { PropsWithChildren } from "react";
import { z } from "zod";
import GlobalProviders from "./GlobalProviders";
import RouteProgress from "./_/components/RouteProgress";
import AuthProvider from "./_/providers/AuthProvider";
import UserInfoProvider from "./_/providers/UserInfoProvider";
import ServerAuthTokenAPI from "./api/_/common/layers/server/AuthTokenAPI";

declare module "axios" {
    interface AxiosRequestConfig {
        schema?: z.Schema;
    }
}

config.autoAddCss = false;

export const metadata: Metadata = {
    title: "TaskBoard",
};

export default async function RootLayout({ children }: PropsWithChildren) {
    const {
        data: { userInfo },
    } = await ServerAuthTokenAPI.get();

    return (
        <html lang="en">
            <body>
                <AppRouterCacheProvider>
                    <UserInfoProvider userInfo={userInfo}>
                        <AuthProvider>
                            <GlobalProviders>
                                <Analytics />
                                <SpeedInsights />
                                <RouteProgress />
                                <CssBaseline />
                                {children}
                            </GlobalProviders>
                        </AuthProvider>
                    </UserInfoProvider>
                </AppRouterCacheProvider>
            </body>
        </html>
    );
}
