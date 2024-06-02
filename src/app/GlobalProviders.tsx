"use client";

import theme from "@/config/theme";
import { GlobalStyles, ThemeProvider } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren } from "react";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {},
        mutations: {},
    },
});

export default function GlobalProviders({ children }: PropsWithChildren) {
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider theme={theme}>
                <GlobalStyles
                    styles={`
                        .svg-inline--fa {
                            aspect-ratio: 1 / 1;
                        }
                        
                        body {
                            overflow: hidden;
                        }
                    `}
                />
                {children}
            </ThemeProvider>
        </QueryClientProvider>
    );
}
