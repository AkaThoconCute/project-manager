import { useState, useEffect, useRef } from "react";
import { InputBase } from "@mui/material";

interface ToDoTitleUpdateProps {
  currentTitle: string;
  updateHandle: (title: string, callback: () => void) => void;
  disabled?: boolean;
}

const ToDoTitleUpdate = ({
  currentTitle,
  updateHandle,
  disabled,
}: ToDoTitleUpdateProps) => {
  const [title, setTitle] = useState("");
  const [open, setOpen] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => setTitle(currentTitle), [currentTitle]);

  const keyPressHandle = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      titleRef.current?.blur();
    }
    if (e.key === "Enter") {
      e.preventDefault();
      if (title === currentTitle || title.trim() === "") {
        titleRef.current?.blur();
      } else {
        updateHandle(title, () =>
          setTimeout(() => titleRef.current?.blur(), 1),
        );
      }
    }
  };

  const blurHandle = () => {
    setOpen(false);
    setTitle(currentTitle);
  };

  const focusHandle = () => {
    setOpen(true);
    titleRef.current?.select();
  };

  return (
    <InputBase
      inputRef={titleRef}
      sx={
        open
          ? {
              border: "2px solid",
              borderColor: "primary.main",
              padding: "4px 2px",
              marginRight: "10px",
              backgroundColor: "#fff",
              borderRadius: "5px",
              zIndex: 1,
            }
          : {
              border: "2px solid transparent",
              padding: "4px 2px",
              marginRight: "10px",
            }
      }
      inputProps={{ spellCheck: false }}
      color="primary"
      onBlur={blurHandle}
      multiline
      value={title}
      fullWidth
      onFocus={focusHandle}
      onKeyDown={keyPressHandle}
      onChange={(e) => setTitle(e.target.value)}
      disabled={disabled}
    />
  );
};

export default ToDoTitleUpdate;
