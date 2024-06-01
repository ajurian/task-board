import { useTaskQuery } from "@/app/board/[uniqueName]/providers/TaskQueryProvider";
import { TaskModel } from "@/schema/task";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Draggable } from "@hello-pangea/dnd";
import { useInputState } from "@mantine/hooks";
import { CircularProgress, IconButton, Typography } from "@mui/material";
import { useMemo, useRef } from "react";
import useContentEditable from "../../hooks/useContentEditable";
import TaskItemMenu from "./TaskItemMenu";
import {
    TaskItemContainer,
    TaskItemDetailsInput,
    TaskItemDetailsText,
    TaskItemLoadingWrapper,
    TaskItemTitleContainer,
    TaskItemTitleInput,
    TaskItemTitleText,
} from "./ui";

export interface TaskItemProps extends TaskModel {
    isMutationPlaceholder?: boolean;
}

export default function TaskItem({
    id,
    order,
    title,
    details,
    isMutationPlaceholder = false,
}: TaskItemProps) {
    const initialTitle = useMemo(() => title.replace(/\\n/g, "\n"), [title]);
    const initialDetails = useMemo(
        () => details.replace(/\\n/g, "\n"),
        [details]
    );

    const [titleInput, setTitleInput] = useInputState(initialTitle);
    const [detailsInput, setDetailsInput] = useInputState(initialDetails);

    const titleRef = useRef<HTMLSpanElement | null>(null);
    const detailsRef = useRef<HTMLSpanElement | null>(null);
    const titleInputRef = useRef<HTMLTextAreaElement | null>(null);
    const detailsInputRef = useRef<HTMLTextAreaElement | null>(null);

    const { editTask } = useTaskQuery();

    const { ref, isFocused, contentEditableProps } = useContentEditable({
        onNodeIgnore: (node): boolean =>
            node !== titleRef.current &&
            node !== detailsRef.current &&
            node !== ref.current,
        onFocus: (node) => {
            if (node === detailsRef.current) {
                detailsInputRef.current?.focus();
                return;
            }

            titleInputRef.current?.focus();
        },
        onStateReset: () => {
            setTitleInput(initialTitle);
            setDetailsInput(initialDetails);
        },
        onEdit: (e) => {
            if (
                e !== null &&
                e.target === detailsInputRef.current &&
                e.shiftKey
            ) {
                return false;
            }

            const isDataValid =
                titleInput.length > 0 && detailsInput.length > 0;
            const hasDataChanged =
                titleInput !== initialTitle || detailsInput !== initialDetails;

            if (isDataValid && hasDataChanged) {
                editTask({ id, title: titleInput, details: detailsInput });
            }

            return true;
        },
    });

    return (
        <Draggable draggableId={id} index={order} isDragDisabled={isFocused}>
            {(
                { draggableProps, dragHandleProps, innerRef },
                { isDragging }
            ) => (
                <TaskItemContainer
                    {...draggableProps}
                    {...dragHandleProps}
                    {...contentEditableProps}
                    ref={(node: HTMLElement) => {
                        innerRef(node);
                        ref.current = node;
                    }}
                    isDragging={isDragging}
                    isFocused={isFocused}
                >
                    <TaskItemTitleContainer>
                        <IconButton
                            size="small"
                            color="success"
                            tabIndex={isFocused ? 0 : -1}
                        >
                            <FontAwesomeIcon icon={faCheck} />
                        </IconButton>
                        <Typography variant="subtitle1">({order})</Typography>
                        <TaskItemTitleInput
                            inputRef={titleInputRef}
                            isContainerFocused={isFocused}
                            value={titleInput}
                            onChange={setTitleInput}
                            onFocus={(e) => e.currentTarget.select()}
                            size="small"
                            multiline
                            fullWidth
                        />
                        <TaskItemTitleText
                            ref={titleRef}
                            isContainerFocused={isFocused}
                            variant="subtitle1"
                        >
                            {initialTitle}
                        </TaskItemTitleText>
                        {isMutationPlaceholder ? (
                            <TaskItemLoadingWrapper>
                                <CircularProgress size={18} color="inherit" />
                            </TaskItemLoadingWrapper>
                        ) : (
                            <TaskItemMenu
                                taskId={id}
                                onEditTask={() => ref.current?.click()}
                            />
                        )}
                    </TaskItemTitleContainer>
                    <TaskItemDetailsInput
                        inputRef={detailsInputRef}
                        isContainerFocused={isFocused}
                        value={detailsInput}
                        onChange={setDetailsInput}
                        onFocus={(e) => e.currentTarget.select()}
                        size="small"
                        multiline
                        fullWidth
                    />
                    <TaskItemDetailsText
                        ref={detailsRef}
                        isContainerFocused={isFocused}
                        variant="body2"
                    >
                        {initialDetails}
                    </TaskItemDetailsText>
                </TaskItemContainer>
            )}
        </Draggable>
    );
}
