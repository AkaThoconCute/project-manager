import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { markNotificationsSeen } from "../../../../redux/actions/userActions";
import { IconButton, Badge } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import NotificationsMenu from "./NotificationsMenu";

const Notifications = () => {
  const { notifications } = useAppSelector((state) => state.userLogin);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (
      notifications &&
      notifications.newNotificationsCount !== 0 &&
      anchorEl
    ) {
      dispatch(markNotificationsSeen());
    }
  }, [dispatch, notifications, anchorEl]);

  const openNotificationsHandle = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
    if (notifications && notifications.newNotificationsCount !== 0) {
      dispatch(markNotificationsSeen());
    }
  };

  return (
    <>
      <IconButton color="inherit" onClick={openNotificationsHandle}>
        <Badge
          badgeContent={notifications && notifications.newNotificationsCount}
          color="secondary"
        >
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <NotificationsMenu
        anchorEl={anchorEl}
        handleClose={() => setAnchorEl(null)}
      />
    </>
  );
};
export default Notifications;
