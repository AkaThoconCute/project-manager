import { useRef, useState } from "react";
import Button from "@mui/material/Button";
import Popover from "@mui/material/Popover";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useAppDispatch } from "../../../../../../redux/hooks";
import { createToDoList } from "../../../../../../redux/actions/projectActions";
import Loader from "../../../../../Loader";
import MenuHeader from "../../../../shared/MenuHeader";

interface ToDoMenuProps {
  anchorEl: HTMLElement | null;
  handleClose: () => void;
  projectId: string;
  taskId: string;
}

const ToDoMenu = ({
  anchorEl,
  handleClose,
  projectId,
  taskId,
}: ToDoMenuProps) => {
  const dispatch = useAppDispatch();
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const closeHandle = () => {
    setTitle("");
    handleClose();
  };

  const saveHandle = () => {
    if (title === "") {
      inputRef.current?.focus();
    } else {
      setLoading(true);
      dispatch(
        createToDoList(taskId, projectId, title, () => {
          setLoading(false);
          setTitle("");
          handleClose();
        }),
      );
    }
  };

  const keyPressHandle = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") saveHandle();
  };

  return (
    <Popover
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={closeHandle}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      transformOrigin={{ vertical: "top", horizontal: "left" }}
      transitionDuration={0}
    >
      <div style={{ padding: "8px 0" }}>
        <MenuHeader handleClose={closeHandle} title="Add To-Do List" />
        <div style={{ width: 270, marginTop: 10, padding: "0 10px" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Typography
              variant="caption"
              style={{ fontWeight: 600, color: "#979a9a" }}
            >
              Title
            </Typography>
            <TextField
              inputRef={inputRef}
              variant="outlined"
              style={{ marginBottom: 15 }}
              inputProps={{ style: { padding: "6px 8px" } }}
              value={title}
              onKeyDown={keyPressHandle}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <Button
            color="primary"
            variant="contained"
            onClick={saveHandle}
            disabled={loading}
            style={{ position: "relative" }}
          >
            Add{loading && <Loader button />}
          </Button>
        </div>
      </div>
    </Popover>
  );
};

export default ToDoMenu;
