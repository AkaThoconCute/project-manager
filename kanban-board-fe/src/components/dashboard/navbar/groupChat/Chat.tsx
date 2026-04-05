import { useEffect, useState } from "react";

import { Tooltip, Badge } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";

import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { projectResetNewMessage } from "../../../../redux/slices/projectSlice";
import ChatContainer from "./ChatContainer";

interface ChatProps {
  mobile?: boolean;
  hide?: boolean;
}

const Chat = ({ mobile, hide }: ChatProps) => {
  const dispatch = useAppDispatch();
  const { newMessage } = useAppSelector((state) => state.projectMessages);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open && newMessage) dispatch(projectResetNewMessage());
  }, [dispatch, open, newMessage]);

  const openHandle = () => {
    setOpen((prevState) => !prevState);
    dispatch(projectResetNewMessage());
  };

  return (
    <>
      <Tooltip title="Chat" style={{ display: hide ? "none" : undefined }}>
        <div
          onClick={openHandle}
          style={{
            display: "flex",
            padding: 5,
            cursor: "pointer",
            color: "#fff",
            transition: ".2s ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLDivElement).style.background = "#ffffff21";
            (e.currentTarget as HTMLDivElement).style.borderRadius = "3px";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLDivElement).style.background = "";
            (e.currentTarget as HTMLDivElement).style.borderRadius = "";
          }}
        >
          <Badge
            color="secondary"
            variant="dot"
            invisible={!(newMessage && !open)}
          >
            <ChatIcon />
          </Badge>
        </div>
      </Tooltip>
      <ChatContainer
        closeChat={() => setOpen(false)}
        open={open}
        mobile={!!mobile}
      />
    </>
  );
};

export default Chat;
