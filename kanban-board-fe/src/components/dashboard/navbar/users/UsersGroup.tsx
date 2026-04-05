import { useState } from "react";
import type { ProjectUser, UserSummary } from "../../../../types/models";

import UserItem from "./UserItem";
import GroupMenu from "./userMenus/GroupMenu";

interface UserMenuEntry {
  user: UserSummary;
  permissions: number;
}

interface UsersGroupProps {
  users: ProjectUser[];
  handleUserClick: (anchor: HTMLElement, user: UserMenuEntry) => void;
  projectId: string;
  userPermissions: number;
  creatorId: string;
  maxUsers?: number;
}

const UsersGroup = ({
  users,
  handleUserClick,
  projectId,
  userPermissions,
  creatorId,
  maxUsers = 6,
}: UsersGroupProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          margin: "16px 0 8px -3px",
        }}
      >
        <div style={{ display: "flex", marginLeft: 10 }}>
          {users.slice(0, maxUsers).map((projectUser, index) => {
            const userSummary = projectUser.user as UserSummary;
            return (
              <UserItem
                key={userSummary._id}
                permissions={projectUser.permissions}
                user={userSummary}
                handleUserClick={(e: React.MouseEvent) =>
                  handleUserClick(e.currentTarget as HTMLElement, {
                    user: userSummary,
                    permissions: projectUser.permissions,
                  })
                }
                zIndex={users.length - index}
              />
            );
          })}
        </div>
        {(users.length >= 7 || maxUsers === 0) && (
          <div
            onClick={(e) => setAnchorEl(e.currentTarget)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minWidth: 32,
              height: 32,
              borderRadius: 18,
              border: "2px solid #fafafa",
              marginLeft: -7,
              backgroundColor: "#bdbdbd",
              transition: "background-color .1s ease",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.backgroundColor =
                "#9a9797";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.backgroundColor =
                "#bdbdbd";
            }}
          >
            <p
              style={{
                color: "#fff",
                fontSize: "19px",
                marginLeft: 4,
                marginRight: 4,
              }}
            >
              +{users.length - maxUsers}
            </p>
          </div>
        )}
      </div>
      <GroupMenu
        anchorEl={anchorEl}
        handleClose={() => setAnchorEl(null)}
        users={users}
        projectId={projectId}
        creatorId={creatorId}
        userPermissions={userPermissions}
      />
    </>
  );
};

export default UsersGroup;
