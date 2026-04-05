import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { Typography } from "@mui/material";
import LabelImportantIcon from "@mui/icons-material/LabelImportant";
import TitleUpdate from "../../lists/TitleUpdate";
import type { Task } from "../../../../types/models";

dayjs.extend(advancedFormat);

interface TaskHeaderProps {
  task: Task;
  disabled?: boolean;
}

const TaskHeader = ({ task, disabled }: TaskHeaderProps) => {
  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <div
        style={{
          display: "flex",
          width: "80%",
          wordBreak: "break-word",
          alignItems: "flex-start",
        }}
        // marginRight responsive handled below via sx on a Box if needed; using plain style here
      >
        <LabelImportantIcon
          color="primary"
          sx={{ mr: "15px", mt: "4px", flexShrink: 0 }}
        />
        <TitleUpdate
          currentTitle={task.title}
          projectId={task.projectId}
          taskId={task._id}
          disabled={disabled}
        />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "baseline",
          width: "20%",
          wordBreak: "break-word",
          paddingLeft: "8px",
        }}
      >
        <Typography variant="caption" sx={{ color: "#979a9a" }}>
          {dayjs(task.createdAt).format("MMM Do YYYY")}
        </Typography>
        <Typography variant="caption" sx={{ color: "#979a9a" }}>
          <Typography variant="caption" color="primary">
            {task.author}
          </Typography>
        </Typography>
      </div>
    </div>
  );
};

export default TaskHeader;
