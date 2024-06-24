import { useClickOutside, usePrevious } from "@mantine/hooks";
import React, {
    FocusEventHandler,
    HTMLAttributes,
    KeyboardEventHandler,
    MouseEventHandler,
    useCallback,
    useLayoutEffect,
    useMemo,
    useState,
} from "react";

interface UseContentEditableOptions<T extends HTMLElement> {
    isEditDisabled?: boolean;
    onNodeIgnore?: (node: HTMLElement) => boolean;
    onFocus?: (node: HTMLElement) => void;
    onStateReset?: () => void;
    onEdit?: (e: React.KeyboardEvent<T> | null) => boolean;
}

export default function useContentEditable<T extends HTMLElement>({
    isEditDisabled = false,
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
                    onStateReset?.();
                    setFocusedElement(e.currentTarget);
                    return;
                }

                const shouldBlur = onEdit?.(e) ?? true;

                if (!shouldBlur) {
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
                (e.currentTarget.contains(e.relatedTarget) &&
                    e.currentTarget !== e.relatedTarget)
            ) {
                return;
            }

            onStateReset?.();
            setFocusedElement(null);
        },
        [onStateReset, focusedElement]
    );

    const contentEditableProps = useMemo<HTMLAttributes<T>>(
        () =>
            isEditDisabled
                ? {}
                : {
                      role: "button",
                      tabIndex: focusedElement === null ? 0 : -1,
                      onClick,
                      onKeyDown,
                      onBlur,
                  },
        [isEditDisabled, onClick, onKeyDown, onBlur, focusedElement]
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
