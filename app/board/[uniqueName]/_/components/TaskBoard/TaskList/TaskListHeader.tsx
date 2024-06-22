import { useTaskQuery } from "@/board/[uniqueName]/_/providers/TaskQueryProvider";
import { useInputState } from "@mantine/hooks";
import { useRef } from "react";
import useContentEditable from "../hooks/useContentEditable";
import TaskListMenu from "./TaskListMenu";
import {
    TaskListHeaderContainer,
    TaskListHeaderTitleContainer,
    TaskListHeaderTitleInput,
    TaskListHeaderTitleText,
} from "./ui";

interface TaskListHeaderProps {
    listId: string;
    title: string;
}

export default function TaskListHeader({ listId, title }: TaskListHeaderProps) {
    const [titleInput, setTitleInput] = useInputState(title);
    const titleInputRef = useRef<HTMLTextAreaElement | null>(null);

    const { renameTaskList } = useTaskQuery();

    const { ref, isFocused, contentEditableProps } = useContentEditable({
        onFocus: () => titleInputRef.current?.focus(),
        onStateReset: () => setTitleInput(title),
        onEdit: () => {
            if (titleInput.length > 0 && titleInput !== title) {
                renameTaskList({ id: listId, title: titleInput });
            }

            return true;
        },
    });

    return (
        <TaskListHeaderContainer>
            <TaskListHeaderTitleContainer
                {...contentEditableProps}
                ref={ref}
                isFocused={isFocused}
                onFocus={() => ref.current?.click()}
            >
                <TaskListHeaderTitleInput
                    inputRef={titleInputRef}
                    isContainerFocused={isFocused}
                    value={titleInput}
                    onChange={setTitleInput}
                    onFocus={(e) => e.currentTarget.select()}
                    inputProps={{ style: { padding: 0 } }}
                    size="small"
                    fullWidth
                />
                <TaskListHeaderTitleText isContainerFocused={isFocused} noWrap>
                    {title}
                </TaskListHeaderTitleText>
            </TaskListHeaderTitleContainer>
            <TaskListMenu
                listId={listId}
                onRenameTitle={() => ref.current?.click()}
            />
        </TaskListHeaderContainer>
    );
}
