import { Box, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const ArchivedHeader = () => {
  return (
    <Box
      sx={{
        backgroundColor: "#90e0ff",
        backgroundImage:
          "repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.5) 35px, rgba(255,255,255,.5) 61px)",
        minHeight: 52,
        padding: "12px 12px 12px 19px",
        display: "flex",
        alignItems: "center",
      }}
    >
      <DeleteIcon sx={{ mr: "15px" }} />
      <Typography variant="subtitle1">This task is archived</Typography>
    </Box>
  );
};

export default ArchivedHeader;
