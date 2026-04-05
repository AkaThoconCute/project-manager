import { useState, useRef } from "react";
import { InputAdornment, Input, Button, IconButton, Box } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import ClearIcon from "@mui/icons-material/Clear";
import AddIcon from "@mui/icons-material/Add";
import { animateScroll } from "react-scroll";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import {
  projectListAdd,
  projectTaskAdd,
} from "../../../redux/actions/projectActions";
interface AddInputProps {
  listId?: string;
  placeholder: string;
}

const AddInput: React.FC<AddInputProps> = ({ listId, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const dispatch = useAppDispatch();
  const { project } = useAppSelector((state) => state.projectSetCurrent);
  const inputRef = useRef<HTMLInputElement>(null);

  const cancelHandle = () => {
    inputRef.current?.blur();
    setIsOpen(false);
    setTitle("");
  };

  const keyPressHandle = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      addAction();
    } else if (e.key === "Escape") cancelHandle();
  };

  const focusHandle = () => {
    setIsOpen(true);
    if (listId) {
      animateScroll.scrollToBottom({ duration: 150, containerId: listId });
    } else {
      const boardContainer = document.getElementById("board-container");
      if (boardContainer) boardContainer.scrollLeft += 500;
    }
  };

  const focusOutHandle = () => title === "" && setIsOpen(false);
  const preventBlurHandle = (e: React.MouseEvent) => e.preventDefault();

  const addAction = () => {
    if (title.trim() !== "" && project?._id) {
      if (listId) {
        dispatch(
          projectTaskAdd(project._id, listId, title, () => {
            setTitle("");
            inputRef.current?.focus();
          }),
        );
      } else {
        dispatch(
          projectListAdd(project._id, title, () => {
            setTitle("");
            inputRef.current?.focus();
            const boardContainer = document.getElementById("board-container");
            if (boardContainer) boardContainer.scrollLeft += 1000;
          }),
        );
      }
    }
  };

  const containerSx: SxProps<Theme> = listId
    ? {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        margin: "0 10px 6px",
      }
    : {
        display: "flex",
        flexDirection: "column",
        minWidth: 265,
        backgroundColor: "#eaeaea",
        margin: "0 10px 0 4px",
        padding: isOpen ? "5.5px 5px" : undefined,
        borderRadius: "3px",
        "&:hover": {
          backgroundColor: !isOpen ? "#cdcdcd" : undefined,
        },
      };

  const inputContainerSx: SxProps<Theme> = isOpen
    ? {
        display: "flex",
        alignItems: "flex-start",
        backgroundColor: "#fff",
        borderRadius: "5px",
        border: "2px solid rgb(21, 192, 215)",
      }
    : {
        display: "flex",
        alignItems: "flex-start",
        backgroundColor: listId ? "#fff" : undefined,
        borderRadius: "5px",
        padding: !listId ? "11px 5px" : undefined,
        border: "2px solid transparent",
        cursor: "pointer",
        "&:hover": {
          backgroundColor: listId ? "#cdcdcd" : undefined,
        },
      };

  return (
    <Box sx={containerSx} onClick={() => !isOpen && inputRef.current?.focus()}>
      <Input
        sx={inputContainerSx}
        id={listId ? `task-input-${listId}` : undefined}
        inputRef={inputRef}
        onBlur={focusOutHandle}
        onFocus={focusHandle}
        disableUnderline
        fullWidth
        multiline
        value={title}
        onKeyDown={keyPressHandle}
        onChange={(e) => setTitle(e.target.value)}
        style={{ cursor: !isOpen ? "pointer" : undefined }}
        slotProps={{
          input: {
            style: { cursor: !isOpen ? "pointer" : undefined },
          },
        }}
        startAdornment={
          <InputAdornment position="start">
            <AddIcon
              sx={{ color: "#a3a3a3", marginTop: isOpen ? "18px" : "19px" }}
            />
          </InputAdornment>
        }
        placeholder={placeholder}
      />
      {isOpen && (
        <div
          style={{ margin: "6px 0 4px 1px", width: "100%" }}
          onMouseDown={preventBlurHandle}
        >
          <Button variant="contained" color="primary" onClick={addAction}>
            Add
          </Button>
          <IconButton
            sx={{ padding: "6px", marginLeft: "4px" }}
            onClick={cancelHandle}
          >
            <ClearIcon />
          </IconButton>
        </div>
      )}
    </Box>
  );
};

export default AddInput;
