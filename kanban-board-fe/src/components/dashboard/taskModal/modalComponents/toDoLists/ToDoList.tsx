import type { ToDoList as ToDoListType } from "../../../../../types/models";

interface ToDoListProps {
  projectId: string;
  taskId: string;
  index: number;
  list: ToDoListType;
  userId: string;
  disabled: boolean;
}

const ToDoList = (_props: ToDoListProps) => {
  return null;
};

export default ToDoList;
