import { useState } from "react";
import { Typography, Grid } from "@mui/material";
import { styled } from "@mui/material/styles";
import NewProjectModal from "../layout/navComponents/NewProjectModal";

const Container = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: 130,
  borderRadius: 5,
  padding: 10,
  backgroundColor: "rgba(255,255,255, 0.2)",
  color: "#fff",
  cursor: "pointer",
  transition: "background 0.1s ease",
  "&:hover": {
    backgroundColor: "rgba(255,255,255, 0.4)",
  },
});

const BoldText = styled(Typography)({
  fontWeight: 600,
});

const NewProjectBoard = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Grid size={{ lg: 3, md: 4, sm: 6, xs: 6 }}>
        <Container onClick={() => setOpen(true)}>
          <BoldText variant="subtitle2">Create new project</BoldText>
        </Container>
      </Grid>
      <NewProjectModal open={open} handleClose={() => setOpen(false)} />
    </>
  );
};

export default NewProjectBoard;
