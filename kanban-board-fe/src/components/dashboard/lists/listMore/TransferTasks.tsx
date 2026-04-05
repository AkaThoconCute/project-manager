import { useAppSelector } from "../../../../redux/hooks";
import type { RootState } from "../../../../types/store";
import MenuHeader from "../../shared/MenuHeader";
import Loader from "../../../Loader";

interface TransferTasksProps {
  handleClose: () => void;
  transferHandle: (
    newListIndex: number,
    listId?: string,
    handleClose?: () => void,
  ) => void;
  listId: string;
  goBackHandle?: () => void;
  title?: string;
  loading?: string | false;
}

const menuItemStyle: React.CSSProperties = {
  fontSize: ".95rem",
  overflowX: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  padding: "6px 16px",
  margin: 0,
  cursor: "pointer",
};

const disabledItemStyle: React.CSSProperties = {
  fontSize: ".95rem",
  overflowX: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  padding: "6px 16px",
  margin: 0,
  cursor: "default",
  opacity: 0.5,
  pointerEvents: "none",
  userSelect: "none",
};

const TransferTasks: React.FC<TransferTasksProps> = ({
  handleClose,
  transferHandle,
  listId,
  title,
  loading,
}) => {
  const { lists } = useAppSelector((state: RootState) => state.projectGetData);

  return (
    <>
      <div style={{ marginBottom: 5 }}>
        <MenuHeader
          handleClose={handleClose}
          title={title ? title : "Transfer tasks to other list"}
        />
      </div>
      <div style={{ width: 270, maxHeight: 250, overflowY: "auto" }}>
        {lists &&
          lists.lists &&
          lists.lists.length > 0 &&
          lists.lists.map((list, listIndex) => (
            <div
              style={{ position: "relative", overflow: "hidden" }}
              key={list._id}
            >
              <p
                style={
                  loading
                    ? disabledItemStyle
                    : list._id === listId
                      ? disabledItemStyle
                      : menuItemStyle
                }
                onMouseEnter={(e) => {
                  if (!loading && list._id !== listId) {
                    (e.currentTarget as HTMLElement).style.backgroundColor =
                      "rgba(0, 0, 0, 0.04)";
                  }
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = "";
                }}
                onClick={() =>
                  list._id !== listId &&
                  transferHandle(listIndex, list._id, handleClose)
                }
              >
                {list._id === listId ? `${list.title} (current)` : list.title}
              </p>
              {loading === list._id && <Loader button />}
            </div>
          ))}
      </div>
    </>
  );
};

export default TransferTasks;
