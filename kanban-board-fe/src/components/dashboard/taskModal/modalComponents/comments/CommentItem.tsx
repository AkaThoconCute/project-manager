import { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import CommentInput from "./CommentInput";
import type { Comment, UserSummary } from "../../../../../types/models";

dayjs.extend(relativeTime);

interface CommentItemProps {
  comment: Comment;
  profilePicture: string | null | undefined;
  openDeleteMenu: (id: string, index: number, anchor: HTMLElement) => void;
  editCommentHandle: (
    commentId: string,
    newComment: string,
    commentIndex: number,
    close: () => void,
  ) => void;
  userId: string;
  commentIndex: number;
}

const CommentItem = ({
  comment,
  profilePicture,
  openDeleteMenu,
  editCommentHandle,
  userId,
  commentIndex,
}: CommentItemProps) => {
  const [editOpen, setEditOpen] = useState(false);
  const user = comment.user as UserSummary;

  return (
    <div style={{ display: "flex", marginBottom: 10 }}>
      <Avatar
        src={profilePicture ?? undefined}
        style={{ width: 32, height: 32, marginRight: 8, marginTop: 8 }}
      />
      <div style={{ width: "100%" }}>
        <div>
          <Typography
            variant="caption"
            style={{ fontWeight: 600, marginRight: 6 }}
          >
            {user.username}
          </Typography>
          <Typography variant="caption" style={{ color: "#9a989a" }}>
            {dayjs(comment.createdAt).fromNow()}{" "}
            {comment.createdAt !== comment.updatedAt && " (edited)"}
          </Typography>
        </div>

        {editOpen ? (
          <CommentInput
            initialComment={comment.comment}
            editCommentHandle={editCommentHandle}
            commentId={comment._id}
            commentIndex={commentIndex}
            editCloseHandle={() => setEditOpen(false)}
          />
        ) : (
          <Typography
            variant="body2"
            style={{
              wordBreak: "break-all",
              marginRight: 40,
              display: "inline-block",
              background: "#fff",
              padding: 5,
              borderRadius: 6,
              border: "1px solid #ccc",
              whiteSpace: "pre-wrap",
            }}
          >
            {comment.comment.trim()}
          </Typography>
        )}

        {!editOpen && user._id === userId && (
          <div style={{ display: "flex" }}>
            <p
              style={{ color: "#00bcd4", cursor: "pointer", margin: "2px 5px" }}
              onClick={() => setEditOpen(true)}
            >
              Edit
            </p>
            <p
              style={{ color: "#00bcd4", cursor: "pointer", margin: "2px 5px" }}
              onClick={(e) =>
                openDeleteMenu(comment._id, commentIndex, e.currentTarget)
              }
            >
              Delete
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentItem;
