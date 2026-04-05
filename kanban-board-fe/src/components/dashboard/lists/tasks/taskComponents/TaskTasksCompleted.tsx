import React from "react";
import { Box, Typography } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

interface TaskTasksCompletedProps {
  total: number;
  completed: number;
}

const TaskTasksCompleted: React.FC<TaskTasksCompletedProps> = ({
  total,
  completed,
}) => {
  const taskCompleted = completed === total;
  return (
    <Box
      sx={{
        display: "flex",
        borderRadius: "2px",
        padding: "2px",
        backgroundColor: taskCompleted ? "#2cb908" : undefined,
      }}
    >
      <CheckCircleOutlineIcon
        fontSize="small"
        sx={{ color: taskCompleted ? "#fff" : "#6d6d6d" }}
      />
      <Typography
        variant="caption"
        sx={{
          color: taskCompleted ? "#fff" : "rgb(117, 117, 117)",
          margin: "1px 0 0 4px",
        }}
      >{`${completed}/${total}`}</Typography>
    </Box>
  );
};

export default TaskTasksCompleted;
