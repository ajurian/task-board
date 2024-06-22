import { DecodedIdToken } from "firebase-admin/auth";
import { PropsWithChildren } from "react";

type SessionContextValue = DecodedIdToken | null;

interface SessionProviderProps extends PropsWithChildren {
    session: DecodedIdToken | null;
}
