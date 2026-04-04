import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import FolderIcon from "@mui/icons-material/Folder";
import { Typography, styled } from "@mui/material";
import { useAppSelector } from "../../../../../redux/hooks";

const Container = styled("div")({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  border: "2px solid #b2c2f1",
  borderRadius: 4,
  height: 40,
  cursor: "pointer",
  margin: "0 14px",
  transition: "border .25s ease-out",
  "&:hover": {
    border: "2px solid #fff",
  },
  "& svg": {
    marginRight: "5px",
  },
});

const InnerContainer = styled("div")({
  display: "flex",
  alignItems: "center",
  width: "85%",
});

const StyledText = styled(Typography)({
  overflowX: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  userSelect: "none",
});

interface SelectProps {
  anchorEl: HTMLElement | null;
  setAnchorEl: (el: HTMLElement | null) => void;
  navExpanded: boolean;
}

const Select = ({ anchorEl, setAnchorEl, navExpanded }: SelectProps) => {
  const { project } = useAppSelector((state) => state.projectSetCurrent);

  return (
    <Container
      onClick={(e) => setAnchorEl(e.currentTarget)}
      sx={{
        border: anchorEl ? "2px solid #fff" : undefined,
        display: !navExpanded ? "inline-flex" : undefined,
      }}
    >
      <>
        <InnerContainer sx={{ display: !navExpanded ? "none" : undefined }}>
          <FolderIcon
            sx={{ fontSize: 20, margin: "0 5px" }}
            color={project?.title ? "primary" : undefined}
          />
          <StyledText variant="subtitle2">
            {project ? project.title : "Select Project"}
          </StyledText>
        </InnerContainer>
        {anchorEl ? (
          <ArrowDropUpIcon
            sx={!navExpanded ? { margin: "0 !important" } : undefined}
          />
        ) : (
          <ArrowDropDownIcon
            sx={!navExpanded ? { margin: "0 !important" } : undefined}
          />
        )}
      </>
    </Container>
  );
};

export default Select;
