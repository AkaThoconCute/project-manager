import { useEffect, useRef } from "react";

import { Avatar, Tooltip, Typography } from "@mui/material";
import dayjs from "dayjs";

import { useAppSelector } from "../../../../redux/hooks";
import type { Message, UserSummary } from "../../../../types/models";

interface Props {
  open: boolean;
  userId: string;
  mobile: boolean;
}

const getDate = (date: string): string =>
  dayjs(date).format("D MMM YYYY HH:mm");

const Messages = ({ open, userId, mobile }: Props) => {
  const { messages } = useAppSelector((state) => state.projectMessages);
  const containerRef = useRef<HTMLDivElement>(null);
  let lastMessage: Message | undefined;

  const updateScroll = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    if (open) updateScroll();
  }, [messages, open]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: mobile ? "100%" : 350,
        overflowY: "auto",
      }}
    >
      {messages.map((message) => {
        const msgUser = message.user as UserSummary;

        if (msgUser._id === userId) {
          lastMessage = message;
          return (
            <Tooltip
              key={message._id}
              title={getDate(message.createdAt)}
              placement="left"
              slotProps={{ popper: { disablePortal: true } }}
            >
              <div
                style={{
                  display: "flex",
                  width: "fit-content",
                  maxWidth: "70%",
                  margin: "2px 10px 2px auto",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    backgroundColor: "#0099ff",
                    padding: "6px 10px",
                    borderRadius: "15px",
                    color: "#fff",
                    wordBreak: "break-word",
                  }}
                >
                  {message.message}
                </Typography>
              </div>
            </Tooltip>
          );
        } else if (
          lastMessage &&
          (lastMessage.user as UserSummary)._id === msgUser._id
        ) {
          lastMessage = message;
          return (
            <div
              key={message._id}
              style={{
                display: "flex",
                alignItems: "flex-end",
                marginLeft: 32,
                maxWidth: "70%",
              }}
            >
              <Tooltip
                title={getDate(message.createdAt)}
                placement="left"
                slotProps={{ popper: { disablePortal: true } }}
              >
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <Typography
                    variant="body2"
                    sx={{
                      backgroundColor: "#dfdfdf",
                      padding: "6px 10px",
                      borderRadius: "15px",
                      color: "#000",
                      margin: "1px",
                      wordBreak: "break-word",
                    }}
                  >
                    {message.message}
                  </Typography>
                </div>
              </Tooltip>
            </div>
          );
        } else {
          lastMessage = message;
          return (
            <div key={message._id}>
              <Typography
                variant="caption"
                sx={{
                  color: "#a2a2a2",
                  marginTop: "10px",
                  marginLeft: "42px",
                  display: "block",
                }}
              >
                {msgUser.username}
              </Typography>
              <div style={{ display: "flex", maxWidth: "75%" }}>
                <Avatar
                  alt={msgUser.username}
                  src={msgUser.profilePicture ?? undefined}
                  sx={{ width: 32, height: 32 }}
                />
                <Tooltip
                  title={getDate(message.createdAt)}
                  placement="left"
                  slotProps={{ popper: { disablePortal: true } }}
                >
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <Typography
                      variant="body2"
                      sx={{
                        backgroundColor: "#dfdfdf",
                        padding: "6px 10px",
                        borderRadius: "15px",
                        color: "#000",
                        margin: "1px",
                        wordBreak: "break-word",
                      }}
                    >
                      {message.message}
                    </Typography>
                  </div>
                </Tooltip>
              </div>
            </div>
          );
        }
      })}
    </div>
  );
};

export default Messages;
