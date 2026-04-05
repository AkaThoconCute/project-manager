import React from "react";
import { Avatar, AvatarGroup } from "@mui/material";
import { useAppSelector } from "../../../../redux/hooks";
import type { UserSummary } from "../../../../types/models";

interface TaskUsersProps {
  users: (string | UserSummary)[];
}

const TaskUsers: React.FC<TaskUsersProps> = ({ users }) => {
  const { userInfo } = useAppSelector((state) => state.userLogin);

  return (
    <AvatarGroup
      max={4}
      sx={{
        display: "flex",
        width: "100%",
        justifyContent: "flex-end",
        "& > div": {
          height: 30,
          width: 30,
          borderColor: "#ececec",
        },
        "& > div:last-child": {
          fontSize: "1rem",
        },
      }}
    >
      {users.map((user) => {
        const userId = typeof user === "string" ? user : user._id;
        const src =
          typeof user !== "string" && userInfo?._id === user._id
            ? (userInfo.profilePicture ?? undefined)
            : typeof user !== "string"
              ? (user.profilePicture ?? undefined)
              : undefined;
        return <Avatar key={userId} src={src} />;
      })}
    </AvatarGroup>
  );
};

export default TaskUsers;
