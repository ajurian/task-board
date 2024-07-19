"use client";

import { UserInfo } from "@/_/common/schema/userInfo";
import { createContext, useContext } from "react";
import {
    UserInfoContextValue,
    UserInfoProviderProps,
} from "./UserInfoProviderTypes";

const UserInfoContext = createContext<UserInfoContextValue>(null);

export const useUserInfo = <
    Nullable extends boolean = true
>(): Nullable extends true ? UserInfoContextValue : UserInfo => {
    const value = useContext(UserInfoContext);
    return value as Nullable extends true ? UserInfoContextValue : UserInfo;
};

export default function UserInfoProvider({
    userInfo,
    children,
}: UserInfoProviderProps) {
    return (
        <UserInfoContext.Provider value={userInfo}>
            {children}
        </UserInfoContext.Provider>
    );
}
