import Avatar from "@mui/material/Avatar";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useAppDispatch, useAppSelector } from "../../../../../../redux/hooks";
import { removeUserFromProject } from "../../../../../../redux/actions/projectActions";
import MenuHeader from "../../../../shared/MenuHeader";
import type { UserSummary } from "../../../../../../types/models";

interface NormalInnerMenuProps {
  handleClose: () => void;
  profilePicture: string;
  user: UserSummary;
  permissions: number;
  projectId: string;
  goBackHandle?: () => void;
}

const NormalInnerMenu = ({
  handleClose,
  profilePicture,
  user,
  permissions,
  projectId,
  goBackHandle,
}: NormalInnerMenuProps) => {
  const dispatch = useAppDispatch();
  const { userInfo } = useAppSelector((state) => state.userLogin);

  const removeUserHandle = () => {
    dispatch(removeUserFromProject(user._id, projectId, handleClose));
  };

  return user ? (
    <div style={{ width: 290, outline: "none", position: "relative" }}>
      {goBackHandle && (
        <MenuHeader
          goBackHandle={goBackHandle}
          handleClose={handleClose}
          title="Member"
        />
      )}
      <div style={{ display: "flex", padding: 10 }}>
        <Avatar
          src={profilePicture}
          sx={{ width: 40, height: 40, mr: 0.625 }}
        />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Typography variant="subtitle1">{user.username}</Typography>
          <Typography variant="caption">{user.email}</Typography>
        </div>
      </div>
      {!goBackHandle && (
        <CloseRoundedIcon
          style={{
            position: "absolute",
            right: 16,
            top: 12,
            width: 21,
            height: 21,
            fontSize: "1.3rem",
            cursor: "pointer",
          }}
          onClick={handleClose}
        />
      )}
      {user._id === userInfo?._id && (
        <>
          <MenuItem disabled>Permissions... (Normal)</MenuItem>
          <MenuItem onClick={removeUserHandle}>Leave Project</MenuItem>
        </>
      )}
      {permissions === 1 && user._id !== userInfo?._id && (
        <MenuItem disabled>Permissions... (Normal)</MenuItem>
      )}
      {permissions === 2 && (
        <MenuItem disabled>Permissions... (Administrator)</MenuItem>
      )}
      {permissions === 0 && (
        <MenuItem disabled>Permissions... (Invited)</MenuItem>
      )}
    </div>
  ) : null;
};

export default NormalInnerMenu;
