import { Container, Grid, Typography } from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import PersonIcon from "@mui/icons-material/Person";
import BoardItem from "../boards/BoardItem";
import NewProjectBoard from "../boards/NewProjectBoard";
import Helmet from "../Helmet";
import { useAppSelector } from "../../redux/hooks";

const headerSx = {
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "center",
  marginLeft: "8px",
  color: "#fff",
  "& svg": {
    marginRight: "10px",
  },
} as const;

const Boards = () => {
  const { userInfo } = useAppSelector((state) => state.userLogin);
  const projectsJoined = userInfo?.projectsJoined;
  const projectsCreated = userInfo?.projectsCreated;
  const projectsThemes = userInfo?.projectsThemes ?? {};

  return (
    <Container sx={{ margin: "8vh auto 2.5vh auto" }}>
      <Helmet title="Boards" />
      <Grid container spacing={1}>
        <Grid size={{ xs: 12 }}>
          <div style={headerSx}>
            <PersonIcon />
            <Typography variant="h6">Created Projects</Typography>
          </div>
        </Grid>
        {projectsCreated?.map((project) => (
          <BoardItem
            key={project._id}
            project={project}
            projectsThemes={projectsThemes}
          />
        ))}
        <NewProjectBoard />

        {projectsJoined && projectsJoined.length > 0 && (
          <>
            <Grid size={{ xs: 12 }}>
              <div style={headerSx}>
                <GroupIcon />
                <Typography variant="h6">Joined Projects</Typography>
              </div>
            </Grid>
            {projectsJoined.map((project) => (
              <BoardItem
                key={project._id}
                project={project}
                projectsThemes={projectsThemes}
              />
            ))}
          </>
        )}
      </Grid>
    </Container>
  );
};

export default Boards;
