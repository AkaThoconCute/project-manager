import { useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useTheme } from "@mui/material";
import ListMenu from "./ListMenu";

interface ListMoreProps {
  listId: string;
  listIndex: number;
}

const ListMore: React.FC<ListMoreProps> = ({ listId, listIndex }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [hovered, setHovered] = useState(false);
  const theme = useTheme();

  return (
    <>
      <div
        style={{
          position: "absolute",
          top: 3,
          right: 0,
          padding: 5,
          cursor: "pointer",
          color: hovered ? theme.palette.primary.main : "#6b7082",
        }}
        onClick={(e) => setAnchorEl(e.currentTarget)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <MoreVertIcon />
      </div>
      <ListMenu
        anchorEl={anchorEl}
        handleClose={() => setAnchorEl(null)}
        listId={listId}
        listIndex={listIndex}
      />
    </>
  );
};

export default ListMore;
