import { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { useAppDispatch } from "../../../../../redux/hooks";
import {
  projectTaskArchive,
  projectTaskDelete,
} from "../../../../../redux/actions/projectActions";
import SideButton from "./SideButton";
import DeleteMenu from "../../../shared/DeleteMenu";
import type { Task } from "../../../../../types/models";

interface ArchiveProps {
  task: Task;
  listIndex: number | false;
  taskIndex: number | false;
}

const Archive = ({ task, listIndex, taskIndex }: ArchiveProps) => {
  const dispatch = useAppDispatch();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const archiveHandle = () => {
    if (typeof listIndex !== "number" || typeof taskIndex !== "number") return;
    dispatch(
      projectTaskArchive(task._id, task.projectId, taskIndex, listIndex),
    );
  };

  const deleteTaskHandle = () => {
    if (typeof taskIndex !== "number") return;
    dispatch(projectTaskDelete(task._id, taskIndex, () => setAnchorEl(null)));
  };

  return (
    <>
      {task.archived ? (
        <SideButton
          icon={<HighlightOffIcon />}
          text="Delete"
          secondary
          clickHandle={(e) => setAnchorEl(e.currentTarget)}
        />
      ) : (
        <SideButton
          icon={<DeleteIcon />}
          text="Archive"
          clickHandle={archiveHandle}
        />
      )}
      <DeleteMenu
        anchorEl={anchorEl}
        handleClose={() => setAnchorEl(null)}
        headerTitle="Delete task?"
        deleteHandle={deleteTaskHandle}
        text="Deleting a task cannot be undone, are you sure?"
      />
    </>
  );
};

export default Archive;
