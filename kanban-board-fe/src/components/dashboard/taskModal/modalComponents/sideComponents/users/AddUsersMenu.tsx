import { useEffect, useState } from "react";
import Menu from "@mui/material/Menu";
import Button from "@mui/material/Button";
import { useAppDispatch, useAppSelector } from "../../../../../../redux/hooks";
import { taskUsersUpdate } from "../../../../../../redux/actions/projectActions";
import Loader from "../../../../../Loader";
import MenuHeader from "../../../../shared/MenuHeader";
import UserItem from "./UserItem";
import type { UserSummary } from "../../../../../../types/models";

interface SelectableUser extends UserSummary {
  selected?: boolean;
}

interface AddUsersMenuProps {
  anchorEl: HTMLElement | null;
  handleClose: () => void;
  selectedUsers?: UserSummary[];
  projectId: string;
  taskId: string;
  disabled?: boolean;
}

const AddUsersMenu = ({
  anchorEl,
  handleClose,
  selectedUsers: selected = [],
  projectId,
  taskId,
  disabled,
}: AddUsersMenuProps) => {
  const dispatch = useAppDispatch();
  const { project } = useAppSelector((state) => state.projectGetData);
  const { userInfo } = useAppSelector((state) => state.userLogin);
  const [users, setUsers] = useState<SelectableUser[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (project?.users) {
      const allUsersCopy = structuredClone(project.users);
      const usersAvailable = allUsersCopy.reduce<SelectableUser[]>(
        (acc, projectUser) => {
          const userSummary =
            typeof projectUser.user === "string"
              ? null
              : (projectUser.user as UserSummary);
          if (!userSummary) return acc;
          const isSelected = selected.some((u) => u._id === userSummary._id);
          const userAvailable = !isSelected && projectUser.permissions !== 0;
          if (userAvailable) acc.push(userSummary);
          return acc;
        },
        [],
      );
      const fixedSelectedUsers: SelectableUser[] = selected.map((user) => ({
        ...user,
        selected: true,
      }));
      setUsers([...fixedSelectedUsers, ...usersAvailable]);
    }
  }, [anchorEl, selected, project]);

  const unselectClick = (index: number) => {
    setUsers((prevUsers) => {
      const copy = [...prevUsers];
      copy[index] = { ...copy[index], selected: false };
      return copy;
    });
  };

  const selectClick = (index: number) => {
    setUsers((prevUsers) => {
      const copy = [...prevUsers];
      copy[index] = { ...copy[index], selected: true };
      return copy;
    });
  };

  const saveUsers = () => {
    setLoading(true);
    const newUsersArray = users.reduce<string[]>((acc, user) => {
      if (user.selected) acc.push(user._id);
      return acc;
    }, []);
    const removedUsers = selected
      .filter((u) => !newUsersArray.includes(u._id))
      .map((u) => u._id);
    const addedUsers = newUsersArray.filter(
      (id) => !selected.find((u) => u._id === id),
    );
    if (removedUsers.length === 0 && addedUsers.length === 0) {
      setLoading(false);
      handleClose();
    } else {
      dispatch(
        taskUsersUpdate(
          taskId,
          projectId,
          newUsersArray,
          removedUsers,
          addedUsers,
          () => {
            setLoading(false);
            handleClose();
          },
        ),
      );
    }
  };

  return (
    <Menu
      anchorEl={anchorEl}
      keepMounted
      open={Boolean(anchorEl)}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      transformOrigin={{ vertical: "top", horizontal: "left" }}
      transitionDuration={0}
    >
      <div style={{ outline: "none" }}>
        <MenuHeader title="Users" handleClose={handleClose} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "10px 5px 5px 10px",
            marginRight: 5,
            width: 270,
            maxHeight: 250,
            overflowY: "auto",
          }}
        >
          {users.map((user, i) => (
            <UserItem
              key={i}
              selected={Boolean(user.selected)}
              profilePicture={
                userInfo?._id === user._id
                  ? userInfo.profilePicture
                  : user.profilePicture
              }
              username={user.username}
              clickHandle={() =>
                user.selected ? unselectClick(i) : selectClick(i)
              }
            />
          ))}
        </div>
        <div style={{ paddingTop: 5, position: "relative" }}>
          <Button
            color="secondary"
            onClick={handleClose}
            style={{ margin: "0 5px 0 10px" }}
            size="small"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            color="primary"
            variant="contained"
            onClick={saveUsers}
            size="small"
            disabled={loading || disabled}
            style={{ position: "relative" }}
          >
            Save{loading && <Loader button />}
          </Button>
        </div>
      </div>
    </Menu>
  );
};

export default AddUsersMenu;
