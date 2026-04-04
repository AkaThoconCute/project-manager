import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { discardNotification } from "../../../../redux/actions/userActions";
import { styled } from "@mui/material/styles";
import { Typography, MenuItem, Menu } from "@mui/material";
import LocalFloristIcon from "@mui/icons-material/LocalFlorist";
import { ProjectInvitation } from "./NotificationConstants";
import { BACKGROUND_COLORS } from "../../../../util/colorsConstants";
import type { Notification, ProjectSummary } from "../../../../types/models";
import NotificationItem from "./NotificationItem";

const MenuContainer = styled("div")(({ theme }) => ({
  maxHeight: 350,
  overflow: "auto",
  width: 450,
  outline: "none",
  [theme.breakpoints.down("sm")]: {
    width: "100%",
    minWidth: 300,
  },
}));

const Header = styled(Typography)({
  padding: "5px 15px",
  color: "#777777",
  fontWeight: 600,
  backgroundColor: "#d6ecff",
  borderBottom: "1px solid #e8e2e2",
  outline: "none",
});

const EmptyContainer = styled("div")({
  padding: 10,
  display: "flex",
  width: "100%",
  alignItems: "center",
});

const EmptyIcon = styled(LocalFloristIcon)(({ theme }) => ({
  width: theme.spacing(6),
  height: theme.spacing(6),
  marginRight: 10,
}));

interface NotificationsMenuProps {
  anchorEl: HTMLElement | null;
  handleClose: () => void;
}

const NotificationsMenu = ({
  anchorEl,
  handleClose,
}: NotificationsMenuProps) => {
  const { socket } = useAppSelector((state) => state.socketConnection);
  const { notifications } = useAppSelector((state) => state.userLogin);
  const [notificationsIndexes, setNotificationsIndexes] = useState<number[]>(
    [],
  );
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const closeHandle = () => {
    handleClose();
    setNotificationsIndexes([]);
  };

  const projectNotificationHandle = (index: number) => {
    const value = notificationsIndexes.indexOf(index);
    if (value !== -1) {
      setNotificationsIndexes((prevIndexes) => {
        const array = [...prevIndexes];
        array.splice(value, 1);
        return array;
      });
    } else {
      setNotificationsIndexes((prevIndexes) => [...prevIndexes, index]);
    }
  };

  const discardNotificationHandle = (notificationId: string, index: number) => {
    dispatch(discardNotification(notificationId, index, () => closeHandle()));
  };

  const actionHandle = (notification: Notification) => {
    const project = notification.project as ProjectSummary;
    if (notification.type === ProjectInvitation) {
      const background =
        BACKGROUND_COLORS[Math.floor(Math.random() * Math.floor(5))];
      socket?.emit(
        "project-join",
        { projectId: project._id, background },
        () => {
          closeHandle();
          navigate(`/project/${project._id}`);
        },
      );
    } else if (notification.task) {
      const task = notification.task as unknown as {
        _id: string;
        title: string;
      };
      navigate(`/project/${project._id}/${task._id}`);
    } else if (!notification.task && notification.project) {
      navigate(`/project/${project._id}`);
    }
    closeHandle();
  };

  return (
    <Menu
      anchorEl={anchorEl}
      keepMounted
      open={Boolean(anchorEl)}
      onClose={closeHandle}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      MenuListProps={{ style: { padding: 0 } }}
    >
      <Header variant="subtitle1">Notifications</Header>
      <MenuContainer>
        {notifications && notifications.items.length > 0 ? (
          notifications.items.map((notification, index) => (
            <NotificationItem
              key={index}
              projectNotificationHandle={projectNotificationHandle}
              actionHandle={actionHandle}
              discardNotificationHandle={discardNotificationHandle}
              notificationsIndexes={notificationsIndexes}
              notification={notification}
              index={index}
            />
          ))
        ) : (
          <MenuItem disabled style={{ padding: 0 }}>
            <EmptyContainer>
              <EmptyIcon />
              <Typography variant="body2">Nothing to see here</Typography>
            </EmptyContainer>
          </MenuItem>
        )}
      </MenuContainer>
    </Menu>
  );
};
export default NotificationsMenu;
