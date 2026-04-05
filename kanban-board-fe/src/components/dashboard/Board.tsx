import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  projectDataAddTask,
  projectDataUpdateLists,
  projectDataAddList,
  projectDataListTitleUpdate,
  projectDataJoinLinkUpdate,
  projectDataUsersUpdate,
  projectDataTaskArchived,
  projectDataUpdateLabels,
  projectSetTaskSuccess,
  projectSetNewMessage,
  projectUpdateMessages,
} from "../../redux/slices/projectSlice";
import { projectDataTitleUpdate } from "../../redux/slices/userSlice";
import Lists from "./lists/Lists";
import type { Task } from "../../types/models";
import Navbar from "./navbar/Navbar";

const Board = () => {
  const { socket } = useAppSelector((state) => state.socketConnection);
  const { task } = useAppSelector((state) => state.projectSetTask);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!socket) return;

    socket.on("new-task", (data) => {
      dispatch(projectDataAddTask(data));
    });
    socket.on("lists-update", (data) => {
      dispatch(projectDataUpdateLists(data.newLists));
      if (data.restoredTaskId && task && task._id === data.restoredTaskId) {
        dispatch(projectSetTaskSuccess({ ...task, archived: false }));
      }
    });
    socket.on("list-added", (data) => {
      dispatch(projectDataAddList(data));
    });
    socket.on("list-title-updated", (data) => {
      dispatch(projectDataListTitleUpdate(data));
    });
    socket.on("project-title-updated", (data) => {
      dispatch(projectDataTitleUpdate(data));
    });
    socket.on("project-join-link-updated", (data) => {
      dispatch(projectDataJoinLinkUpdate(data));
    });
    socket.on("project-users-updated", (data) => {
      dispatch(projectDataUsersUpdate(data));
    });
    socket.on("task-archived", (data) => {
      dispatch(projectDataTaskArchived(data));
      if (task && task._id === data.taskId) {
        dispatch(projectSetTaskSuccess({ ...task, archived: true }));
      }
    });
    socket.on("task-updated", (data) => {
      if (data.newLists) {
        dispatch(projectDataUpdateLists(data.newLists));
      }
      if (task && task._id === data.task._id) {
        dispatch(projectSetTaskSuccess(data.task));
      }
    });
    socket.on("tasks-updated", ({ tasks }: { tasks: Task[] }) => {
      if (task) {
        tasks.forEach((t) => {
          if (t._id === task._id) {
            dispatch(projectSetTaskSuccess(t));
          }
        });
      }
    });
    socket.on("labels-updated", (data) => {
      dispatch(projectDataUpdateLabels(data.newLabels));
    });
    socket.on("task-deleted", ({ taskId }: { taskId: string }) => {
      if (task && task._id === taskId) {
        dispatch(projectSetTaskSuccess({ ...task, deleted: true }));
      }
    });
    socket.on("new-message", (data) => {
      dispatch(projectSetNewMessage());
      dispatch(projectUpdateMessages(data));
    });

    return () => {
      socket.off("new-task");
      socket.off("lists-update");
      socket.off("list-added");
      socket.off("list-title-updated");
      socket.off("project-title-updated");
      socket.off("project-join-link-updated");
      socket.off("project-users-updated");
      socket.off("task-archived");
      socket.off("task-updated");
      socket.off("tasks-updated");
      socket.off("labels-updated");
      socket.off("task-deleted");
      socket.off("new-message");
    };
  }, [dispatch, socket, task]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        position: "relative",
        height: "100vh",
      }}
    >
      <Navbar />
      <div
        style={{
          height: "100%",
          overflowX: "auto",
          display: "grid",
        }}
      >
        <Lists />
      </div>
    </div>
  );
};

export default Board;
