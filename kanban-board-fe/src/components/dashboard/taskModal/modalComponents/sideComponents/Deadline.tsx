import { useState } from "react";
import ScheduleIcon from "@mui/icons-material/Schedule";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { type Dayjs } from "dayjs";
import { useAppDispatch } from "../../../../../redux/hooks";
import { taskFieldUpdate } from "../../../../../redux/actions/projectActions";
import SideButton from "./SideButton";
import type { Task } from "../../../../../types/models";

interface DeadlineProps {
  task: Task;
  disabled?: boolean;
}

const Deadline = ({ task, disabled }: DeadlineProps) => {
  const dispatch = useAppDispatch();
  const [pickerOpen, setPickerOpen] = useState(false);

  const updateDeadline = (date: Dayjs | null) => {
    dispatch(
      taskFieldUpdate(
        task._id,
        task.projectId,
        date ? date.toISOString() : null,
        "deadline",
        () => {},
      ),
    );
  };

  return (
    <>
      <SideButton
        icon={<ScheduleIcon />}
        text="Deadline"
        clickHandle={() => setPickerOpen(true)}
        disabled={disabled}
      />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          open={pickerOpen}
          onClose={() => setPickerOpen(false)}
          value={task.deadline ? dayjs(task.deadline) : null}
          onChange={updateDeadline}
          slotProps={{
            textField: { sx: { display: "none" } },
            field: { clearable: Boolean(task.deadline) },
          }}
        />
      </LocalizationProvider>
    </>
  );
};

export default Deadline;
