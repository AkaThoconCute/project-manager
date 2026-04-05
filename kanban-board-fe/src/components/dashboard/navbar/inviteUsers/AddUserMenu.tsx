import { useState, useEffect, useRef } from "react";
import {
  Button,
  Chip,
  Popover,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import {
  findUsersToInvite,
  sendProjectInvitations,
} from "../../../../redux/actions/projectActions";
import { useAppDispatch } from "../../../../redux/hooks";
import Loader from "../../../Loader";
import InviteLink from "./InviteLink";
import SearchMenu from "./SearchMenu";

interface InviteUser {
  _id: string;
  username: string;
}

interface AddUserMenuProps {
  anchorEl: HTMLElement | null;
  handleClose: () => void;
}

const AddUserMenu = ({ anchorEl, handleClose }: AddUserMenuProps) => {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const [searchOpen, setSearchOpen] = useState(false);
  const [error, setError] = useState<string | false>(false);
  const [userData, setUserData] = useState("");
  const [usersToInvite, setUsersToInvite] = useState<InviteUser[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const closeHandle = () => {
    setLoading(false);
    setUserData("");
    setUsersToInvite([]);
    setSearchOpen(false);
    handleClose();
  };

  useEffect(() => {
    const timeout =
      userData.trim() !== "" &&
      setTimeout(() => {
        dispatch(findUsersToInvite(userData));
        setSearchOpen(true);
      }, 200);
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [dispatch, userData]);

  const changeHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData(e.target.value);
    setError(false);
    setSearchOpen(false);
  };

  const userDeleteHandle = (index: number) => {
    setUsersToInvite((prevUsers) => {
      const newUsers = [...prevUsers];
      newUsers.splice(index, 1);
      return newUsers;
    });
  };

  const addUserHandle = (userToAdd: InviteUser) => {
    setSearchOpen(false);
    setUserData("");
    setUsersToInvite((prev) => [...prev, userToAdd]);
    inputRef.current?.focus();
  };

  const inviteUsersHandle = () => {
    if (usersToInvite.length > 0) {
      setLoading(true);
      dispatch(sendProjectInvitations(usersToInvite, () => closeHandle()));
    }
  };

  return (
    <>
      <Popover
        disableScrollLock
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={closeHandle}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        PaperProps={{
          style: { borderTopLeftRadius: 8, borderTopRightRadius: 8 },
        }}
        transitionDuration={0}
      >
        <div style={{ width: 300, outline: "none" }}>
          <div
            style={{
              backgroundColor: theme.palette.primary.main,
              padding: "2px 0",
              textAlign: "center",
              color: "#fff",
            }}
          >
            <Typography variant="subtitle1" style={{ fontWeight: 700 }}>
              Invite Users
            </Typography>
          </div>

          {usersToInvite.length > 0 && (
            <div
              style={{
                padding: "4px 4px 0",
                maxHeight: 80,
                overflow: "auto",
                border: `2px solid ${theme.palette.primary.main}`,
                margin: 6,
                borderRadius: 4,
              }}
            >
              {usersToInvite.map((user, index) => (
                <Chip
                  key={user._id}
                  style={{ margin: "0 4px 4px 0" }}
                  label={user.username}
                  onDelete={() => userDeleteHandle(index)}
                />
              ))}
            </div>
          )}

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: 250,
              padding: "7px",
              overflowY: "auto",
            }}
          >
            <div>
              <TextField
                inputRef={inputRef}
                name="user"
                type="text"
                label="User"
                variant="outlined"
                value={userData}
                style={{ marginBottom: 10 }}
                fullWidth
                onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
                error={Boolean(error)}
                helperText={error || undefined}
                onChange={changeHandle}
                margin="dense"
                onClick={(e) => e.preventDefault()}
                inputProps={{ autoComplete: "off" }}
              />
              <InviteLink />
            </div>
            <Button
              onClick={inviteUsersHandle}
              color="primary"
              variant="contained"
              fullWidth
              style={{ marginTop: 40, position: "relative" }}
              disabled={loading}
            >
              Invite
              {loading && <Loader button />}
            </Button>
          </div>
        </div>
        <SearchMenu
          anchorEl={inputRef.current}
          open={searchOpen}
          handleClose={() => setSearchOpen(false)}
          clickAction={addUserHandle}
          usersToInvite={usersToInvite}
        />
      </Popover>
    </>
  );
};

export default AddUserMenu;
