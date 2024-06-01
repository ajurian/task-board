import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useInputState } from "@mantine/hooks";
import { InputBase, Typography } from "@mui/material";
import { useDirection } from "../../providers/DirectionProvider";
import { useTaskQuery } from "../../providers/TaskQueryProvider";
import useContentEditable from "./hooks/useContentEditable";
import { TaskListAddContainer, TaskListAddTextContainer } from "./ui";

export default function TaskListAdd() {
    const [titleInput, setTitleInput] = useInputState("");
    const { direction } = useDirection();
    const { addTaskList } = useTaskQuery();

    const { ref, isFocused, contentEditableProps } =
        useContentEditable<HTMLDivElement>({
            onStateReset: () => setTitleInput(""),
            onEdit: () => {
                if (titleInput.length > 0) {
                    addTaskList({ title: titleInput });
                }

                return true;
            },
        });

    return (
        <TaskListAddContainer
            {...contentEditableProps}
            ref={ref}
            direction={direction}
            isFocused={isFocused}
        >
            {isFocused ? (
                <InputBase
                    autoFocus
                    fullWidth
                    size="small"
                    placeholder="New list"
                    inputProps={{ style: { padding: 0 } }}
                    value={titleInput}
                    onChange={setTitleInput}
                />
            ) : (
                <TaskListAddTextContainer>
                    <FontAwesomeIcon icon={faAdd} />
                    <Typography color="inherit">Add new list</Typography>
                </TaskListAddTextContainer>
            )}
        </TaskListAddContainer>
    );
}
