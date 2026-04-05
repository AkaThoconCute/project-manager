import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import ScheduleIcon from "@mui/icons-material/Schedule";

interface TaskDeadlineIconProps {
  deadline: string;
}

const TaskDeadlineIcon: React.FC<TaskDeadlineIconProps> = ({ deadline }) => {
  const [deadlineClose, setDeadlineClose] = useState(false);

  useEffect(() => {
    if (deadline !== null) {
      const now = new Date();
      const date = new Date(deadline);
      const diffMs = date.getTime() - now.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);
      setDeadlineClose(diffHours <= 23);
    }
  }, [deadline]);

  const date = new Date(deadline);
  const now = new Date();
  const formatted =
    date.getFullYear() === now.getFullYear()
      ? date.toLocaleDateString("en-GB", { day: "numeric", month: "short" })
      : date.toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "2-digit",
        });

  return (
    <Box sx={{ display: "flex", alignItems: "flex-end" }}>
      <ScheduleIcon
        fontSize="small"
        sx={{ color: deadlineClose ? "secondary.main" : "primary.main" }}
      />
      <Typography
        variant="caption"
        sx={{ color: "rgb(117, 117, 117)", marginLeft: "5px" }}
      >
        {formatted}
      </Typography>
    </Box>
  );
};

export default TaskDeadlineIcon;
