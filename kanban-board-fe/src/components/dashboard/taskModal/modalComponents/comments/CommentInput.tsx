import { useRef, useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";

interface CommentInputProps {
  commentId?: string;
  commentIndex?: number;
  editCommentHandle?: (
    commentId: string,
    comment: string,
    commentIndex: number,
    close: () => void,
  ) => void;
  addCommentHandle?: (comment: string, callback: () => void) => void;
  initialComment?: string;
  editCloseHandle?: () => void;
  disabled?: boolean;
}

const CommentInput = ({
  commentId,
  commentIndex,
  editCommentHandle,
  addCommentHandle,
  initialComment,
  editCloseHandle,
  disabled,
}: CommentInputProps) => {
  const [commentOpen, setCommentOpen] = useState(false);
  const [comment, setComment] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (initialComment) inputRef.current?.select();
  }, [initialComment]);

  const cancelHandle = () => {
    setCommentOpen(false);
    setComment("");
  };

  const commentOnTask = () => {
    if (comment.trim() === "") {
      inputRef.current?.select();
    } else {
      if (initialComment) {
        editCommentHandle!(
          commentId!,
          comment,
          commentIndex!,
          editCloseHandle!,
        );
      } else {
        addCommentHandle!(comment, () => {
          inputRef.current?.blur();
          cancelHandle();
        });
      }
    }
  };

  const keyPressHandle = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      inputRef.current?.blur();
      cancelHandle();
    } else if (e.key === "Enter") {
      e.preventDefault();
      commentOnTask();
    }
  };

  const openCommentHandle = () => {
    setCommentOpen(true);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flexBasis: "calc(100% - 50px)",
        border: "1px solid #ccc",
        background: "#fff",
        borderRadius: 6,
      }}
    >
      <TextField
        id="comment"
        name="comment"
        type="text"
        inputRef={inputRef}
        placeholder="Write a comment"
        multiline
        variant="outlined"
        value={comment ? comment : addCommentHandle ? comment : initialComment}
        onChange={(e) => setComment(e.target.value)}
        sx={{
          "& .MuiInputBase-multiline": {
            fontSize: ".875rem",
            padding: "8px 6px",
          },
          "& fieldset": { border: "none" },
        }}
        onKeyDown={keyPressHandle}
        fullWidth
        onFocus={openCommentHandle}
        slotProps={{ input: { spellCheck: false } }}
        disabled={disabled}
      />
      {(commentOpen || initialComment) && (
        <div
          style={{
            marginTop: 10,
            padding: "0 0 6px 5px",
            alignItems: "center",
            display: "flex",
          }}
        >
          <Button
            size="small"
            color="primary"
            variant="contained"
            onClick={commentOnTask}
          >
            {initialComment ? "Save" : "Comment"}
          </Button>
          <CloseIcon
            style={{ cursor: "pointer", marginLeft: 5 }}
            onClick={initialComment ? editCloseHandle : cancelHandle}
          />
        </div>
      )}
    </div>
  );
};

export default CommentInput;
