import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BACKGROUND_COLORS } from "../../util/colorsConstants";
import { useAppSelector } from "../../redux/hooks";
import Loader from "../Loader";

const ProjectJoinPage: React.FC = () => {
  const { socket } = useAppSelector((state) => state.socketConnection);
  const { userInfo } = useAppSelector((state) => state.userLogin);
  const { projectId, joinId } = useParams<{
    projectId: string;
    joinId: string;
  }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (socket && projectId && joinId && userInfo) {
      let projectJoined = userInfo.projectsJoined.findIndex(
        (x) => x._id === projectId,
      );
      if (projectJoined === -1) {
        projectJoined = userInfo.projectsCreated.findIndex(
          (x) => x._id === projectId,
        );
      }
      if (projectJoined !== -1) {
        navigate(`/project/${projectId}`);
      } else {
        const background =
          BACKGROUND_COLORS[Math.floor(Math.random() * Math.floor(5))];

        socket.emit("project-join", { projectId, joinId, background }, () =>
          navigate(`/project/${projectId}`),
        );
      }
    }
  }, [socket, navigate, userInfo, projectId, joinId]);

  return <Loader />;
};

export default ProjectJoinPage;
