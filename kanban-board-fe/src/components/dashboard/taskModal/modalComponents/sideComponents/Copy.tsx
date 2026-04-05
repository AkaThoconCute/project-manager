import { useState } from "react";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import Menu from "@mui/material/Menu";
import { useAppDispatch } from "../../../../../redux/hooks";
import { copyTask } from "../../../../../redux/actions/projectActions";
import TransferTasks from "../../../lists/listMore/TransferTasks";
import SideButton from "./SideButton";
import type { Task } from "../../../../../types/models";

interface CopyProps {
  task: Task;
}

const Copy = ({ task }: CopyProps) => {
  const dispatch = useAppDispatch();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [loading, setLoading] = useState<string | false>(false);

  const closeHandle = () => {
    if (loading) setLoading(false);
    setAnchorEl(null);
  };

  const transferHandle = (_listIndex: number, listId?: string) => {
    setLoading(listId ?? false);
    dispatch(
      copyTask(task.projectId, task._id, listId ?? "", () => {
        closeHandle();
        setLoading(false);
      }),
    );
  };

  return (
    <>
      <SideButton
        icon={<FileCopyIcon />}
        text="Copy"
        clickHandle={(e) => setAnchorEl(e.currentTarget)}
      />
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={closeHandle}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        transitionDuration={0}
      >
        <div style={{ outline: "none" }}>
          <TransferTasks
            transferHandle={transferHandle}
            handleClose={closeHandle}
            loading={loading}
            title="Copy Task"
            listId=""
          />
        </div>
      </Menu>
    </>
  );
};

export default Copy;
