import { Typography } from "@mui/material";

interface TasksProgressProps {
  totalTasks: number;
  finishedTasks: number;
  tasksHidden: boolean;
}

const TasksProgress = ({
  totalTasks,
  finishedTasks,
  tasksHidden,
}: TasksProgressProps) => {
  const donePercentage =
    totalTasks === 0 ? 0 : Math.floor((finishedTasks * 100) / totalTasks);
  return (
    <>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 5 }}>
        <div
          style={{
            minWidth: 25,
            maxWidth: 25,
            height: "auto",
            display: "flex",
            justifyContent: "center",
            marginRight: 15,
          }}
        >
          <span
            style={{ fontSize: 11, color: "#696969", fontWeight: 600 }}
          >{`${donePercentage}%`}</span>
        </div>
        <div
          style={{
            display: "flex",
            width: "100%",
            height: 8,
            borderRadius: 50,
            backgroundColor: "#e6e6e6",
          }}
        >
          <div
            style={{
              width: `${donePercentage}%`,
              backgroundColor: donePercentage === 100 ? "#33cd31" : "#00bcd4",
              borderRadius: 50,
              transition: ".2s ease",
            }}
          />
        </div>
      </div>
      {donePercentage === 100 && tasksHidden && (
        <Typography
          variant="caption"
          style={{ marginLeft: 42, color: "#888888" }}
        >
          Every task in this list has been completed!
        </Typography>
      )}
    </>
  );
};

export default TasksProgress;
