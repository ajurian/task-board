import { useClickOutside, usePrevious } from "@mantine/hooks";
import React, {
    FocusEventHandler,
    HTMLAttributes,
    KeyboardEventHandler,
    MouseEventHandler,
    useCallback,
    useEffect,
    useLayoutEffect,
    useMemo,
    useState,
} from "react";

interface UseContentEditableOptions<T extends HTMLElement> {
    onNodeIgnore?: (node: HTMLElement) => boolean;
    onFocus?: (node: HTMLElement) => void;
    onStateReset?: () => void;
    onEdit?: (e: React.KeyboardEvent<T> | null) => boolean;
}

export default function useContentEditable<T extends HTMLElement>({
    onNodeIgnore,
    onFocus,
    onStateReset,
    onEdit,
}: UseContentEditableOptions<T>) {
    const [focusedElement, setFocusedElement] = useState<HTMLElement | null>(
        null
    );
    const previousFocusedElement = usePrevious(focusedElement);

    const ref = useClickOutside<T>(() => {
        if (focusedElement === null) {
            return;
        }

        onEdit?.(null);
        setFocusedElement(null);
    }) as React.MutableRefObject<T | null>;

    const onClick: MouseEventHandler<T> = useCallback(
        (e) =>
            setFocusedElement((focusedElement) => {
                if (focusedElement === null) {
                    const ignoreNode =
                        onNodeIgnore?.(e.target as HTMLElement) ?? false;

                    onStateReset?.();

                    if (ignoreNode) {
                        return null;
                    }
                }

                return e.target as HTMLElement;
            }),
        [onNodeIgnore, onStateReset]
    );

    const onKeyDown: KeyboardEventHandler<T> = useCallback(
        (e) => {
            if (e.key === "Enter") {
                if (focusedElement === null) {
                    e.preventDefault();
                    setFocusedElement(e.currentTarget);
                    return;
                }

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
                onStateReset?.();
                setFocusedElement(null);
                return;
            }
        },
        [onEdit, onStateReset, focusedElement]
    );

    const onBlur: FocusEventHandler<T> = useCallback(
        (e) => {
            if (
                focusedElement === null ||
                e.currentTarget.contains(e.relatedTarget)
            ) {
                return;
            }

            setFocusedElement(null);
        },
        [focusedElement]
    );

    const contentEditableProps = useMemo<HTMLAttributes<T>>(
        () => ({
            role: "button",
            tabIndex: 0,
            onClick,
            onKeyDown,
            onBlur,
        }),
        [onClick, onKeyDown, onBlur]
    );

    useLayoutEffect(() => {
        if (focusedElement === null || previousFocusedElement !== null) {
            return;
        }

        onFocus?.(focusedElement);
    }, [onFocus, onStateReset, focusedElement, previousFocusedElement]);

    return {
        ref,
        isFocused: focusedElement !== null,
        focusedElement,
        contentEditableProps,
    };
}
