import { useState } from "react";
import { Typography, MenuItem, Avatar } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useAppSelector } from "../../../redux/hooks";
import Notifications from "./notifications/Notifications";
import UserModal from "./UserModal";

interface UserNavProps {
  navExpanded: boolean;
  mobile: boolean;
}

const UserNavContainer = styled("div")({
  display: "flex",
  margin: "10px 0 2px",
  height: 52,
});

const UserNav = ({ navExpanded, mobile }: UserNavProps) => {
  const { userInfo } = useAppSelector((state) => state.userLogin);
  const [open, setOpen] = useState(false);

  return (
    <>
      {userInfo && (
        <UserNavContainer
          sx={{
            justifyContent: navExpanded ? "space-around" : "center",
            visibility: !navExpanded && mobile ? "hidden" : undefined,
          }}
        >
          {navExpanded && (
            <MenuItem sx={{ paddingLeft: "5px" }} onClick={() => setOpen(true)}>
              <Avatar
                sx={{ marginRight: "10px" }}
                alt={userInfo.username}
                src={userInfo.profilePicture ?? undefined}
              />
              <Typography variant="body2" noWrap>
                {userInfo.username}
              </Typography>
            </MenuItem>
          )}
          <Notifications />
        </UserNavContainer>
      )}
      <UserModal
        open={open}
        closeHandle={() => setOpen(false)}
        user={userInfo}
      />
    </>
  );
};

export default UserNav;
