import { useState } from "react";
import { Menu, MenuItem } from "@mui/material";
import DeleteMenu from "../../../shared/DeleteMenu";
import MenuHeader from "../../../shared/MenuHeader";

interface ToDoMenuProps {
  deleteListHandle: () => void;
  tasksVisibilityHandle: (v: boolean) => void;
  tasksFinished: number;
  tasksHidden: boolean;
  anchorEl: HTMLElement | null;
  closeHandle: () => void;
  disabled?: boolean;
}

const ToDoMenu = ({
  deleteListHandle,
  tasksVisibilityHandle,
  tasksFinished,
  tasksHidden,
  anchorEl,
  closeHandle,
  disabled,
}: ToDoMenuProps) => {
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleClose = () => {
    setDeleteOpen(false);
    closeHandle();
  };

  return (
    <Menu
      anchorEl={anchorEl}
      keepMounted
      open={Boolean(anchorEl)}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      transformOrigin={{ vertical: "top", horizontal: "left" }}
      transitionDuration={0}
    >
      <div style={{ outline: "none" }}>
        {deleteOpen ? (
          <DeleteMenu
            Header={
              <MenuHeader
                title="Delete To-Do List?"
                goBackHandle={() => setDeleteOpen(false)}
                handleClose={handleClose}
              />
            }
            deleteHandle={deleteListHandle}
            text="Deleting a To-Do list is permament and cannot be undone."
          />
        ) : (
          <>
            <MenuHeader title="To-Do List Actions" handleClose={handleClose} />
            <div style={{ width: 270, padding: "6px 9px 0 9px" }}>
              <MenuItem
                style={{ marginTop: 5 }}
                onClick={() => tasksVisibilityHandle(!tasksHidden)}
              >
                {tasksHidden
                  ? tasksFinished === 0
                    ? "Show Finished Tasks"
                    : `Show Finished Tasks (${tasksFinished})`
                  : "Hide Finished Tasks"}
              </MenuItem>
              <MenuItem onClick={() => setDeleteOpen(true)} disabled={disabled}>
                Delete
              </MenuItem>
            </div>
          </>
        )}
      </div>
    </Menu>
  );
};

export default ToDoMenu;
