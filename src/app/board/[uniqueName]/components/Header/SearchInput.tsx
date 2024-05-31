"use client";

import { faSearch, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDebouncedCallback } from "@mantine/hooks";
import { IconButton, InputAdornment, OutlinedInput } from "@mui/material";
import { ChangeEventHandler, useEffect, useRef, useState } from "react";

export default function SearchInput() {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const submitFormWithDelay = useDebouncedCallback(() => {}, 1500);

    const handleInput: ChangeEventHandler<HTMLInputElement> = (e) => {
        setSearchQuery(e.currentTarget.value);
        submitFormWithDelay();
    };

    const clearInput = () => {
        setSearchQuery("");
        inputRef.current?.click();
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.key === "f") {
                e.preventDefault();
                inputRef.current?.click();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    return (
        <OutlinedInput
            ref={inputRef}
            value={searchQuery}
            placeholder="Search"
            type="search"
            name="search"
            size="small"
            onChange={handleInput}
            sx={(theme) => ({ width: theme.spacing(124) })}
            startAdornment={
                <InputAdornment position="start" variant="outlined">
                    <IconButton size="small" tabIndex={-1} onClick={() => {}}>
                        <FontAwesomeIcon icon={faSearch} />
                    </IconButton>
                </InputAdornment>
            }
            endAdornment={
                searchQuery.length > 0 && (
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
