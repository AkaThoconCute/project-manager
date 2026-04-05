import { memo, useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useAppSelector } from "../../../../redux/hooks";
import { getTaskIndexes } from "../../../../util/utilFunctions";
import Archive from "./sideComponents/Archive";
import Copy from "./sideComponents/Copy";
import Deadline from "./sideComponents/Deadline";
import Label from "./sideComponents/labels/Label";
import ToDoList from "./sideComponents/toDoList/ToDoList";
import Transfer from "./sideComponents/Transfer";
import Users from "./sideComponents/users/Users";
import Watch from "./sideComponents/Watch";
import type { Task } from "../../../../types/models";

interface SideContentProps {
  task: Task;
}

const SideContent = memo(({ task }: SideContentProps) => {
  const { lists } = useAppSelector((state) => state.projectGetData);
  const [currentListId, setCurrentListId] = useState<string | false>(false);
  const [listIndex, setListIndex] = useState<number | false>(false);
  const [taskIndex, setTaskIndex] = useState<number | false>(false);

  const { archived, _id: taskId } = task;

  useEffect(() => {
    if (!archived && lists) {
      getTaskIndexes(
        lists.lists,
        typeof taskIndex === "number" ? taskIndex : 0,
        typeof listIndex === "number" ? listIndex : 0,
        taskId,
        (foundListIndex, foundTaskIndex) => {
          setListIndex(foundListIndex);
          setTaskIndex(foundTaskIndex);
          setCurrentListId(lists.lists[foundListIndex]._id);
        },
      );
    } else if (archived && lists) {
      const archivedIndex = lists.archivedTasks.findIndex(
        (t) => t._id === taskId,
      );
      if (archivedIndex > -1) setTaskIndex(archivedIndex);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lists, archived, taskId]);

  const buttonsContainerSx = {
    display: "flex",
    flexDirection: { xs: "row", sm: "column" } as const,
    flexWrap: { xs: "wrap", sm: "nowrap" } as const,
  };

  return (
    <Box
      sx={{
        width: { xs: "100%", sm: 168 },
        height: { xs: "auto", sm: 500 },
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        pl: { xs: 0, sm: "10px" },
      }}
    >
      <Typography variant="caption" sx={{ fontWeight: 600, color: "#979a9a" }}>
        ADD TO TASK
      </Typography>
      <Box sx={{ ...buttonsContainerSx, mb: { xs: 0, sm: "20px" } }}>
        <Users task={task} disabled={task.archived} />
        <Label
          task={task}
          disabled={task.archived}
          taskIndex={taskIndex}
          listIndex={listIndex}
        />
        <ToDoList task={task} disabled={task.archived} />
        <Deadline task={task} disabled={task.archived} />
      </Box>
      <Typography variant="caption" sx={{ fontWeight: 600, color: "#979a9a" }}>
        ACTIONS
      </Typography>
      <Box sx={buttonsContainerSx}>
        <Copy task={task} />
        <Watch
          usersWatching={task.usersWatching}
          taskId={task._id}
          taskIndex={taskIndex}
          listIndex={listIndex}
        />
        <Transfer
          task={task}
          currentListId={currentListId}
          taskIndex={taskIndex}
          listIndex={listIndex}
        />
        <Archive task={task} taskIndex={taskIndex} listIndex={listIndex} />
      </Box>
    </Box>
  );
});

SideContent.displayName = "SideContent";

export default SideContent;
