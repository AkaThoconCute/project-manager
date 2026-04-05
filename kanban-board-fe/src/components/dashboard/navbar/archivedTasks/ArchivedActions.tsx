import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

interface ArchivedActionsProps {
  taskId: string;
  taskIndex: number;
  openTransferMenu: (
    target: HTMLElement,
    taskIndex: number,
    taskId: string,
  ) => void;
  openDeleteMenu: (
    target: HTMLElement,
    taskIndex: number,
    taskId: string,
  ) => void;
}

const textSx = {
  textDecoration: "underline",
  cursor: "pointer",
  color: "#6b6b6b",
  margin: 0,
  "&:hover": { color: "#2f2f2f" },
  "&:first-of-type": { marginRight: "7px" },
};

const ArchivedActions = ({
  taskId,
  taskIndex,
  openTransferMenu,
  openDeleteMenu,
}: ArchivedActionsProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-end",
        margin: "3px 4px 7px 0",
      }}
    >
      <Typography
        component="p"
        sx={textSx}
        onClick={(e) =>
          openTransferMenu(e.currentTarget as HTMLElement, taskIndex, taskId)
        }
      >
        Transfer to list
      </Typography>
      <Typography
        component="p"
        sx={textSx}
        onClick={(e) =>
          openDeleteMenu(e.currentTarget as HTMLElement, taskIndex, taskId)
        }
      >
        Delete
      </Typography>
    </Box>
  );
};

export default ArchivedActions;
