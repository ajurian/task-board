import {
    faBan,
    faCalendar,
    faCalendarDay,
    faCalendarDays,
    faSun,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ListItemIcon, MenuList, Popover } from "@mui/material";
import { DateCalendar } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import React, { MouseEventHandler, useId, useMemo, useState } from "react";
import {
    TaskItemDueDateSelectCommon,
    TaskItemDueDateSelectTriggerButton,
} from "./ui";

interface TaskItemDueDateMenuTriggerProps {
    date: Date | null;
    onDateChange: (date: Date | null) => void;
}

function normalizeDate(date: Dayjs) {
    return date
        .add(1, "day")
        .set("hour", 0)
        .set("minute", 0)
        .set("second", 0)
        .set("millisecond", 0)
        .subtract(1, "millisecond");
}

const TaskItemDueDateSelectTrigger = React.forwardRef<
    HTMLButtonElement,
    TaskItemDueDateMenuTriggerProps
>(function TaskItemDueDateSelectTrigger({ date, onDateChange }, ref) {
    const dateValue = useMemo(
        () => (date === null ? null : dayjs(date)),
        [date]
    );
    const [minDate, setMinDate] = useState<Dayjs>(dayjs);
    const [anchorPosition, setAnchorPosition] = useState<{
        left: number;
        top: number;
    } | null>(null);
    const buttonId = useId();
    const popoverId = useId();
    const isOpen = Boolean(anchorPosition);

    const openPopover: MouseEventHandler<HTMLButtonElement> = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();

        setMinDate(dayjs());
        setAnchorPosition({
            left: rect.x,
            top: rect.y + rect.height,
        });
    };

    const closePopover = () => setAnchorPosition(null);

    const handleDateChange = (date: Dayjs | null) => {
        closePopover();
        onDateChange(date === null ? null : normalizeDate(date).toDate());
    };

    return (
        <>
            <TaskItemDueDateSelectTriggerButton
                ref={ref}
                id={buttonId}
                aria-haspopup={true}
                aria-controls={isOpen ? popoverId : undefined}
                aria-expanded={isOpen}
                tabIndex={-1}
                size="small"
                color="warning"
                variant="outlined"
                startIcon={
                    <FontAwesomeIcon
                        icon={faCalendar}
                        style={{ fontSize: "1em" }}
                    />
                }
                onClick={openPopover}
            >
                {date === null ? "No date" : date.toLocaleDateString()}
            </TaskItemDueDateSelectTriggerButton>
            <Popover
                id={popoverId}
                open={isOpen}
                onClose={closePopover}
                anchorReference="anchorPosition"
                anchorPosition={anchorPosition ?? undefined}
                anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
            >
                <MenuList
                    dense
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        p: 2,
                    }}
                >
                    <TaskItemDueDateSelectCommon
                        onClick={() => handleDateChange(dayjs())}
                    >
                        <ListItemIcon
                            sx={{ mr: "1em" }}
                            style={{ minWidth: 0 }}
                        >
                            <FontAwesomeIcon
                                icon={faCalendarDay}
                                style={{ fontSize: "1em" }}
                            />
                        </ListItemIcon>
                        Today
                    </TaskItemDueDateSelectCommon>
                    <TaskItemDueDateSelectCommon
                        onClick={() => handleDateChange(dayjs().add(1, "day"))}
                    >
                        <ListItemIcon
                            sx={{ mr: "1em" }}
                            style={{ minWidth: 0 }}
                        >
                            <FontAwesomeIcon
                                icon={faSun}
                                style={{ fontSize: "1em" }}
                            />
                        </ListItemIcon>
                        Tomorrow
                    </TaskItemDueDateSelectCommon>
                    <TaskItemDueDateSelectCommon
                        onClick={() => handleDateChange(dayjs().add(1, "week"))}
                    >
                        <ListItemIcon
                            sx={{ mr: "1em" }}
                            style={{ minWidth: 0 }}
                        >
                            <FontAwesomeIcon
                                icon={faCalendarDays}
                                style={{ fontSize: "1em" }}
                            />
                        </ListItemIcon>
                        Next week
                    </TaskItemDueDateSelectCommon>
                    <TaskItemDueDateSelectCommon
                        onClick={() => handleDateChange(null)}
                    >
                        <ListItemIcon
                            sx={{ mr: "1em" }}
                            style={{ minWidth: 0 }}
                        >
                            <FontAwesomeIcon
                                icon={faBan}
                                style={{ fontSize: "1em" }}
                            />
                        </ListItemIcon>
                        No date
                    </TaskItemDueDateSelectCommon>
                </MenuList>
                <DateCalendar
                    minDate={minDate}
                    value={dateValue}
                    onChange={handleDateChange}
                    sx={{ backgroundColor: "grey.50" }}
                />
            </Popover>
        </>
    );
});

export default TaskItemDueDateSelectTrigger;
