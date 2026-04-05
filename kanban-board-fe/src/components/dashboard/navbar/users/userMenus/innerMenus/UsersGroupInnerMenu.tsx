import Typography from "@mui/material/Typography";
import UserItem from "../../UserItem";
import MenuHeader from "../../../../shared/MenuHeader";
import type { ProjectUser, UserSummary } from "../../../../../../types/models";

interface UsersGroupInnerMenuProps {
  administrators: ProjectUser[];
  normalUsers: ProjectUser[];
  invitedUsers: ProjectUser[];
  handleClose: () => void;
  handleUserClick: (user: ProjectUser) => void;
}

const captionStyle = { fontWeight: 700, color: "#6f6e6e" } as const;

const UsersGroupInnerMenu = ({
  administrators,
  normalUsers,
  invitedUsers,
  handleClose,
  handleUserClick,
}: UsersGroupInnerMenuProps) => (
  <div style={{ width: 290, outline: "none", position: "relative" }}>
    <MenuHeader handleClose={handleClose} title="Project Members" />
    <div style={{ maxHeight: 350, overflow: "auto" }}>
      <div style={{ marginLeft: 8 }}>
        <Typography variant="caption" sx={captionStyle}>
          Administrators
        </Typography>
        <div style={{ display: "flex", flexWrap: "wrap", marginTop: 2 }}>
          {administrators.map((user) => (
            <UserItem
              key={(user.user as UserSummary)._id}
              handleUserClick={() => handleUserClick(user)}
              user={user.user as UserSummary}
              permissions={user.permissions}
              allUsersMenu={true}
            />
          ))}
        </div>
      </div>
      {normalUsers.length !== 0 && (
        <div style={{ marginLeft: 8 }}>
          <Typography variant="caption" sx={captionStyle}>
            Users
          </Typography>
          <div style={{ display: "flex", flexWrap: "wrap", marginTop: 2 }}>
            {normalUsers.map((user) => (
              <UserItem
                key={(user.user as UserSummary)._id}
                handleUserClick={() => handleUserClick(user)}
                user={user.user as UserSummary}
                permissions={user.permissions}
                allUsersMenu={true}
              />
            ))}
          </div>
        </div>
      )}
      {invitedUsers.length !== 0 && (
        <div style={{ marginLeft: 8 }}>
          <Typography variant="caption" sx={captionStyle}>
            Invited
          </Typography>
          <div style={{ display: "flex", flexWrap: "wrap", marginTop: 2 }}>
            {invitedUsers.map((user) => (
              <UserItem
                key={(user.user as UserSummary)._id}
                handleUserClick={() => handleUserClick(user)}
                user={user.user as UserSummary}
                permissions={user.permissions}
                allUsersMenu={true}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
);

export default UsersGroupInnerMenu;
