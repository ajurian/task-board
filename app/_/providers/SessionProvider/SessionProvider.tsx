"use client";

import { createContext, useContext } from "react";
import {
    SessionContextValue,
    SessionProviderProps,
} from "./SessionProviderTypes";
import { DecodedIdToken } from "firebase-admin/auth";

const SessionContext = createContext<SessionContextValue>(null);

export const useSession = <
    Nullable extends boolean = true
>(): Nullable extends true ? SessionContextValue : DecodedIdToken => {
    const value = useContext(SessionContext);

    return value as Nullable extends true
        ? SessionContextValue
        : DecodedIdToken;
};

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
