import { useState } from "react";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useAppDispatch, useAppSelector } from "../../../../../redux/hooks";
import {
  addToDoTask,
  deleteToDoList,
  deleteToDoTask,
  updateToDoListTitle,
  updateToDoListVisibility,
  updateToDoTaskProgress,
  updateToDoTaskTitle,
} from "../../../../../redux/actions/projectActions";
import type { ToDoList as ToDoListType } from "../../../../../types/models";
import TasksProgress from "./TasksProgress";
import ToDoItem from "./ToDoItem";
import ToDoTitleUpdate from "./ToDoTitleUpdate";
import ToDoMenu from "./ToDoMenu";
import ToDoInput from "./ToDoInput";

interface ToDoListProps {
  projectId: string;
  taskId: string;
  index: number;
  list: ToDoListType;
  userId: string;
  disabled: boolean;
}

const ToDoList = ({
  index,
  projectId,
  taskId,
  list,
  disabled,
}: ToDoListProps) => {
  const { listIds } = useAppSelector((state) => state.projectToDoVisibility);
  const dispatch = useAppDispatch();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const tasksHidden = listIds.includes(list._id);

  const updateTitleHandle = (title: string, callback: () => void) => {
    dispatch(
      updateToDoListTitle(taskId, projectId, list._id, index, title, callback),
    );
  };

  const updateTaskCheckHandle = (
    check: boolean,
    toDoTaskId: string,
    toDoTaskIndex: number,
  ) => {
    dispatch(
      updateToDoTaskProgress(
        taskId,
        list._id,
        index,
        toDoTaskId,
        toDoTaskIndex,
        projectId,
        check,
      ),
    );
  };

  const tasksVisibilityHandle = (visibility: boolean) => {
    dispatch(updateToDoListVisibility(list._id, visibility));
  };

  const deleteListHandle = () => {
    dispatch(
      deleteToDoList(taskId, projectId, list._id, index, () =>
        setAnchorEl(null),
      ),
    );
  };

  const deleteTaskHandle = (
    toDoTaskId: string,
    taskIndex: number,
    completed: boolean,
  ) => {
    dispatch(
      deleteToDoTask(
        taskId,
        list._id,
        index,
        toDoTaskId,
        taskIndex,
        projectId,
        completed,
      ),
    );
  };

  const addTaskHandle = (title: string, callback: () => void) => {
    dispatch(addToDoTask(taskId, list._id, index, projectId, title, callback));
  };

  const updateTaskTitleHandle = (
    toDoTaskId: string,
    title: string,
    toDoTaskIndex: number,
    callback: () => void,
  ) => {
    dispatch(
      updateToDoTaskTitle(
        taskId,
        list._id,
        index,
        toDoTaskId,
        toDoTaskIndex,
        projectId,
        title,
        callback,
      ),
    );
  };

  return (
    <>
      <div style={{ marginTop: 15 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: 5,
          }}
        >
          <div style={{ display: "flex", width: "100%" }}>
            <CheckCircleOutlineIcon
              color="primary"
              style={{ margin: "3px 12px 0 0" }}
            />
            <ToDoTitleUpdate
              currentTitle={list.title}
              updateHandle={updateTitleHandle}
              disabled={disabled}
            />
          </div>
          <MoreVertIcon
            style={{ cursor: "pointer", marginBottom: 5 }}
            onClick={(e) => setAnchorEl(e.currentTarget as unknown as HTMLElement)}
          />
        </div>
        <TasksProgress
          totalTasks={list.tasks.length}
          finishedTasks={list.tasksFinished}
          tasksHidden={tasksHidden}
        />
        {list.tasks.map((task, taskIndex) =>
          task.finished && tasksHidden ? null : (
            <ToDoItem
              key={task._id}
              taskIndex={taskIndex}
              task={task}
              updateTaskCheckHandle={updateTaskCheckHandle}
              deleteTaskHandle={deleteTaskHandle}
              updateTaskTitleHandle={updateTaskTitleHandle}
              disabled={disabled}
            />
          ),
        )}
        <ToDoInput addTaskHandle={addTaskHandle} disabled={disabled} />
      </div>
      <ToDoMenu
        tasksVisibilityHandle={tasksVisibilityHandle}
        tasksFinished={list.tasksFinished}
        tasksHidden={tasksHidden}
        anchorEl={anchorEl}
        closeHandle={() => setAnchorEl(null)}
        deleteListHandle={deleteListHandle}
        disabled={disabled}
      />
    </>
  );
};

export default ToDoList;
