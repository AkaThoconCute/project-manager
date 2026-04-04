import { useState } from "react";
import ProjectMenu from "./menu/Menu";
import Select from "./menu/Select";

interface ProjectSelectProps {
  navExpanded: boolean;
  mobile: boolean;
}

const ProjectSelect = ({ navExpanded, mobile }: ProjectSelectProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  return (
    <div
      style={{
        visibility: !navExpanded && mobile ? "hidden" : undefined,
        margin: "5px 0",
      }}
    >
      <Select
        setAnchorEl={setAnchorEl}
        anchorEl={anchorEl}
        navExpanded={navExpanded}
      />
      <ProjectMenu anchorEl={anchorEl} setAnchorEl={setAnchorEl} />
    </div>
  );
};

export default ProjectSelect;
