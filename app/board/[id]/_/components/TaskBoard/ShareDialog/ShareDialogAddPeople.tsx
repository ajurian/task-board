import { PermissionRole } from "@/_/common/constants/permissions";
import { faXmarkCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useInputState } from "@mantine/hooks";
import { Box, Button, Chip, InputBase } from "@mui/material";
import { KeyboardEventHandler, useCallback, useRef, useState } from "react";
import { z } from "zod";
import { useTaskBoard } from "../../../providers/TaskBoardProvider";
import ShareDialogRoleSelect from "./ShareDialogRoleSelect";
import {
    ShareDialogAddPeopleContainer,
    ShareDialogAddPeopleEmailList,
    ShareDialogEmailInputContainer,
} from "./ui";
import ClientTaskBoardAPI from "@/api/_/common/layers/client/TaskBoardAPI";

interface ShareDialogAddPeopleProps {
    emails: string[];
}

export default function ShareDialogAddPeople({
    emails: initialEmails,
}: ShareDialogAddPeopleProps) {
    const [emails, setEmails] = useState<string[]>(initialEmails);
    const [emailInput, setEmailInput] = useInputState("");
    const [role, setRole] = useState<PermissionRole>("viewer");
    const emailInputRef = useRef<HTMLInputElement | null>(null);

    const { id, canUserChangeRole, isUserVisitor } = useTaskBoard();

    const removeEmail = (email: string) =>
        setEmails((emails) => {
            const index = emails.indexOf(email);

            if (index > -1) {
                return emails.toSpliced(index, 1);
            }

            return [...emails];
        });

    const handleEmailInputKeyDown: KeyboardEventHandler<HTMLInputElement> =
        useCallback(
            (e) => {
                if (e.key !== "Enter") {
                    return;
                }

                const { success, data: email } = z
                    .string()
                    .email()
                    .safeParse(e.currentTarget.value.trim());

                if (!success) {
                    return;
                }

                setEmailInput("");

                if (emails.includes(email)) {
                    return;
                }

                setEmails((emails) => [...emails, email]);
            },
            [emails, setEmailInput]
        );

    const [isFetching, setIsFetching] = useState(false);

    const shareBoard = useCallback(async () => {
        setIsFetching(true);

        if (!canUserChangeRole || isUserVisitor) {
            await ClientTaskBoardAPI.requestShareAccess(id, {
                userEmails: emails,
            });
        } else {
            await ClientTaskBoardAPI.shareAccess(id, {
                userEmails: emails,
                role,
            });
        }

        setIsFetching(false);
        setEmails([]);

        id;
        emails;
        role;
    }, [id, emails, role, canUserChangeRole, isUserVisitor]);

    return (
        <ShareDialogAddPeopleContainer>
            <ShareDialogEmailInputContainer
                onClick={() => emailInputRef.current?.focus()}
            >
                <ShareDialogAddPeopleEmailList isEmpty={emails.length === 0}>
                    {emails.map((email, index) => (
                        <Chip
                            variant="outlined"
                            key={index}
                            label={email}
                            deleteIcon={
                                <FontAwesomeIcon icon={faXmarkCircle} />
                            }
                            onDelete={() => removeEmail(email)}
                            onClick={() => removeEmail(email)}
                            clickable
                        />
                    ))}
                </ShareDialogAddPeopleEmailList>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.75 }}>
                    <InputBase
                        inputRef={emailInputRef}
                        value={emailInput}
                        onChange={setEmailInput}
                        onKeyDown={handleEmailInputKeyDown}
                        inputProps={{ style: { padding: 0 } }}
                        placeholder={
                            emails.length === 0 ? "Add people" : undefined
                        }
                        size="small"
                        fullWidth
                    />
                    {emails.length > 0 && (
                        <Button
                            size="small"
                            disabled={isFetching}
                            onClick={shareBoard}
                        >
                            {isFetching ? "Sharing..." : "Share"}
                        </Button>
                    )}
                </Box>
            </ShareDialogEmailInputContainer>
            {canUserChangeRole && !isUserVisitor && emails.length > 0 && (
                <ShareDialogRoleSelect role={role} onChange={setRole} />
            )}
        </ShareDialogAddPeopleContainer>
    );
}
