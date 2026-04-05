import { useEffect, useRef, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { LinearProgress, Modal } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { setTask } from "../../../redux/actions/projectActions";
import { projectSetTaskReset } from "../../../redux/slices/projectSlice";
import ModalContainer from "./ModalContainer";
import Helmet from "../../Helmet";

interface TaskModalProps {
  projectId: string;
  userPermissions: number;
  userId: string;
}

const containerStyle: React.CSSProperties = {
  position: "relative",
  overflow: "auto",
  borderRadius: 5,
  height: "90vh",
  maxWidth: 700,
  margin: "5vh auto",
  outline: "none",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  backgroundColor: "#f4f5f7",
};

const closeIconSx = {
  position: "absolute" as const,
  top: 5,
  right: 5,
  padding: "3px",
  cursor: "pointer",
  "&:hover": {
    color: "primary.main",
  },
};

const TaskModal = ({ projectId, userPermissions, userId }: TaskModalProps) => {
  const dispatch = useAppDispatch();
  const { task } = useAppSelector((state) => state.projectSetTask);
  const [loading, setLoading] = useState(true);
  const timeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const navigate = useNavigate();
  const { taskId } = useParams<{ taskId?: string }>();

  useEffect(() => {
    if (taskId && !task) dispatch(setTask(projectId, taskId));
    else if (!taskId && task) dispatch(projectSetTaskReset());
    else if (taskId && task)
      timeout.current = setTimeout(() => setLoading(false), 1);
  }, [dispatch, navigate, taskId, task, projectId]);

  const closeHandle = () => {
    navigate(`/project/${task!.projectId}`);
    dispatch(projectSetTaskReset());
    setLoading(true);
    clearTimeout(timeout.current);
  };

  const keyPressHandle = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (document.activeElement?.id === "task-modal" && e.key === "Escape")
      closeHandle();
  };

  return (
    <Modal open={Boolean(task)} disableScrollLock onClose={closeHandle}>
      <div
        style={containerStyle}
        id="task-modal"
        tabIndex={0}
        onKeyDown={keyPressHandle}
      >
        {task && <Helmet title={task.title} />}
        {task && task.deleted && <Navigate to={`/project/${task.projectId}`} />}
        {loading ? (
          <LinearProgress />
        ) : (
          <ModalContainer
            task={task!}
            userPermissions={userPermissions}
            userId={userId}
          />
        )}
        <CloseIcon sx={closeIconSx} onClick={closeHandle} />
      </div>
    </Modal>
  );
};

export default TaskModal;
