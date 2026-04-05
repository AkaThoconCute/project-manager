import type { Comment } from "../../../../../types/models";

interface CommentsProps {
  comments: Comment[];
  projectId: string;
  taskId: string;
  disabled: boolean;
}

const Comments = (_props: CommentsProps) => {
  return null;
};

export default Comments;
