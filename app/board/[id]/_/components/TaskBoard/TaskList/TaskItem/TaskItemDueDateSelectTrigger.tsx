import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Button, Popover } from "@mui/material";
import { DateCalendar } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { MouseEventHandler, useId, useMemo, useState } from "react";
import { TaskItemDueDateSelectCommon } from "./ui";

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

export default function TaskItemDueDateSelectTrigger({
    date,
    onDateChange,
}: TaskItemDueDateMenuTriggerProps) {
    const dateValue = useMemo(
        () => (date === null ? null : dayjs(date)),
        [date]
    );
    const [minDate, setMinDate] = useState<Dayjs>(dayjs);
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const buttonId = useId();
    const popoverId = useId();
    const isOpen = Boolean(anchorEl);

    const openPopover: MouseEventHandler<HTMLButtonElement> = (e) => {
        setMinDate(dayjs());
        setAnchorEl(e.currentTarget);
    };

    const handleDateChange = (date: Dayjs | null) => {
        setAnchorEl(null);
        onDateChange(date === null ? null : normalizeDate(date).toDate());
    };

    return (
        <>
            <Button
                id={buttonId}
                aria-haspopup={true}
                aria-controls={isOpen ? popoverId : undefined}
                aria-expanded={isOpen}
                tabIndex={-1}
                size="small"
                color="warning"
                startIcon={
                    <FontAwesomeIcon
                        icon={faCalendar}
                        style={{ fontSize: "1em" }}
                    />
                }
                onClick={openPopover}
                sx={{ px: 2.5, py: 0.25, borderRadius: "100vw" }}
            >
                {date === null ? "No date" : date.toLocaleDateString()}
            </Button>
            <Popover
                id={popoverId}
                anchorEl={anchorEl}
                open={isOpen}
                onClose={() => setAnchorEl(null)}
            >
                <Box sx={{ display: "flex", gap: 1, p: 1 }}>
                    <TaskItemDueDateSelectCommon
                        size="small"
                        onClick={() => handleDateChange(dayjs())}
                    >
                        Today
                    </TaskItemDueDateSelectCommon>
                    <TaskItemDueDateSelectCommon
                        size="small"
                        onClick={() => handleDateChange(dayjs().add(1, "day"))}
                    >
                        Tomorrow
                    </TaskItemDueDateSelectCommon>
                    <TaskItemDueDateSelectCommon
                        size="small"
                        onClick={() => handleDateChange(dayjs().add(1, "week"))}
                    >
                        Next week
                    </TaskItemDueDateSelectCommon>
                    <TaskItemDueDateSelectCommon
                        size="small"
                        onClick={() => handleDateChange(null)}
                    >
                        No date
                    </TaskItemDueDateSelectCommon>
                </Box>
                <DateCalendar
                    minDate={minDate}
                    value={dateValue}
                    onChange={handleDateChange}
                />
            </Popover>
        </>
    );
}
