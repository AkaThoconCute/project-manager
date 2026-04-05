import React from "react";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import type {
  DraggableProvided,
  DraggableStateSnapshot,
  DroppableProvided,
} from "@hello-pangea/dnd";
import { Box, Paper } from "@mui/material";
import type { ListItem as ListItemType } from "../../../types/models";
import AddInput from "../shared/AddInput";
import ListMore from "./listMore/ListMore";
import "./draggingStyles.css";
import TitleUpdate from "./TitleUpdate";
import Task from "./tasks/Task";

interface ListItemProps {
  list: ListItemType;
  index: number;
  projectId: string;
}

const listContainerSx = {
  display: "flex",
  flexDirection: "column",
  border: "1px solid #ddd",
  borderRadius: "0.3rem",
  margin: "0 4px",
  width: "270px",
};

const headerSx = {
  display: "flex",
  justifyContent: "space-between",
  position: "relative",
  padding: "4px 8px",
  borderBottom: "1px solid #d0d3dc",
  backgroundColor: "#ebecf0",
  transition: "background-color 0.2s ease",
  cursor: "pointer",
  "&:hover": {
    backgroundColor: "rgb(249, 249, 249)",
  },
} as const;

const listStyle: React.CSSProperties = {
  maxHeight: "65vh",
  overflow: "auto",
  transition: "background-color 0.2s ease",
  userSelect: "none",
  padding: "4px 3px 0px 3px",
  margin: "0 2px",
};

const ListItem = ({ list, index, projectId }: ListItemProps) => {
  return (
    <Draggable draggableId={list._id} index={index}>
      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
        <Paper
          ref={provided.innerRef}
          {...provided.draggableProps}
          elevation={3}
          className={snapshot.isDragging ? "list-drag-ghost" : ""}
          sx={listContainerSx}
        >
          <Box
            component="div"
            {...provided.dragHandleProps}
            className="list-drag-handle"
            sx={headerSx}
          >
            <TitleUpdate
              currentTitle={list.title}
              listIndex={index}
              projectId={projectId}
            />
            <ListMore listId={list._id} listIndex={index} />
          </Box>

          <Droppable
            droppableId={String(index)}
            direction="vertical"
            type="TASK"
          >
            {(dropProvided: DroppableProvided) => (
              <div
                ref={dropProvided.innerRef}
                {...dropProvided.droppableProps}
                id={list._id}
                style={listStyle}
              >
                {list.tasks.map((task, i) => (
                  <Task
                    key={task._id}
                    index={i}
                    listIndex={index}
                    task={task}
                  />
                ))}
                {dropProvided.placeholder}
              </div>
            )}
          </Droppable>

          <AddInput listId={list._id} placeholder="Add new task" />
        </Paper>
      )}
    </Draggable>
  );
};

export default React.memo(ListItem, (prev, next) => {
  return JSON.stringify(prev) === JSON.stringify(next);
});
