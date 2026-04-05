import { Dialog, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useAppSelector } from "../../../../redux/hooks";
import type { Project } from "../../../../types/models";
import ColorSelect from "./settingsComponents/ColorSelect";
import Background from "./settingsComponents/Background";
import DeleteProject from "./settingsComponents/DeleteProject";

interface SettingsModalProps {
  open: boolean;
  handleClose: () => void;
  project: Project;
}

const SettingsModal = ({ open, handleClose, project }: SettingsModalProps) => {
  const { project: reduxProject } = useAppSelector(
    (state) => state.projectGetData,
  );
  const { userInfo } = useAppSelector((state) => state.userLogin);

  const activeProject = reduxProject ?? project;
  const projectTheme =
    userInfo?.projectsThemes && userInfo.projectsThemes[activeProject._id];

  return (
    <Dialog
      open={open}
      keepMounted
      fullWidth
      maxWidth="sm"
      onClose={(_event, _reason) => handleClose()}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: "2.9rem",
          padding: "5px 10px 5px 15px",
          color: "#fff",
          background: "#423f3f",
        }}
      >
        <Typography variant="h6">Settings</Typography>
        <CloseIcon
          onClick={handleClose}
          sx={{
            cursor: "pointer",
            "&:hover": { color: "#d2d2d2" },
          }}
        />
      </div>
      <div
        style={{
          padding: 10,
          backgroundColor: "#e6e6e6",
          overflowY: "auto",
        }}
      >
        <ColorSelect
          colorTheme={projectTheme ? projectTheme.mainColor : undefined}
          projectId={activeProject._id}
        />
        <Background
          backgroundTheme={projectTheme ? projectTheme.background : undefined}
          projectId={activeProject._id}
          open={open}
        />
        {userInfo?._id === activeProject.creatorId && (
          <DeleteProject projectId={activeProject._id} />
        )}
      </div>
    </Dialog>
  );
};

export default SettingsModal;
