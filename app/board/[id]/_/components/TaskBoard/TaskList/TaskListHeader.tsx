import {
    TASK_LIST_TITLE_MAX_LEN,
    TASK_LIST_TITLE_MIN_LEN,
} from "@/_/common/constants/constraints";
import { TaskListModel } from "@/_/common/schema/taskList";
import { useInputState } from "@mantine/hooks";
import { useRef } from "react";
import { TaskBoardContextValue } from "../../../providers/TaskBoardProvider/TaskBoardProviderTypes";
import useContentEditable from "../hooks/useContentEditable";
import TaskListHeaderMenuTrigger from "./TaskListHeaderMenuTrigger";
import {
    TaskListHeaderContainer,
    TaskListHeaderTitleContainer,
    TaskListHeaderTitleInput,
    TaskListHeaderTitleText,
} from "./ui";

interface TaskListHeaderProps
    extends Pick<
        TaskBoardContextValue,
        | "canUserCreateOrDeleteTaskList"
        | "canUserRenameTaskList"
        | "canUserUpdateSortBy"
        | "editTaskList"
        | "deleteTaskList"
    > {
    listId: string;
    title: string;
    sortBy: TaskListModel["sortBy"];
}

export default function TaskListHeader({
    listId,
    title,
    sortBy,
    canUserCreateOrDeleteTaskList,
    canUserRenameTaskList,
    canUserUpdateSortBy,
    editTaskList,
    deleteTaskList,
}: TaskListHeaderProps) {
    const [titleInput, setTitleInput] = useInputState(title);
    const titleInputRef = useRef<HTMLTextAreaElement | null>(null);

    const canUserEditTaskList = canUserRenameTaskList && canUserUpdateSortBy;

    const { ref, isFocused, contentEditableProps } = useContentEditable({
        isEditDisabled: !canUserEditTaskList,
        onFocusAfter: () => titleInputRef.current?.focus(),
        onStateReset: () => setTitleInput(title),
        onEdit: () => {
            if (
                titleInput.length < TASK_LIST_TITLE_MIN_LEN ||
                titleInput === title
            ) {
                return;
            }

            editTaskList({ id: listId, title: titleInput });
        },
    });

    return (
        <TaskListHeaderContainer>
            <TaskListHeaderTitleContainer
                {...contentEditableProps}
                ref={ref}
                isFocused={isFocused}
                onFocus={(e) => e.currentTarget.click()}
                tabIndex={-1}
            >
                {isFocused && (
                    <TaskListHeaderTitleInput
                        inputRef={titleInputRef}
                        value={titleInput}
                        onChange={setTitleInput}
                        onFocus={(e) => e.currentTarget.select()}
                        inputProps={{
                            style: { padding: 0 },
                            maxLength: TASK_LIST_TITLE_MAX_LEN,
                        }}
                        placeholder="Title"
                        size="small"
                        fullWidth
                    />
                )}
                {!isFocused && (
                    <TaskListHeaderTitleText noWrap>
                        {title}
                    </TaskListHeaderTitleText>
                )}
            </TaskListHeaderTitleContainer>
            {(canUserRenameTaskList || canUserCreateOrDeleteTaskList) && (
                <TaskListHeaderMenuTrigger
                    sortBy={sortBy}
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
