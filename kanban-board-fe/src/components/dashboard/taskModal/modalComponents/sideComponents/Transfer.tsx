import { useState } from "react";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SettingsBackupRestoreIcon from "@mui/icons-material/SettingsBackupRestore";
import Menu from "@mui/material/Menu";
import { useAppDispatch } from "../../../../../redux/hooks";
import { projectTaskTransfer } from "../../../../../redux/actions/projectActions";
import SideButton from "./SideButton";
import TransferTasks from "../../../lists/listMore/TransferTasks";
import type { Task } from "../../../../../types/models";

interface TransferProps {
  task: Task;
  currentListId: string | false;
  taskIndex: number | false;
  listIndex: number | false;
}

const Transfer = ({
  task,
  listIndex,
  taskIndex,
  currentListId,
}: TransferProps) => {
  const dispatch = useAppDispatch();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const transferHandle = (
    newListIndex: number,
    newListId?: string,
    callback?: () => void,
  ) => {
    const cb =
      callback ??
      (() => {
        setAnchorEl(null);
      });
    if (task.archived) {
      dispatch(
        projectTaskTransfer(
          task._id,
          typeof taskIndex === "number" ? taskIndex : 0,
          null,
          newListIndex,
          "",
          newListId ?? "",
          cb,
        ),
      );
    } else if (
      typeof taskIndex === "number" &&
      typeof listIndex === "number" &&
      typeof currentListId === "string"
    ) {
      dispatch(
        projectTaskTransfer(
          task._id,
          taskIndex,
          listIndex,
          newListIndex,
          currentListId,
          newListId ?? "",
          cb,
        ),
      );
    }
  };

  return (
    <>
      <SideButton
        icon={
          task.archived ? <SettingsBackupRestoreIcon /> : <ArrowForwardIcon />
        }
        text={task.archived ? "Restore" : "Transfer"}
        clickHandle={(e) => setAnchorEl(e.currentTarget)}
      />
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        transitionDuration={0}
      >
        <div style={{ outline: "none" }}>
          <TransferTasks
            listId={
              !task.archived && typeof currentListId === "string"
                ? currentListId
                : ""
            }
            transferHandle={transferHandle}
            handleClose={() => setAnchorEl(null)}
            title={
              task.archived ? "Restore task" : "Transfer task to other list"
            }
          />
        </div>
      </Menu>
    </>
  );
};

export default Transfer;
