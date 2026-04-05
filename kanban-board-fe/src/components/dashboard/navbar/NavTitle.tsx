import React, { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { projectDataTitleUpdate } from "../../../redux/slices/userSlice";

const NavTitle = () => {
  const dispatch = useAppDispatch();
  const { socket } = useAppSelector((state) => state.socketConnection);
  const { project } = useAppSelector((state) => state.projectGetData);
  const [projectTitle, setProjectTitle] = useState(project?.title ?? "");
  const [titleOpen, setTitleOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const sizerRef = useRef<HTMLSpanElement>(null);
  const [inputWidth, setInputWidth] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (project?.title !== undefined) setProjectTitle(project.title);
  }, [project?.title]);

  // Update input width based on sizer span
  useEffect(() => {
    if (sizerRef.current) {
      setInputWidth(sizerRef.current.offsetWidth + 4);
    }
  }, [projectTitle]);

  const keyPressHandle = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (
        projectTitle.trim() !== "" &&
        projectTitle !== project?.title &&
        socket
      ) {
        socket.emit(
          "project-title-update",
          { title: projectTitle, projectId: project!._id },
          () => {
            dispatch(
              projectDataTitleUpdate({
                title: projectTitle,
                projectId: project!._id,
              }),
            );
            inputRef.current?.blur();
          },
        );
      }
    } else if (e.key === "Escape") {
      inputRef.current?.blur();
    }
  };

  const openTitleInputHandle = () => {
    setTitleOpen(true);
    inputRef.current?.select();
  };

  const closeHandle = () => {
    setTitleOpen(false);
    if (project?.title) setProjectTitle(project.title);
  };

  const isDisabled = project?.permissions !== 2;

  const sharedStyle: React.CSSProperties = {
    maxWidth: "100%",
    fontSize: "1.2rem",
    color: "var(--primary-color, #00bcd4)",
    outline: "none",
    borderRadius: 5,
    padding: "2px 3px",
    fontFamily: "inherit",
  };

  return (
    <div style={{ position: "absolute", left: 50, right: 20 }}>
      {/* Hidden sizer span for auto-width */}
      <span
        ref={sizerRef}
        aria-hidden
        style={{
          ...sharedStyle,
          visibility: "hidden",
          position: "absolute",
          whiteSpace: "pre",
          pointerEvents: "none",
        }}
      >
        {projectTitle || " "}
      </span>
      <input
        ref={inputRef}
        value={projectTitle}
        onChange={(e) => setProjectTitle(e.target.value)}
        onKeyDown={keyPressHandle}
        spellCheck={false}
        onBlur={closeHandle}
        disabled={isDisabled}
        onClick={() => !titleOpen && openTitleInputHandle()}
        style={{
          ...sharedStyle,
          width: inputWidth,
          backgroundColor: titleOpen ? "#fff" : "transparent",
          border: titleOpen
            ? "2px solid rgb(21, 192, 215)"
            : "2px solid transparent",
          cursor: "text",
          overflow: titleOpen ? "visible" : "hidden",
          textOverflow: titleOpen ? "clip" : "ellipsis",
        }}
      />
    </div>
  );
};

export default NavTitle;
