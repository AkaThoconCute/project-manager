import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { projectDataPermissionsUpdate } from "../../../../redux/slices/projectSlice";
import type { ProjectUser, UserSummary } from "../../../../types/models";

import UserMenu from "./userMenus/UserMenu";
import UsersGroup from "./UsersGroup";

interface UserMenuEntry {
  user: UserSummary;
  permissions: number;
}

const Users = ({ maxUsers }: { maxUsers?: number }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    project: { users, permissions: userPermissions, _id: projectId, creatorId },
  } = useAppSelector((state) => state.projectGetData) as {
    project: {
      users: ProjectUser[];
      permissions: number;
      _id: string;
      creatorId: string;
    };
  };
  const { userInfo } = useAppSelector((state) => state.userLogin);
  const { socket } = useAppSelector((state) => state.socketConnection);

  const [user, setUser] = useState<UserMenuEntry | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  useEffect(() => {
    socket?.on(
      "user-permissions-changed",
      ({
        userUpdated,
      }: {
        userUpdated: {
          userId: string;
          projectId: string;
          newPermissions: number;
        };
      }) => {
        if (
          userInfo?._id === userUpdated.userId ||
          (user && user.user._id === userUpdated.userId)
        ) {
          setAnchorEl(null);
        }
        if (userInfo?._id === userUpdated.userId) {
          socket.emit("join-board", { room: userUpdated.projectId });
          dispatch(projectDataPermissionsUpdate(userUpdated.newPermissions));
        }
      },
    );

    socket?.on(
      "user-removed",
      ({ userUpdated }: { userUpdated: { userId: string } }) => {
        if (userInfo?._id === userUpdated.userId) {
          navigate("/boards");
        } else if (user && user.user._id === userUpdated.userId) {
          setAnchorEl(null);
        }
      },
    );

    socket?.on("project-deleted", () => {
      navigate("/boards");
    });

    return () => {
      socket?.off("user-permissions-changed");
      socket?.off("user-removed");
      socket?.off("project-deleted");
    };
  }, [dispatch, navigate, socket, anchorEl, userInfo, user]);

  const handleUserClick = (anchor: HTMLElement, clickedUser: UserMenuEntry) => {
    setAnchorEl(anchor);
    setUser(clickedUser);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setUser(null);
  };

  return (
    <>
      <UsersGroup
        users={users}
        handleUserClick={handleUserClick}
        projectId={projectId}
        creatorId={creatorId}
        userPermissions={userPermissions}
        maxUsers={maxUsers}
      />
      {users && user !== null && (
        <UserMenu
          userPermissions={userPermissions}
          anchorEl={anchorEl}
          handleClose={handleClose}
          profilePicture={
            (userInfo?._id === user.user._id
              ? userInfo.profilePicture
              : user.user.profilePicture) ?? ""
          }
          user={user.user}
          permissions={user.permissions}
          projectOwner={user.user._id === creatorId}
          projectId={projectId}
        />
      )}
    </>
  );
};

export default Users;
