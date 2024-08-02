import { UseMutateAsyncFunction, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import {
    NonCreationMutation,
    NonCreationOptions,
    NonCreationType,
} from "../TaskBoardProviderTypes";

interface UseNonCreationUpdateOptions<
    T extends NonCreationType,
    O extends NonCreationOptions[T]
> {
    type: T;
    onMutate: UseMutateAsyncFunction<void, Error, O>;
    onOptimisticUpdate: (options: O) => void;
    onMutationStateChange: (mutation: NonCreationMutation<T, O>) => void;
}

export default function useNonCreationUpdate<
    T extends NonCreationType,
    O extends NonCreationOptions[T]
>({
    type,
    onMutate,
    onOptimisticUpdate,
    onMutationStateChange,
}: UseNonCreationUpdateOptions<T, O>) {
    const queryClient = useQueryClient();

    return useCallback(
        (options: O) => {
            queryClient.cancelQueries({
                queryKey: ["taskBoard", "taskBoardUser"],
                fetchStatus: "fetching",
                type: "active",
            });

            onOptimisticUpdate(options);
            onMutationStateChange({ type, options, onMutate });
        },
        [type, onMutate, onOptimisticUpdate, onMutationStateChange, queryClient]
    );
}
