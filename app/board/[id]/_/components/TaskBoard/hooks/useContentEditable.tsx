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

interface UseContentEditableOptions {
    isEditDisabled?: boolean;
    onNodeIgnore?: (node: HTMLElement) => boolean;
    onFocus?: (node: HTMLElement) => void;
    onFocusAfter?: (node: HTMLElement) => void;
    onStateReset?: () => void;
    onEdit?: () => void;
}

export default function useContentEditable<T extends HTMLElement>({
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
    const ref = useRef<T | null>(null);

    const onKeyUp: KeyboardEventHandler<T> = useCallback(
        (e) => {
            if (e.key === "Enter") {
                if (focusedElement === null) {
                    e.preventDefault();
                    setFocusedElement(e.currentTarget);
                    onFocus?.(e.currentTarget);
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
                setFocusedElement(null);
                onEdit?.();

                return;
            }

            if (e.key === "Escape") {
                e.preventDefault();
                setFocusedElement(null);
                onStateReset?.();
                return;
            }
        },
        [onFocus, onStateReset, onEdit, focusedElement]
    );

    const onBlur: FocusEventHandler<T> = useCallback(
        (e) => {
            if (
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

            console.log("?");
            setFocusedElement(null);
            onStateReset?.();
        },
        [onStateReset, focusedElement]
    );

    const contentEditableProps = useMemo<HTMLAttributes<T>>(
        () =>
            isEditDisabled
                ? {}
                : {
                      role: focusedElement === null ? "button" : undefined,
                      tabIndex: focusedElement === null ? 0 : -1,
                      onKeyUp,
                      onBlur,
                  },
        [isEditDisabled, onKeyUp, onBlur, focusedElement]
    );

    useLayoutEffect(() => {
        if (focusedElement === null || previousFocusedElement !== null) {
            return;
        }

        onFocusAfter?.(focusedElement);
    }, [onFocusAfter, focusedElement, previousFocusedElement]);

    useEffect(() => {
        const localElement = ref.current;

        if (isEditDisabled || localElement === null) {
            return;
        }

        const onClick = (e: MouseEvent) => {
            const eventTarget = e.target as HTMLElement;

            if (localElement.contains(eventTarget)) {
                if (focusedElement === null) {
                    const ignoreNode =
                        onNodeIgnore?.(e.target as HTMLElement) ?? false;

                    if (ignoreNode) {
                        return;
                    }

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
            onStateReset?.();
            onEdit?.();
        };

        window.addEventListener("click", onClick);

        return () => window.removeEventListener("click", onClick);
    }, [
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
