import { Box } from "@mui/material";
import type { Task } from "../../../types/models";
import ArchivedHeader from "./modalComponents/ArchivedHeader";
import TaskHeader from "./modalComponents/TaskHeader";
import TaskDescription from "./modalComponents/TaskDescription";
import SideContent from "./modalComponents/SideContent";
import Deadline from "./modalComponents/Deadline";
import Users from "./modalComponents/users/Users";
import Labels from "./modalComponents/Labels";
import ToDoList from "./modalComponents/toDoLists/ToDoList";
import Comments from "./modalComponents/comments/Comments";

interface ModalContainerProps {
  task: Task;
  userPermissions: number;
  userId: string;
}

const ModalContainer = ({
  task,
  userPermissions,
  userId,
}: ModalContainerProps) => {
  return (
    <>
      {task && task.archived && <ArchivedHeader />}
      <div style={{ padding: "25px 10px 20px 20px" }}>
        {task && (
          <>
            <TaskHeader task={task} disabled={task.archived} />
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginTop: "10px",
                flexDirection: { xs: "column", sm: "row" },
              }}
            >
              <div style={{ width: "100%" }}>
                <Labels labels={task.labels} />
                <Users
                  selectedUsers={task.users}
                  projectId={task.projectId}
                  taskId={task._id}
                  disabled={task.archived}
                />
                <TaskDescription
                  userPermissions={userPermissions}
                  task={task}
                  disabled={task.archived}
                />
                <Deadline task={task} disabled={task.archived} />
                {task.toDoLists.lists.map((list, index) => (
                  <ToDoList
                    key={list._id}
                    projectId={task.projectId}
                    taskId={task._id}
                    index={index}
                    list={list}
                    userId={userId}
                    disabled={task.archived}
                  />
                ))}
                <Comments
                  comments={task.comments}
                  projectId={task.projectId}
                  taskId={task._id}
                  disabled={task.archived}
                />
              </div>
              <SideContent task={task} />
            </Box>
          </>
        )}
      </div>
    </>
  );
};

export default ModalContainer;
