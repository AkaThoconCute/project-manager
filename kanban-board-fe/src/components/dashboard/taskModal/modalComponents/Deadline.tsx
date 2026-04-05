import { useState, useEffect } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { type Dayjs } from 'dayjs';
import ScheduleIcon from '@mui/icons-material/Schedule';
import Box from '@mui/material/Box';
import { taskFieldUpdate } from '../../../../redux/actions/projectActions';
import { useAppDispatch } from '../../../../redux/hooks';
import Loader from '../../../Loader';
import type { Task } from '../../../../types/models';

interface DeadlineProps {
  task: Task;
  disabled: boolean;
}

const Deadline = ({ task, disabled }: DeadlineProps) => {
  const dispatch = useAppDispatch();
  const [deadlineClose, setDeadlineClose] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task.deadline != null) {
      const diffHours = dayjs().diff(dayjs(task.deadline), 'hour');
      diffHours >= -23 ? setDeadlineClose(true) : setDeadlineClose(false);
    }
  }, [task.deadline]);

  const deadlineHandle = (date: Dayjs | null) => {
    if (date !== null) {
      const diffHours = dayjs().diff(date, 'hour');
      diffHours >= -23 ? setDeadlineClose(true) : setDeadlineClose(false);
    }
    setLoading(true);
    const isoDate = date ? date.toISOString() : null;
    dispatch(
      taskFieldUpdate(task._id, task.projectId, isoDate, 'deadline', () =>
        setLoading(false)
      )
    );
  };

  return task.deadline ? (
    <Box
      sx={{
        marginTop: '20px',
        display: 'flex',
        alignItems: 'center',
        '& > svg': { marginRight: '15px' },
      }}
    >
      <ScheduleIcon color="primary" />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box
          sx={{
            position: 'relative',
            width: 140,
            '& input': { cursor: !disabled ? 'pointer' : undefined },
          }}
        >
          <DatePicker
            label="Deadline"
            value={dayjs(task.deadline)}
            onChange={deadlineHandle}
            disabled={loading || disabled}
            slotProps={{
              textField: {
                variant: 'outlined',
                size: 'small',
                sx: {
                  width: 140,
                  '& .MuiInputLabel-root': {
                    color: loading ? '#ccc' : deadlineClose ? 'secondary.main' : 'primary.main',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderWidth: 2,
                    borderColor: loading ? '#ccc' : deadlineClose ? 'secondary.main' : 'primary.main',
                  },
                },
              },
              field: { clearable: true },
            }}
          />
          {loading && <Loader button />}
        </Box>
      </LocalizationProvider>
    </Box>
  ) : null;
};

export default Deadline;
