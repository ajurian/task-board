import { UseMutationResult, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { UpdateOptions } from "../TaskBoardProviderTypes";

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
    const queryClient = useQueryClient();

    return useCallback(
        (options: T) => {
            queryClient.cancelQueries({
                queryKey: ["taskBoard", "taskBoardUser"],
            });

            onOptimisticUpdate(options);
            onMutationStateChange(() => mutation.mutateAsync(options));
        },
        [onOptimisticUpdate, onMutationStateChange, mutation, queryClient]
    );
}
