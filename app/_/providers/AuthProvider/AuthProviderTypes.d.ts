import { PropsWithChildren } from "react";

interface AuthContextValue {
    signIn: () => void;
    signOut: () => void;
}

interface AuthProviderProps extends PropsWithChildren {}
