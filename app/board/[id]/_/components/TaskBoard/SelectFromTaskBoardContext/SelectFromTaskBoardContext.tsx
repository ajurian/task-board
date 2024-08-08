"use client";

import React, { memo } from "react";
import { TaskBoardContextValue } from "../../../providers/TaskBoardProvider/TaskBoardProviderTypes";
import { useTaskBoard } from "../../../providers/TaskBoardProvider";
import _ from "lodash";

interface SelectFromTaskBoardContextProps<T> {
    selector: (context: TaskBoardContextValue) => T;
    children: (props: T) => React.ReactNode;
}

interface MemoizeProps<T> {
    children: (props: T) => React.ReactNode;
    selectedValue: T;
}

const Memoize = memo<MemoizeProps<any>>(function Memoize<T>({
    children,
    selectedValue,
}: MemoizeProps<T>) {
    return children(selectedValue);
},
_.isEqual);

export default function SelectFromTaskBoardContext<T>({
    selector,
    children,
}: SelectFromTaskBoardContextProps<T>) {
    const context = useTaskBoard();
    const selectedValue = selector(context);

    return <Memoize selectedValue={selectedValue}>{children}</Memoize>;
}
