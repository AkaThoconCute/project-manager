import { useState, type ChangeEvent } from "react";
import {
  Avatar,
  CircularProgress,
  IconButton,
  Modal,
  Typography,
  Alert,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloseIcon from "@mui/icons-material/Close";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { updateProfilePicture } from "../../../redux/actions/userActions";
import type { User } from "../../../types/models";

interface UserModalProps {
  open: boolean;
  closeHandle: () => void;
  user?: User | null;
}

const Container = styled("div")({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  borderRadius: "50%",
  outline: "none",
  margin: "calc(40vh - 225px) auto 0 auto",
});

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 450,
  height: 450,
  boxShadow:
    "0px 11px 15px -7px rgb(0 0 0 / 20%), 0px 24px 38px 3px rgb(0 0 0 / 14%), 0px 9px 46px 8px rgb(0 0 0 / 12%)",
  [theme.breakpoints.down("sm")]: {
    width: "90vw",
    height: "90vw",
  },
}));

const UploadIconWrapper = styled("div")({
  position: "absolute",
  right: 30,
  bottom: -25,
  zIndex: 1111,
  "& svg": {
    width: 90,
    height: 90,
  },
  "& .Mui-disabled": {
    color: "#54aab5",
  },
});

const ImageDisabled = styled("div")({
  backgroundColor: "rgb(255 255 255 / 40%)",
  width: "100%",
  height: "100%",
  position: "absolute",
  top: 0,
  borderRadius: "50%",
  zIndex: 111,
});

const StyledLoader = styled(CircularProgress)({
  width: "70px !important",
  height: "70px !important",
  position: "absolute",
  top: "calc(50% - 35px)",
  left: "calc(50% - 35px)",
});

const CloseButton = styled(IconButton)({
  position: "absolute",
  top: 2,
  right: 2,
  color: "#fff",
});

const Description = styled("div")({
  fontSize: "1rem",
  textAlign: "center",
  marginTop: 10,
});

const UserModal = ({ open, closeHandle, user }: UserModalProps) => {
  const [info, setInfo] = useState("");
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.userPictureUpdate);

  const handleSelectPicture = () => {
    const fileInput = document.getElementById("imageInput");
    fileInput?.click();
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInfo("");
    const imageFile = event.target.files?.[0];
    if (imageFile) {
      let fileType = imageFile.type.split("/");
      const ext = fileType[fileType.length - 1];
      if (/^(jpg|jpeg|png|gif)$/.test(ext)) {
        const blob = imageFile.slice(0, imageFile.size, imageFile.type);
        const newFile = new File([blob], user!._id, {
          type: imageFile.type,
        });
        const formData = new FormData();
        formData.append("img", newFile);
        dispatch(updateProfilePicture(formData));
      } else {
        setInfo("Wrong file type, accepts only jpg|jpeg|png|gif");
      }
    }
  };

  if (!user) return null;

  return (
    <Modal open={open} onClose={closeHandle}>
      <Container>
        <div style={{ position: "relative" }}>
          <StyledAvatar
            src={user.profilePicture ?? undefined}
            alt={user.username}
          />
          <UploadIconWrapper>
            <IconButton
              color="primary"
              disabled={loading}
              onClick={handleSelectPicture}
            >
              <input
                id="imageInput"
                type="file"
                hidden
                onChange={handleImageChange}
              />
              <CloudUploadIcon />
            </IconButton>
          </UploadIconWrapper>
          {loading && (
            <>
              <ImageDisabled />
              <StyledLoader />
            </>
          )}
        </div>
        <Description>
          <Typography variant="subtitle2" sx={{ color: "#fff" }}>
            {user.username}
          </Typography>
          <Typography variant="subtitle2" sx={{ color: "#00e2ff" }}>
            {user.email}
          </Typography>
          {error && (
            <Alert severity="error">
              Something went wrong, try again later!
            </Alert>
          )}
          {info && <Alert severity="info">{info}</Alert>}
        </Description>
        <CloseButton onClick={closeHandle}>
          <CloseIcon />
        </CloseButton>
      </Container>
    </Modal>
  );
};

export default UserModal;
