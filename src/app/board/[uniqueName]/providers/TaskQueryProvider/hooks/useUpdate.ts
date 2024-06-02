import { UseMutationResult } from "@tanstack/react-query";
import { useCallback } from "react";
import { UpdateOptions } from "../TaskQueryProviderTypes";

interface UseUpdateOptions<T extends UpdateOptions> {
    mutation: UseMutationResult<void, Error, T>;
    onOptimisticUpdate: (options: T) => void;
    onMutationStateUpdate: (mutation: () => Promise<void>) => void;
}

export default function useUpdate<T extends UpdateOptions>({
    mutation,
    onOptimisticUpdate,
    onMutationStateUpdate,
}: UseUpdateOptions<T>) {
    return useCallback(
        (options: T) => {
            onOptimisticUpdate(options);
            onMutationStateUpdate(() => mutation.mutateAsync(options));
        },
        [onOptimisticUpdate, onMutationStateUpdate, mutation]
    );
}
