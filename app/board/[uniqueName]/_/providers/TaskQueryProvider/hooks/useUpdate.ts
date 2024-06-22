import { UseMutationResult } from "@tanstack/react-query";
import { useCallback } from "react";
import { UpdateOptions } from "../TaskQueryProviderTypes";

interface UseUpdateOptions<T extends UpdateOptions> {
    mutation: UseMutationResult<void, Error, T>;
    onOptimisticUpdate: (options: T) => void;
    onMutationStateChange: (mutation: () => Promise<void>) => void;
}

export default function useUpdate<T extends UpdateOptions>({
    mutation,
    onOptimisticUpdate,
    onMutationStateChange,
}: UseUpdateOptions<T>) {
    return useCallback(
        (options: T) => {
            onOptimisticUpdate(options);
            onMutationStateChange(() => mutation.mutateAsync(options));
        },
        [onOptimisticUpdate, onMutationStateChange, mutation]
    );
}
