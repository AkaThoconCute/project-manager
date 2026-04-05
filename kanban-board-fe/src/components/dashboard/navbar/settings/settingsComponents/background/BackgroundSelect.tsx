import { useState, useEffect, useRef } from "react";
import { Typography, Button, Alert } from "@mui/material";

import { useAppDispatch, useAppSelector } from "../../../../../../redux/hooks";
import {
  updateProjectBgColor,
  uploadProjectBgImage,
} from "../../../../../../redux/actions/userActions";
import { BACKGROUND_COLORS } from "../../../../../../util/colorsConstants";
import Loader from "../../../../../Loader";
import ImageUpload from "./ImageUpload";

interface BackgroundSelectProps {
  backgroundTheme?: string;
  open: boolean;
  projectId: string;
}

const BackgroundSelect = ({
  backgroundTheme,
  open,
  projectId,
}: BackgroundSelectProps) => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector(
    (state) => state.userProjectBgUpdate,
  );

  const [formData, setFormData] = useState<FormData | null>(null);
  const [background, setBackground] = useState<string | null>(null);
  const [previewHeight, setPreviewHeight] = useState(0);

  const imageSelectRef = useRef<HTMLInputElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);

  const calculatePreviewHeight = () => {
    if (backgroundRef.current) {
      const ratio = window.innerWidth / backgroundRef.current.scrollWidth;
      setPreviewHeight(window.innerHeight / ratio);
    }
  };

  useEffect(() => {
    calculatePreviewHeight();
    window.addEventListener("resize", calculatePreviewHeight);
    return () => window.removeEventListener("resize", calculatePreviewHeight);
  }, []);

  useEffect(() => {
    if (backgroundTheme && open) setBackground(backgroundTheme);
    if (!open) {
      setTimeout(() => {
        setFormData(null);
        setBackground(backgroundTheme ?? null);
      }, 200);
    }
  }, [backgroundTheme, open]);

  const selectBackgroundColor = (color: string) => {
    setBackground(color);
    setFormData(null);
    if (imageSelectRef.current) imageSelectRef.current.value = "";
  };

  const saveHandle = () => {
    if (background && !formData) {
      dispatch(updateProjectBgColor(background, projectId));
    } else if (formData) {
      dispatch(uploadProjectBgImage(formData, projectId));
    }
  };

  const bgStyle = background
    ? background.startsWith("linear")
      ? { background }
      : { backgroundImage: `url(${background})` }
    : { background: "#fff" };

  return (
    <div style={{ margin: "0 40px", borderRadius: 5, overflow: "hidden" }}>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 10,
          backgroundColor: "#cacaca",
          color: "#6f6f6f",
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          Select a Background
        </Typography>
      </div>
      <div
        style={{
          height: "auto",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
          backgroundColor: "#fff",
          padding: 5,
        }}
      >
        {BACKGROUND_COLORS.map((color, index) => (
          <div
            key={index}
            onClick={() => selectBackgroundColor(color)}
            style={{
              display: "flex",
              margin: background === color ? "5px 7px" : 5,
              borderRadius: 3,
              height: 30,
              width: "100%",
              cursor: "pointer",
              transition: ".1s ease",
              background: color,
              transform: background === color ? "scale(1.1)" : undefined,
            }}
          />
        ))}
      </div>
      <div style={{ width: "100%" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: 10,
            backgroundColor: "#cacaca",
            color: "#6f6f6f",
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            Or upload your image
          </Typography>
        </div>
        <div
          ref={backgroundRef}
          style={{
            position: "relative",
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: previewHeight,
            ...bgStyle,
          }}
        >
          <ImageUpload
            setBackground={setBackground}
            disabled={!!loading}
            setFormData={setFormData}
            imageSelectRef={imageSelectRef}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: 10,
          }}
        >
          <Button
            variant="contained"
            onClick={saveHandle}
            color="primary"
            style={{ width: "30%" }}
            disabled={!!loading}
          >
            Save
            {loading && <Loader button />}
          </Button>
        </div>
        {error && (
          <Alert severity="error" style={{ marginTop: 10 }}>
            Something went wrong, try again later
          </Alert>
        )}
      </div>
    </div>
  );
};

export default BackgroundSelect;
