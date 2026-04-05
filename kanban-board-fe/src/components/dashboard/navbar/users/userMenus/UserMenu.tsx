import Menu from "@mui/material/Menu";
import AdminInnerMenu from "./innerMenus/AdminInnerMenu";
import NormalInnerMenu from "./innerMenus/NormalInnerMenu";
import type { UserSummary } from "../../../../../types/models";

interface UserMenuProps {
  anchorEl: HTMLElement | null;
  handleClose: () => void;
  userPermissions: number;
  profilePicture: string;
  user: UserSummary;
  permissions: number;
  projectOwner: boolean;
  projectId: string;
}

const UserMenu = ({
  anchorEl,
  handleClose,
  userPermissions,
  profilePicture,
  user,
  permissions,
  projectOwner,
  projectId,
}: UserMenuProps) => (
  <Menu
    disableScrollLock
    anchorEl={anchorEl}
    open={Boolean(anchorEl)}
    onClose={handleClose}
    anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
    transformOrigin={{ vertical: "top", horizontal: "top" }}
  >
    {userPermissions === 2 && (
      <AdminInnerMenu
        user={user}
        profilePicture={profilePicture}
        permissions={permissions}
        projectOwner={projectOwner}
        projectId={projectId}
        handleClose={handleClose}
      />
    )}
    {userPermissions === 1 && (
      <NormalInnerMenu
        handleClose={handleClose}
        user={user}
        profilePicture={profilePicture}
        permissions={permissions}
        projectId={projectId}
      />
    )}
  </Menu>
);

export default UserMenu;
