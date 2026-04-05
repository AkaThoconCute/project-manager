import { useState } from "react";
import Menu from "@mui/material/Menu";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useAppDispatch, useAppSelector } from "../../../../../../redux/hooks";
import {
  createLabel,
  deleteLabel,
  editLabel,
  updateLabels,
} from "../../../../../../redux/actions/projectActions";
import { LABEL_COLORS } from "../../../../../../util/colorsConstants";
import MenuHeader from "../../../../shared/MenuHeader";
import DeleteMenu from "../../../../shared/DeleteMenu";
import CreateLabel from "./CreateLabel";
import LabelItem from "./LabelItem";
import type { Task, Label } from "../../../../../../types/models";

interface LabelMenuProps {
  task: Task;
  anchorEl: HTMLElement | null;
  handleClose: () => void;
  listIndex: number | false;
  taskIndex: number | false;
}

const LabelMenu = ({
  task,
  anchorEl,
  handleClose,
  listIndex,
  taskIndex,
}: LabelMenuProps) => {
  const { labels } = useAppSelector((state) => state.projectGetData);
  const { socket } = useAppSelector((state) => state.socketConnection);
  const dispatch = useAppDispatch();

  const [creatorOpen, setCreatorOpen] = useState<false | string>(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState("#49E4DA");
  const [title, setTitle] = useState("");
  const [labelId, setLabelId] = useState("");

  const resetHandle = () => {
    setSelectedColor("#49E4DA");
    setTitle("");
    setLabelId("");
    setCreatorOpen(false);
    setDeleteOpen(false);
  };

  const closeHandle = () => {
    handleClose();
    resetHandle();
  };

  const editHandle = (label: Label) => {
    setCreatorOpen("Edit Label");
    setSelectedColor(label.color);
    setTitle(label.title);
    setLabelId(label._id);
  };

  const saveHandle = () => {
    if (labelId) {
      dispatch(editLabel(labelId, title, selectedColor, () => resetHandle()));
    } else {
      if (!socket) return;
      if (typeof listIndex !== "number" || typeof taskIndex !== "number")
        return;
      const li = listIndex;
      const ti = taskIndex;
      socket.emit(
        "create-label",
        {
          taskId: task._id,
          projectId: task.projectId,
          color: selectedColor,
          title,
        },
        (label: Label) =>
          dispatch(createLabel(li, ti, task._id, label, () => resetHandle())),
      );
    }
  };

  const selectHandle = (id: string, selected: boolean) => {
    let newLabels = [...task.labels];
    if (selected) {
      newLabels = newLabels.filter((l) => l !== id);
    } else {
      newLabels.push(id);
    }
    if (typeof listIndex === "number" && typeof taskIndex === "number") {
      dispatch(
        updateLabels(task._id, task.projectId, newLabels, listIndex, taskIndex),
      );
    }
  };

  const deleteHandle = () => {
    dispatch(deleteLabel(labelId, () => resetHandle()));
  };

  return (
    <Menu
      anchorEl={anchorEl}
      keepMounted
      open={Boolean(anchorEl)}
      onClose={closeHandle}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      transformOrigin={{ vertical: "top", horizontal: "left" }}
      transitionDuration={0}
    >
      <div style={{ width: 270, outline: "none" }}>
        {deleteOpen ? (
          <DeleteMenu
            Header={
              <MenuHeader
                goBackHandle={() => setDeleteOpen(false)}
                title="Delete label?"
                handleClose={closeHandle}
              />
            }
            deleteHandle={deleteHandle}
            text="Deleting a Label cannot be undone, are you sure?"
          />
        ) : creatorOpen ? (
          <>
            <MenuHeader
              goBackHandle={resetHandle}
              title={creatorOpen}
              handleClose={handleClose}
            />
            <div
              style={{
                padding: "0 10px",
                marginTop: 10,
                overflowY: "auto",
                maxHeight: 350,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <CreateLabel
                colors={LABEL_COLORS}
                selectedColor={selectedColor}
                title={title}
                setTitle={setTitle}
                setSelectedColor={setSelectedColor}
                saveHandle={saveHandle}
                edit={Boolean(labelId)}
                setDeleteOpen={setDeleteOpen}
              />
            </div>
          </>
        ) : (
          <>
            <MenuHeader title="Label" handleClose={handleClose} />
            <div
              style={{
                padding: "0 10px",
                marginTop: 10,
                overflowY: "auto",
                maxHeight: 350,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography
                variant="caption"
                style={{ fontWeight: 600, color: "#979a9a" }}
              >
                LABELS
              </Typography>
              {labels &&
                labels.labelIds.map((id) => (
                  <LabelItem
                    key={id}
                    label={labels.labels[id]}
                    editHandle={editHandle}
                    taskLabels={task.labels}
                    selectHandle={selectHandle}
                  />
                ))}
            </div>
            <div style={{ padding: "0 10px", marginTop: 5 }}>
              <Button
                fullWidth
                onClick={() => setCreatorOpen("Create Label")}
                style={{ background: "rgba(0,0,0,0.07)" }}
              >
                Create new label
              </Button>
            </div>
          </>
        )}
      </div>
    </Menu>
  );
};

export default LabelMenu;
