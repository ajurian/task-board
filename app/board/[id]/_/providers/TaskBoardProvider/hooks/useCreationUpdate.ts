import { UseMutateAsyncFunction, useQueryClient } from "@tanstack/react-query";
import { ObjectId } from "bson";
import { useCallback, useEffect, useRef } from "react";
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
        (options: Omit<O, "id">) => {
            const id = new ObjectId().toString();
            const optionsWithId = { id, ...options } as O;

            queryClient.cancelQueries({
                queryKey: ["taskBoard", "taskBoardUser"],
                fetchStatus: "fetching",
                type: "active",
            });

            onOptimisticUpdateRef.current(optionsWithId);
            onMutationStateChangeRef.current({
                type,
                options: optionsWithId,
                onMutate: onMutateRef.current,
            });
        },
        [type, queryClient]
    );
}
