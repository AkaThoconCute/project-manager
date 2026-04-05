import { useEffect, useRef, useState } from "react";
import { Button, ClickAwayListener, InputBase } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface ToDoInputProps {
  initialTitle?: string;
  taskFinished?: boolean;
  taskId?: string | false;
  taskIndex?: number;
  updateTaskTitleHandle?: (
    taskId: string,
    title: string,
    taskIndex: number,
    callback: () => void,
  ) => void;
  addTaskHandle?: (title: string, callback: () => void) => void;
  disabled?: boolean;
}

const ToDoInput = ({
  initialTitle = "",
  taskFinished = false,
  taskId = false,
  taskIndex,
  updateTaskTitleHandle,
  addTaskHandle,
  disabled,
}: ToDoInputProps) => {
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) setTitle(initialTitle);
  }, [open, initialTitle]);

  const closeHandle = () => {
    setOpen(false);
    if (initialTitle) {
      setTitle(initialTitle);
      if (focused) inputRef.current?.blur();
    }
  };

  const addTaskCallback = () => {
    setTitle("");
  };

  const focusInput = () => {
    setFocused(true);
    setOpen(true);
    setTimeout(() => inputRef.current?.select(), 1);
  };

  const actionHandle = () => {
    if (title.trim() !== "") {
      if (taskId) {
        updateTaskTitleHandle?.(taskId, title, taskIndex ?? 0, () =>
          setOpen(false),
        );
      } else {
        addTaskHandle?.(title, addTaskCallback);
      }
    }
  };

  const keyPressHandle = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      inputRef.current?.blur();
      closeHandle();
    } else if (e.key === "Enter") {
      e.preventDefault();
      actionHandle();
    }
  };

  const openSx = taskId
    ? {
        border: "1px solid #cbcbcb",
        backgroundColor: "#e6e6e6",
        width: "100%",
        display: "flex",
        alignItems: "flex-start",
        borderRadius: "5px",
        "& textarea": { minHeight: "40px", padding: "0 8px 5px 8px" },
      }
    : {
        backgroundColor: "#fff",
        border: "2px solid #00bcd4",
        width: "100%",
        display: "flex",
        alignItems: "flex-start",
        borderRadius: "5px",
        "& textarea": { minHeight: "40px", padding: "0 8px 5px 8px" },
      };

  const finishedSx = {
    color: "#6a6a6a",
    textDecoration: "line-through",
  };

  return (
    <div
      style={{
        margin: !taskId ? "10px 40px 0" : undefined,
        width: taskId ? "100%" : "90%",
      }}
    >
      {!taskId && !open && (
        <Button color="primary" onClick={focusInput} disabled={disabled}>
          Add task
        </Button>
      )}
      <ClickAwayListener onClickAway={() => open && !focused && closeHandle()}>
        <div>
          {(open || taskId) && (
            <InputBase
              inputRef={inputRef}
              sx={open ? openSx : taskFinished ? finishedSx : undefined}
              style={{
                fontSize: 14,
                cursor: !open && taskId && !disabled ? "pointer" : undefined,
              }}
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onFocus={!disabled ? focusInput : undefined}
              onClick={() => !disabled && setOpen(true)}
              inputProps={{
                spellCheck: false,
                style: {
                  cursor: !open && taskId && !disabled ? "pointer" : undefined,
                },
              }}
              onBlur={() => setFocused(false)}
              multiline
              onKeyDown={keyPressHandle}
              placeholder={!taskId ? "Add task" : ""}
              disabled={disabled}
            />
          )}
          {open && (
            <div
              style={{ display: "flex", alignItems: "center", marginTop: 10 }}
            >
              <Button
                color="primary"
                variant="contained"
                size="small"
                onClick={actionHandle}
              >
                {taskId ? "Save" : "Add"}
              </Button>
              <CloseIcon
                onClick={closeHandle}
                style={{ cursor: "pointer", marginLeft: 5 }}
              />
            </div>
          )}
        </div>
      </ClickAwayListener>
    </div>
  );
};

export default ToDoInput;
