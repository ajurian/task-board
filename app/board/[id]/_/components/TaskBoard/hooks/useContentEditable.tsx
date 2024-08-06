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
    onStateReset?: () => void;
    onEdit?: () => void;
}

export default function useContentEditable<T extends HTMLElement>({
    isEditDisabled = false,
    onNodeIgnore,
    onFocus,
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
                    onStateReset?.();
                    setFocusedElement(e.currentTarget);
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
                onEdit?.();
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
        [onStateReset, onEdit, focusedElement]
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

        onFocus?.(focusedElement);
    }, [onFocus, focusedElement, previousFocusedElement]);

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

                    onStateReset?.();

                    if (ignoreNode) {
                        setFocusedElement(null);
                        return;
                    }
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

            onEdit?.();
            setFocusedElement(null);
        };

        window.addEventListener("click", onClick);

        return () => window.removeEventListener("click", onClick);
    }, [isEditDisabled, onNodeIgnore, onStateReset, onEdit, focusedElement]);

    return {
        ref,
        isFocused: focusedElement !== null,
        focusedElement,
        contentEditableProps,
    };
}
