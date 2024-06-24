import { AggregatedTaskModel } from "@/_/schema/task";
import { useTaskBoard } from "@/board/[uniqueName]/_/providers/TaskBoardProvider";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Draggable } from "@hello-pangea/dnd";
import { useInputState } from "@mantine/hooks";
import { Fade, IconButton, Typography, useTheme } from "@mui/material";
import { useMemo, useRef, useState } from "react";
import useContentEditable from "../../hooks/useContentEditable";
import TaskItemMenu from "./TaskItemMenu";
import {
    TaskItemContainer,
    TaskItemDetailsInput,
    TaskItemDetailsText,
    TaskItemTitleContainer,
    TaskItemTitleInput,
    TaskItemTitleText,
} from "./ui";

export interface TaskItemProps extends Omit<AggregatedTaskModel, "isDone"> {
    index: number;
}

export default function TaskItem({
    index,
    id,
    order,
    title,
    details,
    highlights,
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

    const theme = useTheme();
    const [actionAfterFade, setActionAfterFade] = useState<(() => void) | null>(
        null
    );
    const { editTask, deleteTask, searchQuery } = useTaskBoard();

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

    const titleHighlight = useMemo(
        () =>
            highlights.find((highlight) => highlight.path === "title") ?? null,
        [highlights]
    );

    const highlightedTitleText = useMemo(
        () =>
            titleHighlight?.texts.map((text, index) =>
                text.type === "text" ? (
                    text.value
                ) : (
                    <mark key={index}>{text.value}</mark>
                )
            ),
        [titleHighlight?.texts]
    );

    const detailsHighlight = useMemo(
        () =>
            highlights.find((highlight) => highlight.path === "details") ??
            null,
        [highlights]
    );

    const highlightedDetailsText = useMemo(
        () =>
            detailsHighlight?.texts.map((text, index) =>
                text.type === "text" ? (
                    text.value
                ) : (
                    <mark key={index}>{text.value}</mark>
                )
            ),
        [detailsHighlight?.texts]
    );

    return (
        <Draggable
            key={id}
            draggableId={id}
            index={index}
            isDragDisabled={isFocused || searchQuery.length > 0}
        >
            {(
                { draggableProps, dragHandleProps, innerRef },
                { isDragging }
            ) => (
                <Fade
                    in={actionAfterFade === null}
                    timeout={{
                        enter: 0,
                        exit: theme.transitions.duration.leavingScreen,
                    }}
                    onTransitionEnd={(e) => {
                        if (e.target !== e.currentTarget) {
                            return;
                        }

                        actionAfterFade?.();
                        setActionAfterFade(null);
                    }}
                >
                    <div>
                        <TaskItemContainer
                            {...draggableProps}
                            {...dragHandleProps}
                            {...contentEditableProps}
                            ref={(node: HTMLElement | null) => {
                                innerRef(node);
                                ref.current = node;
                            }}
                            isDragging={isDragging}
                            isFocused={isFocused}
                        >
                            <TaskItemTitleContainer>
                                <IconButton
                                    size="small"
                                    color="primary"
                                    tabIndex={isFocused ? 0 : -1}
                                    onClick={() =>
                                        setActionAfterFade(
                                            () => () =>
                                                editTask({ id, isDone: true })
                                        )
                                    }
                                >
                                    <FontAwesomeIcon icon={faCheck} />
                                </IconButton>
                                <Typography variant="subtitle1">
                                    ({order})
                                </Typography>
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
                                <TaskItemMenu
                                    onEdit={() => ref.current?.click()}
                                    onDelete={() =>
                                        setActionAfterFade(
                                            () => () => deleteTask({ id })
                                        )
                                    }
                                />
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
                    </div>
                </Fade>
            )}
        </Draggable>
    );
}
