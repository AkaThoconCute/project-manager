import { useEffect, useRef, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { getProjectData } from "../../redux/actions/projectActions";
import {
  projectSetCurrent,
  projectSetCurrentReset,
  projectDataReset,
} from "../../redux/slices/projectSlice";
import Board from "../dashboard/Board";
import Loader from "../Loader";
import TaskModal from "../dashboard/taskModal/TaskModal";
import Helmet from "../Helmet";
import { isFakeMode } from "../../config/env";

const isObjectId = /^[0-9a-fA-F]{24}$/;

const Project = () => {
  const [projectLoading, setProjectLoading] = useState(true);
  const [background, setBackground] = useState<string | false>(false);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, project, error } = useAppSelector(
    (state) => state.projectGetData,
  );
  const { userInfo } = useAppSelector((state) => state.userLogin);
  const { socket } = useAppSelector((state) => state.socketConnection);
  const { id } = useParams<{ id: string }>();

  const mainColor = userInfo?.projectsThemes?.[id!]?.mainColor ?? "#00bcd4";
  const theme = createTheme({
    palette: {
      primary: { main: mainColor },
      secondary: { main: "#ff3d00" },
    },
  });

  // Set currentProject on initial mount
  useEffect(() => {
    if (id && userInfo && Object.keys(userInfo).length > 1) {
      let initiallyLoadedProject = userInfo.projectsJoined.find(
        (x) => x._id === id,
      );
      if (!initiallyLoadedProject)
        initiallyLoadedProject = userInfo.projectsCreated.find(
          (x) => x._id === id,
        );
      if (initiallyLoadedProject) {
        dispatch(projectSetCurrent(initiallyLoadedProject));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Fetch project data or navigate to boards if invalid id
  useEffect(() => {
    if (id && (isFakeMode() || id.match(isObjectId))) {
      setBackground("none");
      setProjectLoading(true);
      dispatch(getProjectData(id, project?._id));
    } else {
      navigate("/boards");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Cleanup on unmount
  useEffect(() => {
    const cleanClasses = () => (document.body.className = "");
    document.addEventListener("touchend", cleanClasses, false);
    return () => {
      dispatch(projectSetCurrentReset());
      dispatch(projectDataReset());
      setProjectLoading(true);
      if (socket && id) socket.emit("disconnect-board", { room: id });
      document.removeEventListener("touchend", cleanClasses, false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  // Set background after project loads
  useEffect(() => {
    if (project && project._id === id) {
      const projectBackground = userInfo?.projectsThemes?.[id!]?.background;
      if (projectBackground && projectBackground.startsWith("linear")) {
        setBackground(projectBackground);
        setProjectLoading(false);
      } else if (projectBackground && !projectBackground.startsWith("linear")) {
        const imageLoader = new Image();
        imageLoader.src = projectBackground;
        imageLoader.onload = () => {
          setProjectLoading(false);
          setBackground(`url(${projectBackground})`);
        };
        imageLoader.onerror = () => setProjectLoading(false);
      } else {
        setProjectLoading(false);
      }
    } else if (error) {
      setProjectLoading(false);
    }
  }, [id, project, userInfo, error]);

  return (
    <ThemeProvider theme={theme}>
      <div
        id="project-background"
        ref={backgroundRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: -1,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundImage:
            !loading && !projectLoading && background ? background : undefined,
        }}
      />
      {Boolean(projectLoading || loading) ? (
        <div style={{ position: "relative", width: "100%", height: "100vh" }}>
          <Loader />
        </div>
      ) : error ? (
        <Navigate to="/boards" replace />
      ) : (
        project && (
          <>
            <Helmet title={project.title} />
            <Board />
            <TaskModal
              userPermissions={project.permissions ?? 1}
              projectId={project._id}
              userId={userInfo!._id}
            />
          </>
        )
      )}
    </ThemeProvider>
  );
};

export default Project;
