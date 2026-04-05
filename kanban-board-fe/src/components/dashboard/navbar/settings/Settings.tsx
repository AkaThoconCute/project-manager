import { useState } from "react";
import { Box, Tooltip } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import { type Project } from "../../../../types/models";
import SettingsModal from "./SettingsModal";

interface SettingsProps {
  project: Project;
}

const Settings = ({ project }: SettingsProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Tooltip title="Settings">
        <Box
          onClick={() => setOpen(true)}
          sx={{
            display: "flex",
            padding: "5px",
            marginBottom: "3px",
            cursor: "pointer",
            color: "#fff",
            transition: ".2s ease",
            "&:hover": {
              background: "#ffffff21",
              borderRadius: 3,
            },
          }}
        >
          <SettingsIcon />
        </Box>
      </Tooltip>
      <SettingsModal
        open={open}
        handleClose={() => setOpen(false)}
        project={project}
      />
    </>
  );
};

export default Settings;
