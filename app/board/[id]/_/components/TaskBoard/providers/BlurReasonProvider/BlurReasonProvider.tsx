"use client";

import { createContext, useContext, useEffect, useRef } from "react";
import {
    BlurReasonContextValue,
    BlurReasonProviderProps,
} from "./BlurReasonProviderTypes";

const BlurReasonContext = createContext<BlurReasonContextValue | null>(null);

export const useBlurReason = () => {
    const value = useContext(BlurReasonContext);

    if (value === null) {
        throw new Error(
            "`useBlurReason` hook must be used inside of 'BlurReasonProvider'."
        );
    }

    return value;
};

export default function BlurReasonProvider({
    children,
}: BlurReasonProviderProps) {
    const blurReasonRef = useRef<"key" | "click" | null>(null);

    useEffect(() => {
        const onMouseDown = () => (blurReasonRef.current = "click");
        const onTouchStart = () => (blurReasonRef.current = "click");
        const onKeyDown = () => (blurReasonRef.current = "key");

        window.addEventListener("mousedown", onMouseDown);
        window.addEventListener("touchstart", onTouchStart);
        window.addEventListener("keydown", onKeyDown);

        return () => {
            window.removeEventListener("mousedown", onMouseDown);
            window.removeEventListener("touchstart", onTouchStart);
            window.removeEventListener("keydown", onKeyDown);
        };
    }, []);

    return (
        <BlurReasonContext.Provider value={blurReasonRef}>
            {children}
        </BlurReasonContext.Provider>
    );
}
