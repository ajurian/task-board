import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useInputState } from "@mantine/hooks";
import { IconButton } from "@mui/material";
import { useRef } from "react";
import { useDirection } from "../../providers/DirectionProvider";
import { useTaskBoard } from "../../providers/TaskBoardProvider";
import useContentEditable from "./hooks/useContentEditable";
import {
    TaskBoardHeaderContainer,
    TaskBoardHeaderDisplayNameContainer,
    TaskBoardHeaderDisplayNameInput,
    TaskBoardHeaderDisplayNameText,
} from "./ui";

export default function TaskBoardHeader() {
    const { direction } = useDirection();
    const { uniqueName, displayName, renameTaskBoard } = useTaskBoard();
    const [displayNameInput, setDisplayNameInput] = useInputState(displayName);
    const displayNameInputRef = useRef<HTMLTextAreaElement | null>(null);

    const { ref, isFocused, contentEditableProps } = useContentEditable({
        isEditDisabled: uniqueName === "main",
        onFocus: () => displayNameInputRef.current?.focus(),
        onStateReset: () => setDisplayNameInput(displayName),
        onEdit: () => {
            if (
                displayNameInput.length > 0 &&
                displayNameInput !== displayName
            ) {
                renameTaskBoard({ displayName: displayNameInput });
            }

            return true;
        },
    });

    return (
        <TaskBoardHeaderContainer direction={direction}>
            <TaskBoardHeaderDisplayNameContainer
                {...contentEditableProps}
                ref={ref}
            >
                <TaskBoardHeaderDisplayNameInput
                    inputRef={displayNameInputRef}
                    isContainerFocused={isFocused}
                    value={displayNameInput}
                    onChange={setDisplayNameInput}
                    onFocus={(e) => e.currentTarget.select()}
                    inputProps={{ style: { paddingBlock: 1.625 } }}
                    size="small"
                    fullWidth
                />
                <TaskBoardHeaderDisplayNameText
                    variant="h6"
                    isContainerFocused={isFocused}
                >
                    {displayName}
                </TaskBoardHeaderDisplayNameText>
            </TaskBoardHeaderDisplayNameContainer>
            <IconButton size="small" tabIndex={-1}>
                <FontAwesomeIcon icon={faEllipsisVertical} />
            </IconButton>
        </TaskBoardHeaderContainer>
    );
}
