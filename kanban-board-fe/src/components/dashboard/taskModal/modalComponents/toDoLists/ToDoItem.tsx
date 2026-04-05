import { useEffect, useState } from "react";
import { Box, Checkbox } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import type { ToDoTask } from "../../../../../types/models";
import ToDoInput from "./ToDoInput";

interface ToDoItemProps {
  task: ToDoTask;
  taskIndex: number;
  updateTaskCheckHandle: (
    check: boolean,
    toDoTaskId: string,
    toDoTaskIndex: number,
  ) => void;
  deleteTaskHandle: (
    toDoTaskId: string,
    taskIndex: number,
    completed: boolean,
  ) => void;
  updateTaskTitleHandle: (
    toDoTaskId: string,
    title: string,
    toDoTaskIndex: number,
    callback: () => void,
  ) => void;
  disabled?: boolean;
}

const ToDoItem = ({
  task,
  taskIndex,
  updateTaskCheckHandle,
  deleteTaskHandle,
  updateTaskTitleHandle,
  disabled,
}: ToDoItemProps) => {
  const [checked, setChecked] = useState(false);

  useEffect(() => setChecked(task.finished), [task.finished]);

  const updateHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(e.target.checked);
    updateTaskCheckHandle(e.target.checked, task._id, taskIndex);
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        borderRadius: "3px",
        padding: "5px 5px",
        position: "relative",
        "&:hover": { backgroundColor: "#e2e2e2" },
        "&:hover .deleteIcon": { display: "block !important" },
      }}
    >
      <Checkbox
        onChange={updateHandle}
        checked={checked}
        disabled={disabled}
        disableRipple
        color="primary"
        style={{ padding: 0, marginTop: 3 }}
      />
      <div
        style={{
          marginLeft: 13,
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <ToDoInput
          taskId={task._id}
          taskIndex={taskIndex}
          initialTitle={task.title}
          taskFinished={task.finished}
          updateTaskTitleHandle={updateTaskTitleHandle}
          disabled={disabled}
        />
        <DeleteIcon
          className="deleteIcon"
          onClick={() => deleteTaskHandle(task._id, taskIndex, task.finished)}
          sx={{
            display: disabled ? "none" : "none",
            padding: "3px",
            borderRadius: "3px",
            color: "#656363",
            position: "absolute",
            bottom: 7,
            right: 7,
            cursor: "pointer",
            "&:hover": { backgroundColor: "#ccc" },
          }}
        />
      </div>
    </Box>
  );
};

export default ToDoItem;
