import type { Task } from "../../../../../types/models";

interface UsersProps {
  selectedUsers: Task["users"];
  projectId: string;
  taskId: string;
  disabled: boolean;
}

const Users = (_props: UsersProps) => {
  return null;
};

export default Users;
