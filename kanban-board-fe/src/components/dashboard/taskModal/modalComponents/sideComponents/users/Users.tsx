import { useState } from "react";
import PeopleIcon from "@mui/icons-material/People";
import SideButton from "../SideButton";
import AddUsersMenu from "./AddUsersMenu";
import type { Task, UserSummary } from "../../../../../../types/models";

interface UsersProps {
  task: Task;
  disabled?: boolean;
}

const Users = ({ task, disabled }: UsersProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  return (
    <>
      <SideButton
        icon={<PeopleIcon />}
        text="Users"
        clickHandle={(e) => setAnchorEl(e.currentTarget)}
        disabled={disabled}
      />
      <AddUsersMenu
        anchorEl={anchorEl}
        selectedUsers={task.users as UserSummary[]}
        projectId={task.projectId}
        taskId={task._id}
        handleClose={() => setAnchorEl(null)}
      />
    </>
  );
};

export default Users;
