import VisibilityIcon from "@mui/icons-material/Visibility";
import { useAppDispatch, useAppSelector } from "../../../../../redux/hooks";
import { updateTaskWatch } from "../../../../../redux/actions/projectActions";
import SideButton from "./SideButton";

interface WatchProps {
  usersWatching: string[];
  taskId: string;
  taskIndex: number | false;
  listIndex: number | false;
}

const Watch = ({ usersWatching, taskId, taskIndex, listIndex }: WatchProps) => {
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.userLogin.userInfo?._id ?? "");

  const isWatching = usersWatching.includes(userId);

  const updateWatchHandle = () => {
    dispatch(
      updateTaskWatch(
        taskId,
        userId,
        isWatching,
        typeof taskIndex === "number" ? taskIndex : 0,
        typeof listIndex === "number" ? listIndex : null,
      ),
    );
  };

  return (
    <SideButton
      icon={<VisibilityIcon />}
      text="Watch"
      clickHandle={updateWatchHandle}
      styleProps={
        isWatching
          ? { background: "#b5e7ee", border: "1px solid #00bcd4" }
          : undefined
      }
    />
  );
};

export default Watch;
