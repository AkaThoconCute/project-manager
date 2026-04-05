import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

interface UserItemProps {
  profilePicture: string | null | undefined;
  username: string;
  selected: boolean;
  clickHandle: () => void;
}

const UserItem = ({
  profilePicture,
  username,
  selected,
  clickHandle,
}: UserItemProps) => {
  return (
    <div
      onClick={clickHandle}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 5,
        cursor: "pointer",
        userSelect: "none",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          overflowX: "hidden",
          whiteSpace: "nowrap",
        }}
      >
        <Avatar
          src={profilePicture ?? undefined}
          style={{ marginRight: 10, height: 30, width: 30 }}
        />
        <Typography
          variant="subtitle2"
          style={{
            textOverflow: "ellipsis",
            overflowX: "hidden",
            whiteSpace: "nowrap",
          }}
        >
          {username}
        </Typography>
      </div>
      {selected && (
        <CheckCircleOutlineIcon style={{ color: "#818181", marginRight: 10 }} />
      )}
    </div>
  );
};

export default UserItem;
