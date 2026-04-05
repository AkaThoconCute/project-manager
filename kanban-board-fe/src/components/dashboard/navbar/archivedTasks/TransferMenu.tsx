import Menu from "@mui/material/Menu";
import { useAppSelector } from "../../../../redux/hooks";
import type { ListDocument } from "../../../../types/models";

interface TransferMenuProps {
  anchorEl: HTMLElement | null;
  closeHandle: () => void;
  transferActionHandle: (newListIndex: number, newListId: string) => void;
}

const TransferMenu = ({
  anchorEl,
  closeHandle,
  transferActionHandle,
}: TransferMenuProps) => {
  const lists = useAppSelector((state) => state.projectGetData.lists) as
    | ListDocument
    | undefined;

  return (
    <Menu
      anchorEl={anchorEl}
      keepMounted
      open={Boolean(anchorEl)}
      onClose={closeHandle}
      transitionDuration={0}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      transformOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <div style={{ outline: "none", maxWidth: 110, maxHeight: 200 }}>
        {lists?.lists &&
          lists.lists.length > 0 &&
          lists.lists.map((list, listIndex) => (
            <p
              key={list._id}
              onClick={() => transferActionHandle(listIndex, list._id)}
              style={{
                cursor: "pointer",
                overflowX: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                fontSize: ".85rem",
                padding: "6px 8px",
                margin: 0,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor =
                  "rgba(0, 0, 0, 0.04)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = "";
              }}
            >
              {list.title}
            </p>
          ))}
      </div>
    </Menu>
  );
};

export default TransferMenu;
