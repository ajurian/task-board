"use client";

import { DragDropContext, OnDragEndResponder } from "@hello-pangea/dnd";
import { PropsWithChildren } from "react";
import { useTaskBoard } from "../TaskBoardProvider";

export default function DragDropProvider({ children }: PropsWithChildren) {
    const { moveTaskList, moveTask } = useTaskBoard();

    const handleDragEnd: OnDragEndResponder = ({
        source,
        destination,
        type,
    }) => {
        if (
            destination === null ||
            (source.droppableId === destination.droppableId &&
                source.index === destination.index)
        ) {
            return;
        }

        const fromIndex = source.index;
        const toIndex = destination.index;

        if (type === "taskList") {
            moveTaskList({ fromIndex, toIndex });
            return;
        }

        if (type === "task") {
            const fromListIndex = Number(source.droppableId);
            const toListIndex = Number(destination.droppableId);

            moveTask({ fromListIndex, toListIndex, fromIndex, toIndex });
        }
    };

    return (
        <DragDropContext onDragEnd={handleDragEnd}>{children}</DragDropContext>
    );
}
