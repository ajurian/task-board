"use client";

import { createContext, useContext } from "react";
import {
    SessionContextValue,
    SessionProviderProps,
} from "./SessionProviderTypes";

const SessionContext = createContext<SessionContextValue>(null);

export const useSession = () => useContext(SessionContext);

export default function SessionProvider({
    session,
    children,
}: SessionProviderProps) {
    return (
        <SessionContext.Provider value={session}>
            {children}
        </SessionContext.Provider>
    );
}
