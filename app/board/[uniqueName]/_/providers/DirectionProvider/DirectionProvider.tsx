"use client";

import {
    createContext,
    PropsWithChildren,
    useContext,
    useEffect,
    useState,
} from "react";

export type Direction = "row" | "column";

interface DirectionContextValue {
    direction: Direction;
    toggleDirection: () => void;
}

interface DirectionProviderProps extends PropsWithChildren {}

const DirectionContext = createContext<DirectionContextValue | null>(null);

export const useDirection = () => {
    const value = useContext(DirectionContext);

    if (value === null) {
        throw new Error(
            "`useDirection` hook must be used inside of 'DirectionProvider'."
        );
    }

    return value;
};

export default function DirectionProvider({
    children,
}: DirectionProviderProps) {
    const [direction, setDirection] = useState<Direction>("row");

    const toggleDirection: DirectionContextValue["toggleDirection"] = () =>
        setDirection((direction) => {
            const newDirection = direction === "row" ? "column" : "row";
            localStorage.setItem("board-direction", newDirection);
            return newDirection;
        });

    useEffect(() => {
        if (typeof window === "undefined") {
            setDirection("row");
            return;
        }

        const boardDirection = localStorage.getItem("board-direction");

        if (boardDirection !== "row" && boardDirection !== "column") {
            setDirection("row");
            return;
        }

        setDirection(boardDirection);
    }, []);

    return (
        <DirectionContext.Provider value={{ direction, toggleDirection }}>
            {children}
        </DirectionContext.Provider>
    );
}
