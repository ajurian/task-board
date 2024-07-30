import { UseMutateAsyncFunction, useQueryClient } from "@tanstack/react-query";
import { ObjectId } from "bson";
import { useCallback } from "react";
import {
    CreationMutation,
    CreationOptions,
    CreationType,
} from "../TaskBoardProviderTypes";

interface UseCreationUpdateOptions<
    T extends CreationType,
    O extends CreationOptions[T]
> {
    type: T;
    onMutate: UseMutateAsyncFunction<void, Error, O>;
    onOptimisticUpdate: (options: O) => void;
    onMutationStateChange: (mutation: CreationMutation<T, O>) => void;
}

export default function useCreationUpdate<
    T extends CreationType,
    O extends CreationOptions[T]
>({
    type,
    onMutate,
    onOptimisticUpdate,
    onMutationStateChange,
}: UseCreationUpdateOptions<T, O>) {
    const queryClient = useQueryClient();

    return useCallback(
        (options: Omit<O, "id">) => {
            const id = new ObjectId().toString();
            const optionsWithId = { id, ...options } as O;

            queryClient.cancelQueries({
                queryKey: ["taskBoard", "taskBoardUser"],
                fetchStatus: "fetching",
                type: "active",
            });

            onOptimisticUpdate(optionsWithId);
            onMutationStateChange({
                type,
                options: optionsWithId,
                onMutate,
            });
        },
        [onOptimisticUpdate, onMutationStateChange, type, onMutate, queryClient]
    );
}
