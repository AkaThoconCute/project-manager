import { useRef } from "react";
import { Link } from "react-router-dom";
import { styled } from "@mui/material/styles";
import {
  Typography,
  IconButton,
  Avatar,
  MenuItem,
  Button,
  Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
  NewComment,
  NewComments,
  NewToDoList,
  NewToDoLists,
  ProjectInvitation,
  RemovedFromProject,
  TaskArchived,
  TaskAssignment,
  TaskDeleted,
  TaskRestored,
  ToDoListDeleted,
  ToDoListsDeleted,
  TaskTitleUpdate,
  TaskDeadlineUpdate,
  TaskDescriptionUpdate,
  ProjectDeleted,
  PermissionsUpdated,
  TaskLabelsUpdate,
} from "./NotificationConstants";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import type {
  Notification,
  UserSummary,
  ProjectSummary,
} from "../../../../types/models";

dayjs.extend(relativeTime);

const NotificationContainer = styled(MenuItem)({
  borderBottom: "1px solid #e8e2e2",
  padding: 10,
});

const FlexContainer = styled("div")({
  display: "flex",
  width: "100%",
  alignItems: "center",
});

const MessageContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  marginLeft: 10,
});

const CaptionTypography = styled(Typography)({
  color: "#979a9a",
  fontSize: "0.71rem",
});

const DescriptionTypography = styled(Typography)({
  maxWidth: 371,
  textOverflow: "ellipsis",
  overflow: "hidden",
});

const ActionsOverlay = styled("div")({
  display: "flex",
  justifyContent: "center",
  position: "absolute",
  top: 0,
  width: "100%",
  background: "#f0f8ffd6",
  height: "100%",
  alignItems: "center",
  "& button": {
    backgroundColor: "#f0f8ff",
    "&:nth-child(1)": {
      marginRight: 10,
    },
    "&:nth-child(1):hover": {
      background: "#ffedf1",
    },
    "&:nth-child(2):hover": {
      background: "#d5f9ff",
    },
  },
});

const CloseButton = styled(IconButton)({
  position: "absolute",
  top: 3,
  right: 3,
  padding: 5,
});

interface NotificationItemProps {
  projectNotificationHandle: (index: number) => void;
  discardNotificationHandle: (notificationId: string, index: number) => void;
  actionHandle: (notification: Notification) => void;
  notificationsIndexes: number[];
  notification: Notification;
  index: number;
}

