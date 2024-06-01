import { useClickOutside, usePrevious } from "@mantine/hooks";
import React, {
    HTMLAttributes,
    KeyboardEventHandler,
    MouseEventHandler,
    useCallback,
    useLayoutEffect,
    useMemo,
    useState,
} from "react";

interface UseContentEditableOptions<T extends HTMLElement> {
    onIgnoreNode?: (node: HTMLElement) => boolean;
    onFocus?: (node: HTMLElement) => void;
    onCancel?: () => void;
    onEdit?: (e: React.KeyboardEvent<T> | null) => boolean;
}

export default function useContentEditable<T extends HTMLElement>({
    onIgnoreNode,
    onFocus,
    onCancel,
    onEdit,
}: UseContentEditableOptions<T>) {
    const [focusedElement, setFocusedElement] = useState<HTMLElement | null>(
        null
    );
    const previousFocusedElement = usePrevious(focusedElement);

    const ref = useClickOutside<T>(() => {
        onEdit?.(null);
        setFocusedElement(null);
    }) as React.MutableRefObject<T | null>;

    const onClick: MouseEventHandler<T> = useCallback(
        (e) =>
            setFocusedElement((focusedElement) => {
                if (
                    focusedElement === null &&
                    onIgnoreNode !== undefined &&
                    onIgnoreNode(e.target as HTMLElement)
                ) {
                    return null;
                }

                return e.target as HTMLElement;
            }),
        [onIgnoreNode]
    );

    const onKeyDown: KeyboardEventHandler<T> = useCallback(
        (e) => {
            if (e.key === "Enter") {
                const shouldContinue = onEdit?.(e) ?? true;

                if (!shouldContinue) {
                    return;
                }

                e.preventDefault();
                setFocusedElement(null);
                return;
            }

            if (e.key === "Escape") {
                e.preventDefault();
                onCancel?.();
                setFocusedElement(null);
                return;
            }
        },
        [onEdit, onCancel]
    );

    const contentEditableProps = useMemo<HTMLAttributes<T>>(
        () => ({ onClick, onKeyDown }),
        [onClick, onKeyDown]
    );

    useLayoutEffect(() => {
        if (focusedElement === null || previousFocusedElement !== null) {
            return;
        }

        onFocus?.(focusedElement);
    }, [onFocus, focusedElement, previousFocusedElement]);

    return {
        ref,
        isFocused: focusedElement !== null,
        focusedElement,
        contentEditableProps,
    };
}
