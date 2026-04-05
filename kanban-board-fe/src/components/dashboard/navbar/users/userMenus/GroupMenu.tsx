import { useEffect, useState } from "react";
import Menu from "@mui/material/Menu";
import { useAppSelector } from "../../../../../redux/hooks";
import AdminInnerMenu from "./innerMenus/AdminInnerMenu";
import NormalInnerMenu from "./innerMenus/NormalInnerMenu";
import UsersGroupInnerMenu from "./innerMenus/UsersGroupInnerMenu";
import type { ProjectUser, UserSummary } from "../../../../../types/models";

interface GroupMenuProps {
  anchorEl: HTMLElement | null;
  handleClose: () => void;
  users: ProjectUser[];
  userPermissions: number;
  projectId: string;
  creatorId: string;
}

const GroupMenu = ({
  anchorEl,
  handleClose,
  users,
  userPermissions,
  projectId,
  creatorId,
}: GroupMenuProps) => {
  const { userInfo } = useAppSelector((state) => state.userLogin);
  const [administrators, setAdministrators] = useState<ProjectUser[]>([]);
  const [normalUsers, setNormalUsers] = useState<ProjectUser[]>([]);
  const [invitedUsers, setInvitedUsers] = useState<ProjectUser[]>([]);
  const [user, setUser] = useState<ProjectUser | null>(null);

  useEffect(() => {
    setAdministrators(users.filter((u) => u.permissions === 2));
    setNormalUsers(users.filter((u) => u.permissions === 1));
    setInvitedUsers(users.filter((u) => u.permissions === 0));
    setUser(null);
  }, [users]);

  const closeHandle = () => {
    handleClose();
    setTimeout(() => setUser(null), 200);
  };

  const handleUserClick = (u: ProjectUser) => {
    setUser(u);
  };

  const goBackHandle = () => {
    setUser(null);
  };

  return (
    <Menu
      disableScrollLock
      anchorEl={anchorEl}
      keepMounted
      open={Boolean(anchorEl)}
      onClose={closeHandle}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      transformOrigin={{ vertical: "top", horizontal: "left" }}
    >
      <div style={{ outline: "none" }}>
        {user ? (
          userPermissions === 2 ? (
            <AdminInnerMenu
              profilePicture={
                userInfo?._id === (user.user as UserSummary)._id
                  ? (userInfo!.profilePicture ?? "")
                  : ((user.user as UserSummary).profilePicture ?? "")
              }
              user={user.user as UserSummary}
              permissions={user.permissions}
              projectOwner={(user.user as UserSummary)._id === creatorId}
              projectId={projectId}
              handleClose={closeHandle}
              goBackHandle={goBackHandle}
            />
          ) : (
            <NormalInnerMenu
              profilePicture={
                userInfo?._id === (user.user as UserSummary)._id
                  ? (userInfo!.profilePicture ?? "")
                  : ((user.user as UserSummary).profilePicture ?? "")
              }
              user={user.user as UserSummary}
              permissions={user.permissions}
              projectId={projectId}
              handleClose={closeHandle}
              goBackHandle={goBackHandle}
            />
          )
        ) : (
          <UsersGroupInnerMenu
            administrators={administrators}
            normalUsers={normalUsers}
            invitedUsers={invitedUsers}
            handleClose={closeHandle}
            handleUserClick={handleUserClick}
          />
        )}
      </div>
    </Menu>
  );
};

export default GroupMenu;
