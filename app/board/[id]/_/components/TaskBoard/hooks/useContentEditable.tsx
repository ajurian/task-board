import { usePrevious } from "@mantine/hooks";
import {
    FocusEventHandler,
    HTMLAttributes,
    KeyboardEventHandler,
    useCallback,
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { useBlurReason } from "../providers/BlurReasonProvider";

interface UseContentEditableOptions {
    isFocusable?: boolean;
    isEditDisabled?: boolean;
    onNodeIgnore?: (node: HTMLElement) => boolean;
    onFocus?: (node: HTMLElement) => void;
    onFocusAfter?: (node: HTMLElement) => void;
    onStateReset?: () => void;
    onEdit?: () => void;
}

export default function useContentEditable<T extends HTMLElement>({
    isFocusable = true,
    isEditDisabled = false,
    onNodeIgnore,
    onFocus,
    onFocusAfter,
    onStateReset,
    onEdit,
}: UseContentEditableOptions) {
    const [focusedElement, setFocusedElement] = useState<HTMLElement | null>(
        null
    );
    const previousFocusedElement = usePrevious(focusedElement);
    const blurReasonRef = useBlurReason();
    const ref = useRef<T | null>(null);

    const onKeyUp: KeyboardEventHandler<T> = useCallback(
        (e) => {
            if (e.key === "Enter") {
                if (focusedElement === null) {
                    e.preventDefault();

                    if (!isFocusable) {
                        return;
                    }

                    setFocusedElement(e.currentTarget);
                    onFocus?.(e.currentTarget);

                    if (isEditDisabled) {
                        return;
                    }

                    onStateReset?.();
                    return;
                }

                const target = e.target as HTMLTextAreaElement;

                if (
                    target.type === "textarea" &&
                    !Boolean(target.dataset["disableMultiline"])
                ) {
                    return;
                }

                e.preventDefault();

                if (!isFocusable) {
                    return;
                }

                setFocusedElement(null);

                if (isEditDisabled) {
                    return;
                }

                onEdit?.();
                return;
            }

            if (e.key === "Escape") {
                e.preventDefault();

                if (!isFocusable) {
                    return;
                }

                setFocusedElement(null);

                if (isEditDisabled) {
                    return;
                }

                onStateReset?.();
                return;
            }
        },
        [
            isFocusable,
            isEditDisabled,
            onFocus,
            onStateReset,
            onEdit,
            focusedElement,
        ]
    );

    const onBlur: FocusEventHandler<T> = useCallback(
        (e) => {
            if (
                !isFocusable ||
                focusedElement === null ||
                e.relatedTarget === null ||
                (e.currentTarget.contains(e.relatedTarget) &&
                    e.currentTarget !== e.relatedTarget)
            ) {
                return;
            }

            const popover = document.querySelector(".MuiPopover-root");

            if (popover !== null && popover.contains(e.relatedTarget)) {
                return;
            }

            if (isEditDisabled || blurReasonRef.current === "click") {
                return;
            }

            setFocusedElement(null);
            onStateReset?.();
        },
        [
            isFocusable,
            isEditDisabled,
            onStateReset,
            focusedElement,
            blurReasonRef,
        ]
    );

    const contentEditableProps = useMemo<HTMLAttributes<T>>(
        () =>
            isFocusable
                ? {
                      role: focusedElement === null ? "button" : undefined,
                      tabIndex: focusedElement === null ? 0 : -1,
                      onKeyUp,
                      onBlur,
                  }
                : {},
        [isFocusable, onKeyUp, onBlur, focusedElement]
    );

    useLayoutEffect(() => {
        if (
            !isFocusable ||
            focusedElement === null ||
            previousFocusedElement !== null
        ) {
            return;
        }

        onFocusAfter?.(focusedElement);
    }, [isFocusable, onFocusAfter, focusedElement, previousFocusedElement]);

    useEffect(() => {
        const localElement = ref.current;

        if (localElement === null) {
            return;
        }

        const onClick = (e: MouseEvent) => {
            const eventTarget = e.target as HTMLElement;

            if (localElement.contains(eventTarget)) {
                if (!isFocusable) {
                    return;
                }

                if (focusedElement === null) {
                    const ignoreNode =
                        onNodeIgnore?.(e.target as HTMLElement) ?? false;

                    if (ignoreNode) {
                        return;
                    }

                    onStateReset?.();
                    onFocus?.(eventTarget);
                }

                setFocusedElement(eventTarget);
                return;
            }

            if (focusedElement === null) {
                return;
            }

            const popover = document.querySelector(".MuiPopover-root");

            if (popover !== null && popover.contains(e.target as Node)) {
                return;
            }

            setFocusedElement(null);

            if (isEditDisabled) {
                return;
            }

            onEdit?.();
        };

        window.addEventListener("click", onClick, true);

        return () => window.removeEventListener("click", onClick, true);
    }, [
        isFocusable,
        isEditDisabled,
        onNodeIgnore,
        onFocus,
        onStateReset,
        onEdit,
        focusedElement,
    ]);

    return {
        ref,
        isFocused: focusedElement !== null,
        focusedElement,
        contentEditableProps,
    };
}
