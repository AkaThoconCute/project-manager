import { useState } from "react";

import { Typography, Paper, InputAdornment, Input, Modal } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";

import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { sendMessage } from "../../../../redux/actions/projectActions";
import Messages from "./Messages";

interface ChatContainerProps {
  closeChat: () => void;
  open: boolean;
  mobile: boolean;
}

const ChatContainer = ({ closeChat, open, mobile }: ChatContainerProps) => {
  const dispatch = useAppDispatch();
  const { userInfo } = useAppSelector((state) => state.userLogin);
  const [message, setMessage] = useState("");

  const sendMessageAction = () => {
    if (message !== "") dispatch(sendMessage(message, () => setMessage("")));
  };

  const keyDownHandle = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && message !== "") sendMessageAction();
  };

  const chatBody = (
    <Paper
      elevation={3}
      sx={
        mobile
          ? {
              background: "#fff",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              outline: "none",
              borderRadius: 0,
            }
          : {
              position: "fixed",
              maxHeight: 450,
              width: 350,
              zIndex: 10,
              right: 0,
              bottom: 10,
              margin: "0 10px 10px 0",
              display: !mobile ? (open ? "initial" : "none") : undefined,
            }
      }
    >
      <div
        style={{
          backgroundColor: "#f8f9fc",
          padding: 10,
          borderBottom: "1px solid #d0d3dc",
          borderTopRightRadius: 8,
          borderTopLeftRadius: 8,
          display: "flex",
          justifyContent: "space-between",
          transition: "background-color 0.2s ease",
        }}
      >
        <Typography variant="body1">Group Chat</Typography>
        <CloseIcon style={{ cursor: "pointer" }} onClick={closeChat} />
      </div>
      <Messages userId={userInfo!._id} open={open} mobile={mobile} />
      <Input
        placeholder="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        fullWidth
        onKeyDown={keyDownHandle}
        inputProps={{ spellCheck: "false" }}
        sx={{
          height: 50,
          "&:hover:before": {
            borderBottomColor: "transparent !important",
          },
          "& input": {
            background: "#e4e4e4",
            padding: "7px 15px",
            borderRadius: 16,
            margin: "0 7px",
            transition: ".1s ease",
            "&:focus, &:hover": {
              background: "#d8d8d8",
            },
          },
        }}
        endAdornment={
          <InputAdornment position="end">
            <div
              onClick={sendMessageAction}
              style={{
                color: "#535353",
                cursor: "pointer",
                margin: "4px 10px 0 0",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.color = "#000";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.color = "#535353";
              }}
            >
              <SendIcon />
            </div>
          </InputAdornment>
        }
      />
    </Paper>
  );

  return (
    <>
      {mobile ? (
        <Modal open={open} disableScrollLock onClose={closeChat}>
          {chatBody}
        </Modal>
      ) : (
        chatBody
      )}
    </>
  );
};

export default ChatContainer;
