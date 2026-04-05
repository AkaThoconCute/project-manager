import { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import ChatIcon from "@mui/icons-material/Chat";
import { useAppDispatch, useAppSelector } from "../../../../../redux/hooks";
import {
  addComment,
  deleteComment,
  editComment,
} from "../../../../../redux/actions/projectActions";
import type { Comment, UserSummary } from "../../../../../types/models";
import CommentItem from "./CommentItem";
import CommentInput from "./CommentInput";
import DeleteMenu from "../../../shared/DeleteMenu";

interface CommentsProps {
  comments: Comment[];
  projectId: string;
  taskId: string;
  disabled: boolean;
}

const Comments = ({ comments, projectId, taskId, disabled }: CommentsProps) => {
  const { userInfo } = useAppSelector((state) => state.userLogin);
  const dispatch = useAppDispatch();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [commentToDelete, setCommentToDelete] = useState<{
    id: string;
    index: number;
  } | null>(null);

  const openDeleteMenu = (id: string, index: number, anchor: HTMLElement) => {
    setCommentToDelete({ id, index });
    setAnchorEl(anchor);
  };

  const deleteCommentHandle = () => {
    if (!commentToDelete) return;
    dispatch(
      deleteComment(
        taskId,
        projectId,
        commentToDelete.id,
        commentToDelete.index,
        () => {
          setCommentToDelete(null);
          setAnchorEl(null);
        },
      ),
    );
  };

  const editCommentHandle = (
    commentId: string,
    comment: string,
    commentIndex: number,
    callback: () => void,
  ) => {
    dispatch(
      editComment(
        taskId,
        projectId,
        commentId,
        comment,
        commentIndex,
        callback,
      ),
    );
  };

  const addCommentHandle = (comment: string, callback: () => void) => {
    dispatch(addComment(taskId, projectId, comment, callback));
  };

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", marginTop: 15 }}>
        <ChatIcon color="primary" style={{ marginRight: 15 }} />
        <Typography variant="body1">Comments</Typography>
      </div>
      <div style={{ margin: "15px 0px 8px 0px", display: "flex" }}>
        <Avatar
          style={{ width: 35, height: 35, marginRight: 10 }}
          src={userInfo?.profilePicture ?? undefined}
        />
        <CommentInput addCommentHandle={addCommentHandle} disabled={disabled} />
      </div>
      <div style={{ margin: "10px 40px 0 0" }}>
        {comments &&
          comments.map((comment, index) => {
            const userObj = comment.user as UserSummary;
            return (
              <CommentItem
                key={comment._id}
                commentIndex={index}
                comment={comment}
                profilePicture={
                  userInfo?._id === userObj._id
                    ? userInfo.profilePicture
                    : userObj.profilePicture
                }
                openDeleteMenu={openDeleteMenu}
                editCommentHandle={editCommentHandle}
                userId={userInfo?._id ?? ""}
              />
            );
          })}
      </div>
      <DeleteMenu
        anchorEl={anchorEl}
        handleClose={() => setAnchorEl(null)}
        headerTitle="Delete comment?"
        deleteHandle={deleteCommentHandle}
        text="Deleting a comment cannot be undone, are you sure?"
      />
    </>
  );
};

export default Comments;
