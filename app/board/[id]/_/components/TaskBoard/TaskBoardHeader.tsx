import { faShare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDisclosure, useInputState } from "@mantine/hooks";
import { IconButton } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { useMemo, useRef } from "react";
import { useTaskBoard } from "../../providers/TaskBoardProvider";
import useContentEditable from "./hooks/useContentEditable";
import ShareDialog from "./ShareDialog";
import TaskBoardHeaderMenuTrigger from "./TaskBoardHeaderMenuTrigger";
import {
    TaskBoardHeaderContainer,
    TaskBoardHeaderDisplayNameContainer,
    TaskBoardHeaderDisplayNameInput,
    TaskBoardHeaderDisplayNameText,
} from "./ui";

export default function TaskBoardHeader() {
    const {
        displayName,
        flowDirection,
        canUserRenameTaskBoard,
        renameTaskBoard,
    } = useTaskBoard();

    const [displayNameInput, setDisplayNameInput] = useInputState(displayName);
    const displayNameInputRef = useRef<HTMLTextAreaElement | null>(null);

    const searchParams = useSearchParams();
    const shareParams = useMemo(() => {
        const share = searchParams.get("share");
        return share === null ? [] : share.split(" ");
    }, [searchParams]);

    const [
        isShareDialogOpen,
        { open: openShareDialog, close: closeShareDialog },
    ] = useDisclosure(shareParams.length > 0);

    const { ref, isFocused, contentEditableProps } = useContentEditable({
        isEditDisabled: !canUserRenameTaskBoard,
        onFocus: () => displayNameInputRef.current?.focus(),
        onStateReset: () => setDisplayNameInput(displayName),
        onEdit: () => {
            if (
                displayNameInput.length === 0 ||
                displayNameInput === displayName
            ) {
                return;
            }

            renameTaskBoard({ displayName: displayNameInput });
        },
    });

    return (
        <TaskBoardHeaderContainer
            direction={flowDirection}
            id="task-board-header"
        >
            <TaskBoardHeaderDisplayNameContainer
                {...contentEditableProps}
                ref={ref}
                isFocused={isFocused}
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
            {canUserRenameTaskBoard && (
                <TaskBoardHeaderMenuTrigger
                    onRenameBoard={() => ref.current?.click()}
                    onShareBoard={openShareDialog}
                />
            )}
            {!canUserRenameTaskBoard && (
                <IconButton size="small" onClick={openShareDialog}>
                    <FontAwesomeIcon icon={faShare} />
                </IconButton>
            )}
            <ShareDialog
                shareParams={shareParams}
                isOpen={isShareDialogOpen}
                onClose={closeShareDialog}
            />
        </TaskBoardHeaderContainer>
    );
}
