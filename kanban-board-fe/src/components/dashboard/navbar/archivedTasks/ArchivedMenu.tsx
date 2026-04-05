import { useState } from "react";
import { Popover, Typography, Box } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import {
  projectTaskDelete,
  projectTaskTransfer,
} from "../../../../redux/actions/projectActions";
import type { ListDocument, Task } from "../../../../types/models";
import DeleteMenu from "../../shared/DeleteMenu";
import ArchivedActions from "./ArchivedActions";
import TransferMenu from "./TransferMenu";

interface ArchivedMenuProps {
  anchorEl: HTMLElement | null;
  handleClose: () => void;
}

const ArchivedMenu = ({ anchorEl, handleClose }: ArchivedMenuProps) => {
  const dispatch = useAppDispatch();
  const lists = useAppSelector((state) => state.projectGetData.lists) as
    | ListDocument
    | undefined;

  const [transferAnchorEl, setTransferAnchorEl] = useState<HTMLElement | null>(
    null,
  );
  const [deleteAnchorEl, setDeleteAnchorEl] = useState<HTMLElement | null>(
    null,
  );
  const [taskIndex, setTaskIndex] = useState<number | null>(null);
  const [taskId, setTaskId] = useState<string | null>(null);

  const openTransferMenu = (target: HTMLElement, index: number, id: string) => {
    setTransferAnchorEl(target);
    setTaskIndex(index);
    setTaskId(id);
  };

  const closeTransferMenu = () => {
    setTransferAnchorEl(null);
    setTaskIndex(null);
    setTaskId(null);
  };

  const transferActionHandle = (newListIndex: number, newListId: string) => {
    dispatch(
      projectTaskTransfer(
        taskId!,
        taskIndex!,
        null,
        newListIndex,
        "",
        newListId,
        closeTransferMenu,
      ),
    );
  };

  const openDeleteMenu = (target: HTMLElement, index: number, id: string) => {
    setDeleteAnchorEl(target);
    setTaskIndex(index);
    setTaskId(id);
  };

  const closeDeleteMenu = () => {
    setDeleteAnchorEl(null);
    setTaskIndex(null);
  };

  const deleteTaskHandle = () => {
    dispatch(projectTaskDelete(taskId!, taskIndex!, () => closeDeleteMenu()));
  };

  return (
    <>
      <Popover
        disableScrollLock={true}
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        slotProps={{
          paper: { style: { borderTopLeftRadius: 8, borderTopRightRadius: 8 } },
        }}
        transitionDuration={0}
      >
        <Box sx={{ width: 300, outline: "none" }}>
          <Box
            sx={{
              backgroundColor: "primary.main",
              padding: "2px 0",
              textAlign: "center",
              color: "#fff",
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              Archived Tasks
            </Typography>
          </Box>
          <Box
            sx={{
              padding: "4px 4px 0px 4px",
              margin: "0 3px",
              overflowY: "auto",
              maxHeight: 600,
            }}
          >
            {lists?.archivedTasks &&
              lists.archivedTasks.length > 0 &&
              lists.archivedTasks.map((task: Task, idx: number) => (
                <div key={task._id}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      position: "relative",
                      border: "1px solid #ddd",
                      borderRadius: "3px",
                      backgroundColor: "#ececec",
                      marginBottom: "4px",
                      padding: "5px 10px 8px 10px",
                    }}
                  >
                    <Typography variant="subtitle2">{task.title}</Typography>
                  </Box>
                  <ArchivedActions
                    taskId={task._id}
                    taskIndex={idx}
                    openTransferMenu={openTransferMenu}
                    openDeleteMenu={openDeleteMenu}
                  />
                </div>
              ))}
            {lists?.archivedTasks && lists.archivedTasks.length === 0 && (
              <Box
                sx={{
                  height: 60,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: "6px",
                  backgroundColor: "#efefef",
                  color: "#686464",
                  marginBottom: "7px",
                }}
              >
                No Archived Tasks
              </Box>
            )}
          </Box>
        </Box>
      </Popover>
      <TransferMenu
        anchorEl={transferAnchorEl}
        closeHandle={closeTransferMenu}
        transferActionHandle={transferActionHandle}
      />
      <DeleteMenu
        anchorEl={deleteAnchorEl}
        headerTitle="Delete task?"
        handleClose={closeDeleteMenu}
        deleteHandle={deleteTaskHandle}
        text="Deleting a task cannot be undone, are you sure?"
      />
    </>
  );
};

export default ArchivedMenu;
