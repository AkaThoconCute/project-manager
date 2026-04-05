import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useAppSelector } from "../../../../redux/hooks";
import type { UserSummary } from "../../../../types/models";

interface UserItemProps {
  handleUserClick?: (e: React.MouseEvent) => void;
  permissions: number;
  user: UserSummary;
  zIndex?: number;
  allUsersMenu?: boolean;
}

const avatarStyle = {
  width: 32,
  height: 32,
  cursor: "pointer",
};

const avatarBorderFix = {
  border: "2px solid #fafafa",
  borderRadius: "50%",
  zIndex: 11,
  position: "relative" as const,
};

const UserItem = ({
  handleUserClick,
  permissions,
  user,
  zIndex,
  allUsersMenu,
}: UserItemProps) => {
  const { userInfo } = useAppSelector((state) => state.userLogin);
  const userPicture =
    userInfo?._id === user._id ? userInfo.profilePicture : user.profilePicture;

  const avatarEl = (
    <Avatar
      src={userPicture ?? undefined}
      sx={{ ...avatarStyle, ...avatarBorderFix }}
    />
  );

  if (permissions === 2) {
    return (
      <div style={{ zIndex }}>
        <Tooltip
          title={
            allUsersMenu ? user.username : `${user.username} (Administrator)`
          }
          onClick={handleUserClick}
        >
          <div style={{ position: "relative", border: "initial" }}>
            <NotificationsIcon
              color="primary"
              sx={{
                position: "absolute",
                transform: "rotate(-155deg)",
                top: -6,
                right: 0,
              }}
            />
            {avatarEl}
          </div>
        </Tooltip>
      </div>
    );
  }

  if (permissions === 1) {
    return (
      <div style={{ zIndex }}>
        <Tooltip title={user.username} onClick={handleUserClick}>
          <div style={{ position: "relative", border: "initial" }}>
            {avatarEl}
          </div>
        </Tooltip>
      </div>
    );
  }

  if (permissions === 0) {
    return (
      <div style={{ zIndex }}>
        <Tooltip
          title={allUsersMenu ? user.username : `${user.username} (Invited)`}
        >
          <div style={{ position: "relative", border: "initial" }}>
            <div
              onClick={handleUserClick}
              style={{
                cursor: "pointer",
                background: "rgba(255, 255, 255, 0.55)",
                position: "absolute",
                height: "100%",
                width: "100%",
                borderRadius: "50%",
                zIndex: 111,
              }}
            />
            {avatarEl}
          </div>
        </Tooltip>
      </div>
    );
  }

  return null;
};

export default UserItem;
