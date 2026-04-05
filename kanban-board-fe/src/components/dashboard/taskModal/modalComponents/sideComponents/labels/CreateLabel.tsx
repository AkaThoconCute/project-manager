import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import DoneIcon from "@mui/icons-material/Done";

interface CreateLabelProps {
  colors: string[];
  selectedColor: string;
  title: string;
  setTitle: (v: string) => void;
  setSelectedColor: (v: string) => void;
  saveHandle: () => void;
  setDeleteOpen: (v: boolean) => void;
  edit: boolean;
}

const CreateLabel = ({
  colors,
  selectedColor,
  title,
  setTitle,
  setSelectedColor,
  saveHandle,
  setDeleteOpen,
  edit,
}: CreateLabelProps) => {
  return (
    <div style={{ marginTop: 10 }}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Typography
          variant="caption"
          style={{ fontWeight: 600, color: "#979a9a" }}
        >
          Title
        </Typography>
        <TextField
          variant="outlined"
          style={{ marginBottom: 7 }}
          inputProps={{ style: { padding: "6px 8px" } }}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <Typography
        variant="caption"
        style={{ fontWeight: 600, color: "#979a9a" }}
      >
        Color
      </Typography>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {colors &&
          colors.map((color, i) => (
            <div
              key={i}
              style={{
                width: 48,
                height: 32,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 5,
                margin: 5,
                cursor: "pointer",
                backgroundColor: color,
                border: color === "#FFF" ? "1px solid #bec0c0" : undefined,
              }}
              onClick={() => setSelectedColor(color)}
            >
              {selectedColor === color && (
                <DoneIcon
                  style={{ fill: color === "#FFF" ? "#000" : "#fff" }}
                />
              )}
            </div>
          ))}
      </div>
      <div>
        {edit && (
          <Button color="secondary" onClick={() => setDeleteOpen(true)}>
            Delete
          </Button>
        )}
        <Button color="primary" onClick={saveHandle}>
          {edit ? "Save" : "Add"}
        </Button>
      </div>
    </div>
  );
};

export default CreateLabel;
