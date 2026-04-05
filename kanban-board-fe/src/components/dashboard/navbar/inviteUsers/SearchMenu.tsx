import {
  Avatar,
  CircularProgress,
  ClickAwayListener,
  Grow,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Typography,
} from "@mui/material";
import { useAppSelector } from "../../../../redux/hooks";

interface FoundUser {
  _id: string;
  username: string;
  email: string;
  profilePicture?: string;
  joinedStatus?: string | boolean;
}

interface SearchMenuProps {
  open: boolean;
  anchorEl: HTMLElement | null;
  handleClose: () => void;
  clickAction: (user: FoundUser) => void;
  usersToInvite: { _id: string }[];
}

const SearchMenu = ({
  clickAction,
  open,
  anchorEl,
  handleClose,
  usersToInvite,
}: SearchMenuProps) => {
  const { loading, users, error } = useAppSelector(
    (state) => state.projectFindUsers,
  );
  const { userInfo } = useAppSelector((state) => state.userLogin);

  return (
    <Popper
      open={open}
      anchorEl={anchorEl}
      role={undefined}
      disablePortal
      transition
    >
      {({ TransitionProps }) => (
        <Grow {...TransitionProps} style={{ transformOrigin: "center bottom" }}>
          <Paper
            style={{
              width: 286,
              minHeight: 50,
              maxHeight: 170,
              overflow: "auto",
              padding: 4,
              marginTop: 10,
              borderRadius: 3,
              backgroundColor: "#fbfbfb",
              boxShadow:
                "0 8px 16px -4px rgba(9,30,66,.25), 0 0 0 1px rgba(9,30,66,.08)",
            }}
          >
            <ClickAwayListener
              onClickAway={(e) => {
                if ((e as MouseEvent).target !== anchorEl) handleClose();
              }}
            >
              <MenuList style={{ outline: "none" }}>
                {loading ? (
                  <CircularProgress
                    style={{
                      width: 40,
                      height: 40,
                      position: "relative",
                      top: "calc(50% - 20px)",
                      left: "calc(50% - 20px)",
                    }}
                  />
                ) : users && users.length > 0 ? (
                  users.map((user) => {
                    const foundUser = user as FoundUser;
                    const alreadyAdded =
                      usersToInvite.findIndex(
                        (x) => x._id === foundUser._id,
                      ) !== -1;
                    const avatarSrc = foundUser.profilePicture
                      ? userInfo?._id === foundUser._id
                        ? (userInfo.profilePicture ?? undefined)
                        : foundUser.profilePicture
                      : undefined;

                    return (
                      <MenuItem
                        key={foundUser._id}
                        style={{ padding: "4px 6px" }}
                        onClick={() => clickAction(foundUser)}
                        disabled={
                          alreadyAdded || Boolean(foundUser.joinedStatus)
                        }
                      >
                        <Avatar
                          src={avatarSrc}
                          style={{
                            width: 35,
                            height: 35,
                            fontSize: "1rem",
                            marginRight: 10,
                          }}
                        >
                          {!avatarSrc ? foundUser.username[0] : undefined}
                        </Avatar>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            overflowX: "hidden",
                          }}
                        >
                          <Typography
                            variant="subtitle2"
                            style={{ color: "#0f386b" }}
                          >
                            {foundUser.username}
                            {foundUser.joinedStatus
                              ? ` ${foundUser.joinedStatus}`
                              : ""}
                          </Typography>
                          <Typography
                            variant="caption"
                            style={{
                              color: "#9c9c9c",
                              textOverflow: "ellipsis",
                              overflowX: "hidden",
                            }}
                          >
                            {foundUser.email}
                          </Typography>
                        </div>
                      </MenuItem>
                    );
                  })
                ) : (
                  error && (
                    <Typography variant="subtitle2" align="center">
                      {error}
                    </Typography>
                  )
                )}
              </MenuList>
            </ClickAwayListener>
          </Paper>
        </Grow>
      )}
    </Popper>
  );
};

export default SearchMenu;
