import { useState } from "react";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import SideButton from "../SideButton";
import ToDoMenu from "./ToDoMenu";
import type { Task } from "../../../../../../types/models";

interface ToDoListProps {
  task: Task;
  disabled?: boolean;
}

const ToDoList = ({ task, disabled }: ToDoListProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  return (
    <>
      <SideButton
        icon={<PlaylistAddCheckIcon />}
        text="To-Do List"
        clickHandle={(e) => setAnchorEl(e.currentTarget)}
        disabled={disabled}
      />
      <ToDoMenu
        taskId={task._id}
        projectId={task.projectId}
        anchorEl={anchorEl}
        handleClose={() => setAnchorEl(null)}
      />
    </>
  );
};

export default ToDoList;