const NotificationItem = ({
  projectNotificationHandle,
  discardNotificationHandle,
  actionHandle,
  notificationsIndexes,
  notification,
  index,
}: NotificationItemProps) => {
  const descriptionRef = useRef<HTMLSpanElement>(null);
  const elementOverflowed =
    descriptionRef.current &&
    descriptionRef.current.scrollWidth > descriptionRef.current.clientWidth;

  const sender = notification.sender as UserSummary;
  const project = notification.project as ProjectSummary;
  const task = notification.task as unknown as
    | { _id: string; title: string }
    | undefined;

  const description =
    (notification.type === ProjectInvitation && (
      <span>
        <strong>{sender.username}</strong>
        {" invited you to join project: "}
        <strong>{`"${project.title}"`}</strong>
      </span>
    )) ||
    (notification.type === TaskAssignment && (
      <span>
        <strong>{sender.username}</strong>
        {" assigned you to task: "}
        <strong>{`"${task?.title}"`}</strong>
      </span>
    )) ||
    (notification.type === RemovedFromProject && (
      <span>
        <strong>{sender.username}</strong>
        {notification.description?.split(":")[0]}
        <strong>{notification.description?.split(":")[1]}</strong>
      </span>
    )) ||
    (notification.type === TaskArchived && (
      <span>
        <strong>{sender.username}</strong>
        {" archived task: "}
        <strong>{`"${task?.title}"`}</strong>
      </span>
    )) ||
    (notification.type === TaskDeleted && (
      <span>
        <strong>{sender.username}</strong>
        {" deleted task: "}
        <strong>{`"${notification.description}"`}</strong>
      </span>
    )) ||
    (notification.type === TaskRestored && (
      <span>
        <strong>{sender.username}</strong>
        {" restored task: "}
        <strong>{`"${task?.title}"`}</strong>
      </span>
    )) ||
    (notification.type === NewToDoList && (
      <span>
        <strong>{sender.username}</strong>
        {" added new to-do list to task: "}
        <strong>{`"${task?.title}"`}</strong>
      </span>
    )) ||
    (notification.type === NewToDoLists && (
      <span>
        <strong>{sender.username}</strong>
        {" added new to-do lists to task : "}
        <strong>{`"${task?.title}"`}</strong>
      </span>
    )) ||
    (notification.type === ToDoListDeleted && (
      <span>
        <strong>{sender.username}</strong>
        {" deleted to-do list from task: "}
        <strong>{`"${task?.title}"`}</strong>
      </span>
    )) ||
    (notification.type === ToDoListsDeleted && (
      <span>
        <strong>{sender.username}</strong>
        {" deleted to-do lists from task: "}
        <strong>{`"${task?.title}"`}</strong>
      </span>
    )) ||
    (notification.type === NewComment && (
      <span>
        <strong>{sender.username}</strong>
        {" commented on task: "}
        <strong>{`"${task?.title}"`}</strong>
      </span>
    )) ||
    (notification.type === NewComments && (
      <span>
        There are new comments on task:
        <strong>{` "${task?.title}"`}</strong>
      </span>
    )) ||
    (notification.type === TaskTitleUpdate && (
      <span>
        <strong>{sender.username}</strong>
        {" updated title in task: "}
        <strong>{`"${task?.title}"`}</strong>
      </span>
    )) ||
    (notification.type === TaskDeadlineUpdate && (
      <span>
        <strong>{sender.username}</strong>
        {" updated deadline in task: "}
        <strong>{`"${task?.title}"`}</strong>
      </span>
    )) ||
    (notification.type === TaskDescriptionUpdate && (
      <span>
        <strong>{sender.username}</strong>
        {" updated description in task: "}
        <strong>{`"${task?.title}"`}</strong>
      </span>
    )) ||
    (notification.type === TaskLabelsUpdate && (
      <span>
        <strong>{sender.username}</strong>
        {" updated labels in task: "}
        <strong>{`"${task?.title}"`}</strong>
      </span>
    )) ||
    (notification.type === ProjectDeleted && (
      <span>
        <strong>{sender.username}</strong>
        {" has just"}
        {notification.description?.split(":")[0]}
        <strong>{notification.description?.split(":")[1]}</strong>
      </span>
    )) ||
    (notification.type === PermissionsUpdated && (
      <span>
        <strong>{sender.username}</strong>
        {notification.description === "1"
          ? " took your administrator permissions in project:"
          : " set your permissions to administrator in project:"}
        <strong>{` "${project.title}"`}</strong>
      </span>
    ));

  return (
    <div style={{ position: "relative" }}>
      <NotificationContainer
        onClick={() => projectNotificationHandle(index)}
        disabled={notificationsIndexes.indexOf(index) !== -1}
      >
        <FlexContainer>
          <Link to={`/profile/${sender._id}`}>
            <Avatar src={sender.profilePicture ?? undefined} />
          </Link>
          <MessageContainer>
            <CaptionTypography
              variant="caption"
              style={{ textTransform: "capitalize" }}
            >
              {notification.type}
            </CaptionTypography>
            <Tooltip title={elementOverflowed ? description : ""}>
              <DescriptionTypography variant="body2" ref={descriptionRef}>
                {description}
              </DescriptionTypography>
            </Tooltip>
            <CaptionTypography variant="caption">
              {dayjs(notification.createdAt).fromNow()}
            </CaptionTypography>
          </MessageContainer>
        </FlexContainer>
      </NotificationContainer>
      {notificationsIndexes.indexOf(index) !== -1 && (
        <ActionsOverlay>
          <Button
            color="secondary"
            onClick={() => discardNotificationHandle(notification._id, index)}
            style={{
              marginRight:
                notification.type === RemovedFromProject ? 0 : undefined,
            }}
          >
            Discard
          </Button>
          {![RemovedFromProject, ProjectDeleted, TaskDeleted].includes(
            notification.type,
          ) && (
            <Button
              variant="outlined"
              color="primary"
              onClick={() => actionHandle(notification)}
            >
              {notification.type === ProjectInvitation ? "Join" : "Open"}
            </Button>
          )}
          <CloseButton
            color="secondary"
            onClick={() => projectNotificationHandle(index)}
          >
            <CloseIcon />
          </CloseButton>
        </ActionsOverlay>
      )}
    </div>
  );
};
export default NotificationItem;
