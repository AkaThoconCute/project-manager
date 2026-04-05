import { useState } from "react";
import { Tooltip, Box } from "@mui/material";
import RestoreFromTrashIcon from "@mui/icons-material/RestoreFromTrash";
import ArchivedMenu from "./ArchivedMenu";

const ArchivedTasks = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  return (
    <>
      <Tooltip title="Archived Tasks">
        <Box
          sx={{
            display: "flex",
            padding: "5px",
            marginBottom: "2px",
            cursor: "pointer",
            color: "#fff",
            transition: ".2s ease",
            "&:hover": {
              background: "#ffffff21",
              borderRadius: "3px",
            },
          }}
          onClick={(e) => setAnchorEl(e.currentTarget)}
        >
          <RestoreFromTrashIcon />
        </Box>
      </Tooltip>
      <ArchivedMenu anchorEl={anchorEl} handleClose={() => setAnchorEl(null)} />
    </>
  );
};

export default ArchivedTasks;
