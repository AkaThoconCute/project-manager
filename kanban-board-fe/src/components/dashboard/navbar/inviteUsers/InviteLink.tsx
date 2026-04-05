import LinkIcon from "@mui/icons-material/Link";
import { Button, TextField, Typography } from "@mui/material";
import { useAppSelector } from "../../../../redux/hooks";

const InviteLink = () => {
  const { project } = useAppSelector((state) => state.projectGetData);
  const { socket } = useAppSelector((state) => state.socketConnection);

  const linkBtnAction = () => {
    if (!project || !socket) return;
    if (project.joinIdActive) {
      socket.emit("project-disable-join-link", { projectId: project._id });
    } else {
      socket.emit("project-create-join-link", { projectId: project._id });
    }
  };

  const joinLink = project
    ? `${window.location.origin}/invite/${project._id}/${project.joinId}`
    : "";

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <LinkIcon />
          <Typography
            variant="subtitle2"
            style={{ marginLeft: 5, fontWeight: 600, color: "#0f386b" }}
          >
            Invite with Link
          </Typography>
        </div>
        <Typography
          variant="subtitle2"
          onClick={linkBtnAction}
          color="primary"
          style={{
            textDecoration: "underline",
            cursor: "pointer",
            userSelect: "none",
          }}
        >
          {project?.joinIdActive ? "Disable Link" : "Create Link"}
        </Typography>
      </div>
      <Typography variant="caption" style={{ color: "#9c9c9c" }}>
        Anyone having this link can join your project
      </Typography>
      {project?.joinIdActive && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 2,
          }}
        >
          <TextField
            variant="outlined"
            onFocus={(e) => e.currentTarget.select()}
            value={joinLink}
            margin="dense"
            fullWidth
            InputProps={{ readOnly: true }}
          />
          <Button
            color="primary"
            variant="contained"
            style={{ marginLeft: 10, marginTop: 2 }}
            onClick={() => navigator.clipboard.writeText(joinLink)}
          >
            Copy
          </Button>
        </div>
      )}
    </div>
  );
};

export default InviteLink;
