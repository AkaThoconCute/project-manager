import { Link } from "react-router-dom";
import { styled, Typography, Grid, Skeleton } from "@mui/material";
import useLazyImage from "./LazyImage";
import type { ProjectSummary, ProjectTheme } from "../../types/models";

interface BoardItemProps {
  project: ProjectSummary;
  projectsThemes: Record<string, ProjectTheme> | undefined;
}

const Container = styled("div")({
  height: 130,
  borderRadius: 5,
  backgroundColor: "rgba(255, 255, 255, 0.4)",
  wordBreak: "break-all",
  position: "relative",
  transition: "background-color 0.2s ease",
  "&:hover": {
    "& div": {
      backgroundColor: "rgba(0, 0, 0, 0) !important",
    },
  },
});

const TextContrastKeeper = styled("div")({
  transition: "background-color 0.1s ease",
  position: "absolute",
  height: "100%",
  width: "100%",
  top: 0,
  left: 0,
  zIndex: 1,
  borderRadius: 5,
});

const StyledLink = styled(Link)({
  textDecoration: "none",
});

const StyledTypography = styled(Typography)({
  color: "#fff",
  fontWeight: 600,
  padding: "10px 0 0 10px",
  position: "absolute",
  top: 0,
  zIndex: 2,
});

const StyledSkeleton = styled(Skeleton)({
  height: "100%",
  position: "absolute",
  top: 0,
  bottom: 0,
  right: 0,
  left: 0,
  borderRadius: 5,
});

const BoardItem = ({ project, projectsThemes }: BoardItemProps) => {
  const background = projectsThemes?.[project._id]?.background;
  const color = background?.startsWith("linear") ? background : undefined;
  const imgLoaded = useLazyImage(!color ? background : undefined);

  return (
    <Grid size={{ lg: 3, md: 4, sm: 6, xs: 6 }}>
      <StyledLink to={`/project/${project._id}`}>
        <Container
          style={{
            backgroundImage: color || undefined,
          }}
        >
          {!color && background && (
            <>
              {imgLoaded ? (
                <div
                  style={{
                    backgroundImage: `url(${imgLoaded})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    height: "100%",
                    width: "100%",
                    borderRadius: 5,
                  }}
                />
              ) : (
                <StyledSkeleton variant="rectangular" />
              )}
            </>
          )}
          <StyledTypography variant="subtitle2">
            {project.title.length < 90
              ? project.title
              : `${project.title.substring(0, 90)}...`}
          </StyledTypography>
          <TextContrastKeeper
            className="contrast-div"
            style={{
              backgroundColor:
                !color && background
                  ? imgLoaded
                    ? "rgba(0, 0, 0, 0.2)"
                    : "initial"
                  : "rgba(0, 0, 0, 0.2)",
            }}
          />
        </Container>
      </StyledLink>
    </Grid>
  );
};

export default BoardItem;
