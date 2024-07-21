"use client";

import { faSearch, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconButton, InputAdornment, OutlinedInput } from "@mui/material";
import {
    ChangeEventHandler,
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
import { useTaskBoard } from "../../providers/TaskBoardProvider";

export default function HeaderSearchInput() {
    const { setSearchQuery, searchQuery } = useTaskBoard();
    const [searchQueryInput, setSearchQueryInput] = useState(searchQuery);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const updateSearchQuery = useCallback(
        (value: string, debounce: boolean = true) => {
            if (timeoutRef.current !== null) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }

            setSearchQueryInput(value);

            if (!debounce) {
                setSearchQuery(value);
                return;
            }

            timeoutRef.current = setTimeout(() => setSearchQuery(value), 1500);
        },
        [setSearchQuery]
    );

    const handleInputChange: ChangeEventHandler<HTMLInputElement> = (e) =>
        updateSearchQuery(e.currentTarget.value);

    const clearInput = () => {
        updateSearchQuery("");
        inputRef.current?.focus();
    };

    useEffect(() => {
        const input = inputRef.current;

        const handleKeyDownWindow = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.key === "f") {
                e.preventDefault();
                input?.focus();
                input?.select();
            }
        };

        const handleKeyDownInput = (e: KeyboardEvent) => {
            if (e.key === "Enter") {
                e.preventDefault();
                updateSearchQuery(searchQueryInput, false);
            }
        };

        window.addEventListener("keydown", handleKeyDownWindow);
        input?.addEventListener("keydown", handleKeyDownInput);

        return () => {
            window.removeEventListener("keydown", handleKeyDownWindow);
            input?.removeEventListener("keydown", handleKeyDownInput);
        };
    }, [searchQueryInput, updateSearchQuery]);

    return (
        <OutlinedInput
            inputRef={inputRef}
            placeholder="Search"
            type="text"
            name="search"
            size="small"
            value={searchQueryInput}
            onChange={handleInputChange}
            sx={(theme) => ({
                display: "none",
                [theme.breakpoints.up("sm")]: {
                    display: "inline-flex",
                    width: theme.spacing(72),
                },
                [theme.breakpoints.up("md")]: {
                    width: theme.spacing(96),
                },
                [theme.breakpoints.up("lg")]: {
                    width: theme.spacing(112),
                },
                [theme.breakpoints.up("xl")]: {
                    width: theme.spacing(128),
                },
            })}
            startAdornment={
                <InputAdornment position="start" variant="outlined">
                    <IconButton
                        size="small"
                        tabIndex={-1}
                        onClick={() =>
                            updateSearchQuery(searchQueryInput, false)
                        }
                    >
                        <FontAwesomeIcon icon={faSearch} />
                    </IconButton>
                </InputAdornment>
            }
            endAdornment={
                searchQueryInput.length > 0 && (
                    <InputAdornment position="end" variant="outlined">
                        <IconButton
                            size="small"
                            tabIndex={-1}
                            onClick={clearInput}
                        >
                            <FontAwesomeIcon icon={faXmark} />
                        </IconButton>
                    </InputAdornment>
                )
            }
        />
    );
}
