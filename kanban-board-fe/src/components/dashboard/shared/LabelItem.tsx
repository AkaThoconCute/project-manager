import { Box, Typography } from "@mui/material";
import type { Label } from "../../../types/models";

interface LabelItemProps {
  label: Label | null;
  small?: boolean;
}

const LabelItem: React.FC<LabelItemProps> = ({ label, small }) => {
  return (
    <>
      {label && (
        <Box
          sx={{
            display: "flex",
            justifyContent: small ? "flex-start" : "center",
            alignItems: "center",
            borderRadius: small ? "5px" : "20px",
            minWidth: small ? 50 : 32,
            minHeight: small ? 8 : 25,
            fontWeight: 600,
            padding: "2px 10px",
            margin: "2px",
            backgroundColor: label.color,
            color: label.color === "#FFF" ? "#000" : "#fff",
            "&:first-of-type": {
              marginLeft: 0,
            },
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 600,
              overflowX: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "break-spaces",
              fontSize: small ? "0.7rem" : undefined,
              lineHeight: small ? 1.2 : undefined,
            }}
          >
            {label.title}
          </Typography>
        </Box>
      )}
    </>
  );
};

export default LabelItem;
