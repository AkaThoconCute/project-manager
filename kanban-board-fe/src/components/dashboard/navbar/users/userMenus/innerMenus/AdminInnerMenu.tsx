import { useState } from "react";
import Avatar from "@mui/material/Avatar";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useAppDispatch, useAppSelector } from "../../../../../../redux/hooks";
import {
  updateUserPermissions,
  removeUserFromProject,
} from "../../../../../../redux/actions/projectActions";
import MenuHeader from "../../../../shared/MenuHeader";
import type { UserSummary } from "../../../../../../types/models";

interface AdminInnerMenuProps {
  user: UserSummary;
  profilePicture: string;
  permissions: number;
  projectOwner: boolean;
  projectId: string;
  handleClose: () => void;
  goBackHandle?: () => void;
}

const containerStyle = {
  width: 290,
  outline: "none",
  position: "relative" as const,
};

const AdminInnerMenu = ({
  user,
  profilePicture,
  permissions,
  projectOwner,
  projectId,
  handleClose,
  goBackHandle,
}: AdminInnerMenuProps) => {
  const dispatch = useAppDispatch();
  const { userInfo } = useAppSelector((state) => state.userLogin);
  const [permissionsOpened, setPermissionsOpened] = useState(false);

  const updatePermissionsHandle = () => {
    dispatch(
      updateUserPermissions(user._id, permissions, projectId, handleClose),
    );
  };

  const removeUserHandle = () => {
    dispatch(removeUserFromProject(user._id, projectId, handleClose));
  };

  if (permissionsOpened) {
    return (
      <div style={containerStyle}>
        <MenuHeader
          goBackHandle={() => setPermissionsOpened(false)}
          handleClose={handleClose}
          title="Update Permissions"
        />
        <MenuItem
          disabled={permissions === 2}
          sx={{ whiteSpace: "normal", lineHeight: 1, display: "block" }}
          onClick={updatePermissionsHandle}
        >
          <Typography variant="subtitle1">Administrator</Typography>
          <Typography variant="caption">
            Can add and delete users, change permissions, assign users to tasks
            and change project theme
          </Typography>
        </MenuItem>
        <MenuItem
          disabled={permissions === 1}
          sx={{ whiteSpace: "normal", lineHeight: 1, display: "block" }}
          onClick={updatePermissionsHandle}
        >
          <Typography variant="subtitle1">Normal</Typography>
          <Typography variant="caption">
            Can add and edit tasks / lists, comment and send messages in the
            group chat
          </Typography>
        </MenuItem>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      {goBackHandle && (
        <MenuHeader
          goBackHandle={goBackHandle}
          handleClose={handleClose}
          title="Member"
        />
      )}
      <div style={{ padding: 10 }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Avatar
            src={profilePicture}
            sx={{ width: 40, height: 40, mr: 0.625 }}
          />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Typography variant="subtitle1" sx={{ color: "#003a6d" }}>
              {user.username}
            </Typography>
            <Typography variant="caption" sx={{ color: "#8a8a8a" }}>
              {user.email}
            </Typography>
          </div>
        </div>
        {!goBackHandle && (
          <CloseRoundedIcon
            style={{
              position: "absolute",
              right: 10,
              top: 12,
              width: 21,
              height: 21,
              fontSize: "1.3rem",
              cursor: "pointer",
            }}
            onClick={handleClose}
          />
        )}
      </div>
      {permissions === 0 && (
        <MenuItem onClick={removeUserHandle}>Withdraw invitation</MenuItem>
      )}
      {permissions === 1 && (
        <>
          <MenuItem onClick={() => setPermissionsOpened(true)}>
            Update Permissions (Normal)
          </MenuItem>
          <MenuItem onClick={removeUserHandle}>Remove</MenuItem>
        </>
      )}
      {projectOwner && (
        <>
          <MenuItem disabled>Permissions... (Administrator)</MenuItem>
          <MenuItem disabled>
            {user._id === userInfo?._id ? "Leave Project" : "Remove"}
          </MenuItem>
        </>
      )}
      {permissions === 2 && !projectOwner && (
        <>
          <MenuItem onClick={() => setPermissionsOpened(true)}>
            Update Permissions (Administrator)
          </MenuItem>
          <MenuItem onClick={removeUserHandle}>
            {user._id === userInfo?._id ? "Leave Project" : "Remove"}
          </MenuItem>
        </>
      )}
    </div>
  );
};

export default AdminInnerMenu;
