import { useState } from "react";
import LabelIcon from "@mui/icons-material/Label";
import SideButton from "../SideButton";
import LabelMenu from "./LabelMenu";
import type { Task } from "../../../../../../types/models";

interface LabelProps {
  task: Task;
  disabled?: boolean;
  listIndex: number | false;
  taskIndex: number | false;
}

const Label = ({ task, disabled, listIndex, taskIndex }: LabelProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  return (
    <>
      <SideButton
        icon={<LabelIcon />}
        text="Label"
        clickHandle={(e) => setAnchorEl(e.currentTarget)}
        disabled={disabled}
      />
      <LabelMenu
        task={task}
        listIndex={listIndex}
        taskIndex={taskIndex}
        anchorEl={anchorEl}
        handleClose={() => setAnchorEl(null)}
      />
    </>
  );
};

export default Label;
