import { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import FormatColorTextIcon from "@mui/icons-material/FormatColorText";

import { useAppDispatch } from "../../../../../redux/hooks";
import { updateColorTheme } from "../../../../../redux/actions/userActions";
import { THEME_COLORS } from "../../../../../util/colorsConstants";
import Header from "./Header";

interface ColorSelectProps {
  colorTheme?: string;
  projectId: string;
}

const ColorSelect = ({ colorTheme, projectId }: ColorSelectProps) => {
  const dispatch = useAppDispatch();
  const [primaryColor, setPrimaryColor] = useState("#00bcd4");

  useEffect(() => {
    if (colorTheme) setPrimaryColor(colorTheme);
  }, [colorTheme]);

  const clickHandle = (color: string) => {
    setPrimaryColor(color);
    dispatch(updateColorTheme(color, projectId));
  };

  return (
    <>
      <Header icon={FormatColorTextIcon} title="Color Theme" />
      <div style={{ margin: "0 40px", borderRadius: 5, overflow: "hidden" }}>
        <div
          style={{
            padding: 10,
            backgroundColor: "#cacaca",
            color: "#6f6f6f",
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{ textAlign: "center", fontWeight: 600 }}
          >
            Select a Color
          </Typography>
        </div>
        <div
          style={{
            height: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-evenly",
            flexWrap: "wrap",
            backgroundColor: "#fff",
            padding: 5,
          }}
        >
          {THEME_COLORS.map((color, index) => (
            <div
              key={index}
              onClick={() => clickHandle(color)}
              style={{
                margin: 5,
                borderRadius: 3,
                height: 30,
                width: 30,
                cursor: "pointer",
                transition: ".1s ease",
                backgroundColor: color,
                transform: primaryColor === color ? "scale(1.2)" : undefined,
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default ColorSelect;
