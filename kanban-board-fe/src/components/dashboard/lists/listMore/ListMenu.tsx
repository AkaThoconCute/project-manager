import { useState } from "react";
import { Menu, MenuItem, Divider } from "@mui/material";
import { useAppDispatch } from "../../../../redux/hooks";
import {
  projectListDelete,
  projectTasksArchive,
  projectTasksTransfer,
} from "../../../../redux/actions/projectActions";
import MenuHeader from "../../shared/MenuHeader";
import DeleteMenu from "../../shared/DeleteMenu";
import TransferTasks from "./TransferTasks";

interface ListMenuProps {
  anchorEl: HTMLElement | null;
  handleClose: () => void;
  listId: string;
  listIndex: number;
}

interface DeleteMenuState {
  open: true;
  title: string;
  text: string;
  btnText: string;
}

const ListMenu: React.FC<ListMenuProps> = ({
  anchorEl,
  handleClose,
  listId,
  listIndex,
}) => {
  const dispatch = useAppDispatch();
  const [deleteMenu, setDeleteMenu] = useState<false | DeleteMenuState>(false);
  const [transferMenuOpen, setTransferMenuOpen] = useState(false);

  const closeHandle = () => {
    handleClose();
    setDeleteMenu(false);
    setTransferMenuOpen(false);
  };

  const deleteMenuHandle = (e: React.MouseEvent<HTMLLIElement>) => {
    const btnText = e.currentTarget.innerText.split(" ")[0];
    setDeleteMenu({
      open: true,
      title: e.currentTarget.innerText,
      text:
        btnText === "Delete"
          ? "Are you sure you want to delete a list and archive tasks inside? This action cannot be undone"
          : "Are you sure you want to archive tasks inside this list? This action cannot be undone",
      btnText,
    });
  };

  const addTaskHandle = () => {
    handleClose();
    setTimeout(
      () => document.getElementById(`task-input-${listId}`)?.focus(),
      1,
    );
  };

  const deleteListHandle = () => {
    dispatch(projectListDelete(listIndex, listId, () => closeHandle()));
  };

  const archiveTasksHandle = () => {
    dispatch(projectTasksArchive(listIndex, () => closeHandle()));
  };

  const transferHandle = (newListIndex: number) => {
    dispatch(
      projectTasksTransfer(listIndex, newListIndex, () => closeHandle()),
    );
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={closeHandle}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      transformOrigin={{ vertical: "top", horizontal: "left" }}
      transitionDuration={0}
    >
      <div style={{ width: 270, outline: "none" }}>
        {deleteMenu && deleteMenu.open && (
          <DeleteMenu
            Header={
              <MenuHeader
                goBackHandle={() => setDeleteMenu(false)}
                title={deleteMenu.title}
                handleClose={closeHandle}
              />
            }
            deleteHandle={
              deleteMenu.btnText === "Delete"
                ? deleteListHandle
                : archiveTasksHandle
            }
            text={deleteMenu.text}
            buttonText={deleteMenu.btnText}
          />
        )}
        {transferMenuOpen && (
          <TransferTasks
            listId={listId}
            goBackHandle={() => setTransferMenuOpen(false)}
            handleClose={closeHandle}
            transferHandle={transferHandle}
          />
        )}
        {!deleteMenu && !transferMenuOpen && (
          <div>
            <MenuHeader handleClose={closeHandle} title="List Actions" />
            <MenuItem
              sx={{ fontSize: ".85rem", marginTop: "5px" }}
              onClick={addTaskHandle}
            >
              Add new task
            </MenuItem>
            <MenuItem
              sx={{ fontSize: ".85rem" }}
              onClick={() => setTransferMenuOpen(true)}
            >
              Transfer tasks to other list
            </MenuItem>
            <Divider sx={{ margin: "5px 9px" }} />
            <MenuItem sx={{ fontSize: ".85rem" }} onClick={deleteMenuHandle}>
              Archive tasks inside
            </MenuItem>
            <MenuItem sx={{ fontSize: ".85rem" }} onClick={deleteMenuHandle}>
              Delete List and archive tasks inside
            </MenuItem>
          </div>
        )}
      </div>
    </Menu>
  );
};

export default ListMenu;
