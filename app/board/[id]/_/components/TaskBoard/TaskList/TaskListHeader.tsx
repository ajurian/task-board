import {
    PERMISSION_TASK_LIST_CREATE_DELETE,
    PERMISSION_TASK_LIST_UPDATE_TITLE,
} from "@/_/common/constants/permissions";
import { useInputState } from "@mantine/hooks";
import { useRef } from "react";
import { useTaskBoard } from "../../../providers/TaskBoardProvider";
import useContentEditable from "../hooks/useContentEditable";
import TaskListHeaderMenu from "./TaskListHeaderMenu";
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

    const {
        canUserCreateOrDeleteTaskList,
        canUserRenameTaskList,
        renameTaskList,
        deleteTaskList,
    } = useTaskBoard();

    const { ref, isFocused, contentEditableProps } = useContentEditable({
        isEditDisabled: !canUserRenameTaskList,
        onFocus: () => titleInputRef.current?.focus(),
        onStateReset: () => setTitleInput(title),
        onEdit: () => {
            if (titleInput.length === 0 || titleInput === title) {
                return;
            }

            renameTaskList({ id: listId, title: titleInput });
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
                    placeholder="Title"
                    size="small"
                    fullWidth
                />
                <TaskListHeaderTitleText isContainerFocused={isFocused} noWrap>
                    {title}
                </TaskListHeaderTitleText>
            </TaskListHeaderTitleContainer>
            {(canUserRenameTaskList || canUserCreateOrDeleteTaskList) && (
                <TaskListHeaderMenu
                    onRenameTitle={
                        canUserRenameTaskList
                            ? () => ref.current?.click()
                            : undefined
                    }
                    onDeleteTitle={
                        canUserCreateOrDeleteTaskList
                            ? () => deleteTaskList({ id: listId })
                            : undefined
                    }
                />
            )}
        </TaskListHeaderContainer>
    );
}
