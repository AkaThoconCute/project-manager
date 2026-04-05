import Button from "@mui/material/Button";
import type { ReactNode, CSSProperties } from "react";

interface SideButtonProps {
  icon?: ReactNode;
  text: string;
  secondary?: boolean;
  clickHandle?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  styleProps?: CSSProperties;
  disabled?: boolean;
}

const SideButton = ({
  icon,
  text,
  secondary,
  clickHandle,
  styleProps,
  disabled,
}: SideButtonProps) => {
  return (
    <Button
      startIcon={icon}
      onClick={clickHandle}
      disabled={disabled}
      style={{ ...styleProps }}
      sx={{
        border: "1px solid transparent",
        height: 32,
        width: { xs: "calc(50% - 8px)", sm: "100%" },
        textTransform: "none",
        display: "flex",
        justifyContent: "flex-start",
        background: secondary ? "#ff3d00" : "#e7e7e7",
        marginBottom: "10px",
        mr: { xs: "8px", sm: 0 },
        "& svg": { marginLeft: "6px" },
        "&:hover": { background: secondary ? "#b22a00" : "#d3d3d3" },
        color: secondary ? "#fff" : undefined,
      }}
    >
      {text}
    </Button>
  );
};

export default SideButton;
