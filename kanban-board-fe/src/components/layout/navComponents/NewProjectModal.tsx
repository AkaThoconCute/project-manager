import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { createProject } from "../../../redux/actions/projectActions";
import { projectCreateReset } from "../../../redux/slices/projectSlice";
import {
  Dialog,
  DialogActions,
  DialogTitle,
  TextField,
  Button,
  Alert,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Loader from "../../Loader";
import ProjectSvg from "../../../images/ProjectSvg.svg";

interface NewProjectModalProps {
  open: boolean;
  handleClose: () => void;
}

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiPaper-root": {
    margin: 15,
    paddingTop: 5,
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
}));

const Container = styled("div")(({ theme }) => ({
  backgroundImage: `url(${ProjectSvg})`,
  backgroundPosition: "revert",
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  width: 570,
  minHeight: 249,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  [theme.breakpoints.down("sm")]: {
    width: "100%",
  },
}));

const ActionsContainer = styled("div")(({ theme }) => ({
  padding: "7px 25px 0 25px",
  marginTop: 100,
  background: "#fff",
  [theme.breakpoints.down("sm")]: {
    padding: "7px 17px 0 17px",
    marginTop: 114,
  },
}));

const NewProjectModal = ({ open, handleClose }: NewProjectModalProps) => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.projectCreate);
  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) inputRef?.current?.focus();
    else {
      setTitle("");
      setTitleError("");
    }
  }, [open]);

  const keyDownHandle = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") createProjectHandle();
  };

  const createProjectHandle = () => {
    if (title === "") setTitleError("Cannot be empty");
    else {
      dispatch(
        createProject(title, (projectId: string) => {
          navigate(`/project/${projectId}`);
          dispatch(projectCreateReset());
          setTitle("");
          handleClose();
        }),
      );
    }
  };

  const changeHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    setTitleError("");
  };

  return (
    <StyledDialog
      open={open}
      keepMounted
      onClose={!loading ? handleClose : undefined}
    >
      <Container>
        <DialogTitle>Create New Project</DialogTitle>
        {error && <Alert severity="error">{error}</Alert>}
        <ActionsContainer>
          <TextField
            inputRef={inputRef}
            name="title"
            type="text"
            label="Title"
            variant="outlined"
            value={title}
            disabled={loading}
            onChange={changeHandle}
            onKeyDown={keyDownHandle}
            style={{ marginBottom: 10 }}
            fullWidth
            error={Boolean(titleError)}
            helperText={titleError}
          />
          <DialogActions>
            <Button
              onClick={!loading ? handleClose : undefined}
              color="secondary"
            >
              Cancel
            </Button>
            <Button
              onClick={createProjectHandle}
              color="primary"
              disabled={loading}
            >
              Create
              {loading && <Loader button />}
            </Button>
          </DialogActions>
        </ActionsContainer>
      </Container>
    </StyledDialog>
  );
};

export default NewProjectModal;
