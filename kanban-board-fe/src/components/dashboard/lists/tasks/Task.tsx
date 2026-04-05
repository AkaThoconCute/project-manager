import React, { memo } from "react";
import { Link } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { Draggable } from "@hello-pangea/dnd";
import type {
  DraggableProvided,
  DraggableStateSnapshot,
} from "@hello-pangea/dnd";
import DeleteIcon from "@mui/icons-material/Delete";
import SubjectIcon from "@mui/icons-material/Subject";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { projectTaskArchive } from "../../../../redux/actions/projectActions";
import { projectSetTaskSuccess } from "../../../../redux/slices/projectSlice";
import type { Task as TaskType } from "../../../../types/models";
import LabelItem from "../../shared/LabelItem";
import TaskDeadlineIcon from "./TaskDeadlineIcon";
import TaskTasksCompleted from "./TaskTasksCompleted";
import TaskUsers from "./TaskUsers";

interface TaskProps {
  task: TaskType;
  index: number;
  listIndex: number;
}

const Task: React.FC<TaskProps> = memo(({ task, index, listIndex }) => {
  const dispatch = useAppDispatch();
  const labels = useAppSelector((state) => state.projectGetData.labels?.labels);

  const archiveHandle = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(projectTaskArchive(task._id, task.projectId, index, listIndex));
  };

  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided: DraggableProvided, _snapshot: DraggableStateSnapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Link
            to={`/project/${task.projectId}/${task._id}`}
            style={{ textDecoration: "none", color: "initial" }}
            onClick={() => dispatch(projectSetTaskSuccess(task))}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                position: "relative",
                cursor: "pointer",
                borderBottom: "1px solid #9e9e9e",
                border: "1px solid #ddd",
                borderRadius: "3px",
                backgroundColor: "#ececec",
                marginBottom: "8px",
                "&:hover": {
                  backgroundColor: "#f5f5f5 !important",
                  "& .task-delete-icon": {
                    display: "initial",
                  },
                },
              }}
            >
              {task.labels.length > 0 && (
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    padding: "5px 5px 0",
                  }}
                >
                  {task.labels.map((labelId) => (
                    <LabelItem
                      key={labelId}
                      label={labels?.[labelId] ?? null}
                      small
                    />
                  ))}
                </Box>
              )}
              <Box
                sx={{
                  padding: "5px 10px 10px 10px",
                  transition: "background-color 0.2s ease",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    wordBreak: "break-word",
                    whiteSpace: "break-spaces",
                  }}
                >
                  <Typography variant="subtitle2">{task.title}</Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                    "& > *": { marginRight: "5px" },
                  }}
                >
                  {task.description && <SubjectIcon fontSize="small" />}
                  {task.deadline && (
                    <TaskDeadlineIcon deadline={task.deadline} />
                  )}
                  {task.toDoLists.totalTasks > 0 && (
                    <TaskTasksCompleted
                      total={task.toDoLists.totalTasks}
                      completed={task.toDoLists.tasksCompleted}
                    />
                  )}
                  {task.users && task.users.length > 0 && (
                    <TaskUsers users={task.users} />
                  )}
                </Box>
                {!task.archived && (
                  <DeleteIcon
                    className="task-delete-icon"
                    onClick={archiveHandle}
                    sx={{
                      display: "none",
                      position: "absolute",
                      top: 0,
                      right: 0,
                      padding: "3px",
                      borderRadius: "3px",
                      color: "#656363",
                      zIndex: 40,
                      "&:hover": {
                        backgroundColor: "#cccccc2b",
                      },
                    }}
                  />
                )}
              </Box>
            </Box>
          </Link>
        </div>
      )}
    </Draggable>
  );
});

export default Task;
