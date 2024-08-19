import { PropsWithChildren, RefObject } from "react";

type BlurReasonContextValue = RefObject<"key" | "click" | null>;

interface BlurReasonProviderProps extends PropsWithChildren {}
