import { UseMutateAsyncFunction, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef } from "react";
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
    const onMutateRef = useRef(onMutate);
    const onOptimisticUpdateRef = useRef(onOptimisticUpdate);
    const onMutationStateChangeRef = useRef(onMutationStateChange);

    useEffect(() => {
        onMutateRef.current = onMutate;
    }, [onMutate]);

    useEffect(() => {
        onOptimisticUpdateRef.current = onOptimisticUpdate;
    }, [onOptimisticUpdate]);

    useEffect(() => {
        onMutationStateChangeRef.current = onMutationStateChange;
    }, [onMutationStateChange]);

    return useCallback(
        (options: O) => {
            queryClient.cancelQueries({
                queryKey: ["taskBoard", "taskBoardUser"],
                fetchStatus: "fetching",
                type: "active",
            });

            onOptimisticUpdateRef.current(options);
            onMutationStateChangeRef.current({
                type,
                options,
                onMutate: onMutateRef.current,
            });
        },
        [type, queryClient]
    );
}
