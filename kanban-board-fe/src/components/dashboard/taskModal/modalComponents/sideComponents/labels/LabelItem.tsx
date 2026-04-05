import Typography from "@mui/material/Typography";
import DoneIcon from "@mui/icons-material/Done";
import CreateIcon from "@mui/icons-material/Create";
import type { Label } from "../../../../../../types/models";

interface LabelItemProps {
  label: Label;
  taskLabels: string[];
  editHandle: (label: Label) => void;
  selectHandle: (labelId: string, selected: boolean) => void;
}

const LabelItem = ({
  label,
  taskLabels,
  editHandle,
  selectHandle,
}: LabelItemProps) => {
  const labelSelected = taskLabels.includes(label._id);

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <div
        onClick={() => selectHandle(label._id, labelSelected)}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          height: 32,
          borderRadius: 3,
          padding: 9,
          margin: "5px 0",
          userSelect: "none",
          color: label.color === "#FFF" ? "#000" : "#fff",
          backgroundColor: label.color,
          cursor: "pointer",
          border: label.color === "#FFF" ? "1px solid #bec0c0" : undefined,
        }}
      >
        <Typography variant="subtitle2" style={{ fontWeight: 600 }}>
          {label.title}
        </Typography>
        {labelSelected && <DoneIcon fontSize="small" />}
      </div>
      <CreateIcon
        style={{
          marginLeft: 5,
          cursor: "pointer",
          padding: 7,
          borderRadius: 5,
        }}
        onClick={() => editHandle(label)}
        fontSize="large"
      />
    </div>
  );
};

export default LabelItem;
