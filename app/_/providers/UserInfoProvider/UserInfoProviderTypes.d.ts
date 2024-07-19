import { UserInfo } from "@/_/common/schema/userInfo";
import { PropsWithChildren } from "react";

type UserInfoContextValue = UserInfo | null;

interface UserInfoProviderProps extends PropsWithChildren {
    userInfo: UserInfo | null;
}
