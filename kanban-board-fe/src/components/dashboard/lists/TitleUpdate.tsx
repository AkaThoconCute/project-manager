import { useState, useEffect, useRef } from "react";
import { InputBase } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { taskFieldUpdate } from "../../../redux/actions/projectActions";
import { projectDataListTitleUpdate } from "../../../redux/slices/projectSlice";
import Loader from "../../Loader";

interface TitleUpdateProps {
  currentTitle: string;
  listIndex?: number;
  projectId: string;
  taskId?: string;
  disabled?: boolean;
}

const inputSx = {
  border: "2px solid transparent",
  padding: "4px 2px",
  marginRight: "29px",
};

const inputOpenSx = {
  border: "2px solid",
  borderColor: "primary.main",
  padding: "4px 2px",
  marginRight: "29px",
  backgroundColor: "#fff",
  borderRadius: "5px",
  zIndex: 1,
};

const dragFixStyles: React.CSSProperties = {
  cursor: "pointer",
  zIndex: 1,
  position: "absolute",
  top: 0,
  left: 0,
  right: 34,
  bottom: 0,
};

const TitleUpdate = ({
  currentTitle,
  listIndex,
  projectId,
  taskId,
  disabled,
}: TitleUpdateProps) => {
  const dispatch = useAppDispatch();
  const { socket } = useAppSelector((state) => state.socketConnection);
  const [title, setTitle] = useState(currentTitle);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const titleRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => setTitle(currentTitle), [currentTitle]);

  const keyPressHandle = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (e.key === "Escape") {
      titleRef.current?.blur();
    } else if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (title === currentTitle) {
        titleRef.current?.blur();
      } else if (title !== currentTitle && title.trim() !== "") {
        if (typeof listIndex === "number" && !isNaN(listIndex)) {
          socket?.emit(
            "list-title-update",
            { title, projectId, listIndex },
            () => {
              dispatch(projectDataListTitleUpdate({ title, listIndex }));
              titleRef.current?.blur();
            },
          );
        } else if (taskId) {
          setLoading(true);
          dispatch(
            taskFieldUpdate(taskId, projectId, title, "title", () =>
              setLoading(false),
            ),
          );
        }
      }
    }
  };

  const blurHandle = () => {
    if (!loading) setTitle(currentTitle);
    setOpen(false);
  };

  const focusHandle = () => {
    setOpen(true);
    (titleRef.current as HTMLInputElement)?.select();
  };

  return (
    <>
      {typeof listIndex === "number" && !isNaN(listIndex) && !open && (
        <div style={dragFixStyles} onClick={() => titleRef.current?.focus()} />
      )}
      <div style={{ position: "relative", width: "100%" }}>
        <InputBase
          inputRef={titleRef}
          sx={open ? inputOpenSx : inputSx}
          inputProps={{ spellCheck: false }}
          color="primary"
          onBlur={blurHandle}
          multiline
          value={title}
          fullWidth
          onMouseDown={(e) => e.stopPropagation()}
          onFocus={focusHandle}
          onKeyDown={keyPressHandle}
          onChange={(e) => setTitle(e.target.value)}
          disabled={loading || disabled}
        />
        {loading && <Loader button />}
      </div>
    </>
  );
};

export default TitleUpdate;
