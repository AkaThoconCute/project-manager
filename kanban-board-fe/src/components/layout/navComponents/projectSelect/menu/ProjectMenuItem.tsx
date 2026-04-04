import { NavLink } from "react-router";
import { MenuItem, Typography, styled } from "@mui/material";
import type { ProjectSummary } from "../../../../../types/models";

const StyledNavLink = styled(NavLink)({
  textDecoration: "none",
});

const StyledMenuItem = styled(MenuItem)({
  color: "#4e4949",
});

const StyledText = styled(Typography)({
  fontWeight: 600,
  color: "#585b5f",
  overflowX: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
});

interface ProjectMenuItemProps {
  project: ProjectSummary;
  setAnchorEl: (el: HTMLElement | null) => void;
}

const ProjectMenuItem = ({ project, setAnchorEl }: ProjectMenuItemProps) => {
  return (
    <StyledNavLink
      to={`/project/${project._id}`}
      end
      className={({ isActive }) => (isActive ? "active-project-link" : "")}
    >
      <StyledMenuItem onClick={() => setAnchorEl(null)}>
        <StyledText variant="subtitle2">{project.title}</StyledText>
      </StyledMenuItem>
    </StyledNavLink>
  );
};

export default ProjectMenuItem;
