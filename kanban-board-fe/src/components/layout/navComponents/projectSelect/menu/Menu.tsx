import {
  Typography,
  Popper,
  ClickAwayListener,
  Paper,
  styled,
} from "@mui/material";
import EmojiObjectsIcon from "@mui/icons-material/EmojiObjects";
import { useAppSelector } from "../../../../../redux/hooks";
import ProjectMenuItem from "./ProjectMenuItem";

const SectionHeader = styled("div")(({ theme }) => ({
  background: theme.palette.primary.main,
  position: "sticky",
  top: 0,
  zIndex: 1,
  padding: "5px 5px 5px 10px",
  borderBottom: "1px solid #ccc",
  borderTop: "1px solid #ccc",
  "& h6": {
    fontSize: 14,
    color: "#fff",
    fontWeight: 600,
  },
}));

const MenuContainer = styled(Paper)({
  maxHeight: 300,
  width: 209,
  outline: "none",
  overflow: "auto",
});

interface ProjectMenuProps {
  anchorEl: HTMLElement | null;
  setAnchorEl: (el: HTMLElement | null) => void;
}

const ProjectMenu = ({ anchorEl, setAnchorEl }: ProjectMenuProps) => {
  const { loading, userInfo } = useAppSelector((state) => state.userLogin);
  const projectsJoined = userInfo?.projectsJoined ?? [];
  const projectsCreated = userInfo?.projectsCreated ?? [];

  return (
    <Popper
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      style={{ zIndex: 111111 }}
    >
      <ClickAwayListener onClickAway={() => setAnchorEl(null)}>
        <MenuContainer>
          {!loading &&
          userInfo &&
          Object.keys(userInfo).length !== 1 &&
          (projectsJoined.length !== 0 || projectsCreated.length !== 0) ? (
            <>
              {projectsCreated.length !== 0 && (
                <>
                  <SectionHeader>
                    <Typography variant="h6">Owned Projects</Typography>
                  </SectionHeader>
                  {projectsCreated.map((project) => (
                    <div key={project._id}>
                      <ProjectMenuItem
                        project={project}
                        setAnchorEl={setAnchorEl}
                      />
                    </div>
                  ))}
                </>
              )}
              {projectsJoined.length !== 0 && (
                <>
                  <SectionHeader>
                    <Typography variant="h6">Joined Projects</Typography>
                  </SectionHeader>
                  {projectsJoined.map((project) => (
                    <div key={project._id}>
                      <ProjectMenuItem
                        project={project}
                        setAnchorEl={setAnchorEl}
                      />
                    </div>
                  ))}
                </>
              )}
            </>
          ) : (
            <div
              style={{
                height: 250,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <EmojiObjectsIcon
                style={{ height: 56, width: 56, color: "#979a9a" }}
              />
              <Typography variant="h5" style={{ color: "#979a9a" }}>
                So empty...
              </Typography>
            </div>
          )}
        </MenuContainer>
      </ClickAwayListener>
    </Popper>
  );
};

export default ProjectMenu;
