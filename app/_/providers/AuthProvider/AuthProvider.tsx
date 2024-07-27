"use client";

import pusherClient from "@/_/common/lib/pusherClient";
import ClientAuthTokenAPI from "@/api/_/common/layers/client/AuthTokenAPI";
import ClientUserAPI from "@/api/_/common/layers/client/UserAPI";
import { useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect } from "react";
import { useUserInfo } from "../UserInfoProvider";
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
    const userInfo = useUserInfo();
    const router = useRouter();

    const signIn = useCallback(() => router.push("/auth/login"), [router]);

    const signOut = useCallback(async () => {
        await ClientAuthTokenAPI.delete();
        router.refresh();
    }, [router]);

    useEffect(() => {
        if (userInfo === null) {
            return;
        }

        const controller = new AbortController();

        ClientUserAPI.put(
            userInfo.sub,
            {
                email: userInfo.email,
                displayName: userInfo.name,
                photoURL: userInfo.picture,
            },
            { signal: controller.signal }
        )
            .then(() => pusherClient.signin())
            .catch(() => {});

        return () => controller.abort();
    }, [userInfo]);

    return (
        <AuthContext.Provider value={{ signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}
