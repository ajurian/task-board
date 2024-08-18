"use client";

import ClientAuthTokenAPI from "@/api/_/common/layers/client/AuthTokenAPI";
import { useRouter } from "next/navigation";
import { createContext, useCallback, useContext } from "react";
import { AuthContextValue, AuthProviderProps } from "./AuthProviderTypes";

const AuthContext = createContext<AuthContextValue | null>(null);

export const useAuth = () => {
    const value = useContext(AuthContext);

    if (value === null) {
        throw new Error(
            "`useAuth` hook must be used inside of 'AuthProvider'."
        );
    }

    return value;
};

export default function AuthProvider({ children }: AuthProviderProps) {
    const router = useRouter();

    const signIn = useCallback(
        () => router.push(`/auth/login?redirectUri=${location.toString()}`),
        [router]
    );

    const signOut = useCallback(async () => {
        await ClientAuthTokenAPI.delete();
        router.refresh();
    }, [router]);

    return (
        <AuthContext.Provider value={{ signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}
