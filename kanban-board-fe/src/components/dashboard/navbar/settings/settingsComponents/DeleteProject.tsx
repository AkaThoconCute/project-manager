import { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import { useAppDispatch } from "../../../../../redux/hooks";
import { deleteProject } from "../../../../../redux/actions/projectActions";
import Header from "./Header";
import Loader from "../../../../Loader";

interface DeleteProjectProps {
  projectId: string;
}

const DeleteProject = ({ projectId }: DeleteProjectProps) => {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const deleteHandle = () => {
    setLoading(true);
    dispatch(deleteProject(projectId, () => setLoading(false)));
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginTop: 20,
        marginBottom: 20,
      }}
    >
      <Header icon={DeleteIcon} title="Delete Project" />
      <Button
        variant="outlined"
        color="secondary"
        onClick={() => setOpen(true)}
        sx={{ marginRight: "40px" }}
      >
        Delete
      </Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        slotProps={{
          backdrop: { style: { backgroundColor: "rgba(0, 0, 0, 0.3)" } },
        }}
      >
        <DialogTitle>Delete Project</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this project? This action cannot be
            undone
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            onClick={deleteHandle}
            variant="contained"
            color="secondary"
            disabled={loading}
          >
            Delete
            {loading && <Loader button />}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DeleteProject;
