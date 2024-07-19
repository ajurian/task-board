import { UseMutationResult } from "@tanstack/react-query";
import ObjectID from "bson-objectid";
import { useCallback } from "react";
import { InsertOptions } from "../TaskBoardProviderTypes";

interface UseInsertOptions<T extends InsertOptions> {
    mutation: UseMutationResult<void, Error, T>;
    onOptimisticUpdate: (options: T) => void;
    onMutationStateChange: (mutation: () => Promise<void>) => void;
}

export default function useInsert<T extends InsertOptions>({
    mutation,
    onOptimisticUpdate,
    onMutationStateChange,
}: UseInsertOptions<T>) {
    return useCallback(
        (options: Omit<T, "id">) => {
            const id = ObjectID().toHexString();
            const optionsWithId = { id, ...options } as T;

            onOptimisticUpdate(optionsWithId);
            onMutationStateChange(() => mutation.mutateAsync(optionsWithId));
        },
        [onOptimisticUpdate, onMutationStateChange, mutation]
    );
}
