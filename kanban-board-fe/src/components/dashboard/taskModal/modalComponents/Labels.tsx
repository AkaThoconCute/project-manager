import { Typography } from "@mui/material";
import { useAppSelector } from "../../../../redux/hooks";
import LabelItem from "../../shared/LabelItem";

interface LabelsProps {
  labels: string[];
}

const Labels = ({ labels: taskLabels }: LabelsProps) => {
  const labelsDoc = useAppSelector((state) => state.projectGetData.labels);
  const labels = labelsDoc?.labels ?? {};

  return (
    <>
      {taskLabels && taskLabels.length > 0 && (
        <div>
          <Typography
            variant="body1"
            sx={{
              margin: "5px 0",
              color: "#909090",
              fontSize: ".9rem",
              lineHeight: 1,
              fontWeight: 600,
            }}
          >
            Labels
          </Typography>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              marginBottom: 8,
            }}
          >
            {taskLabels.map((labelId) => (
              <LabelItem key={labelId} label={labels[labelId] ?? null} />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Labels;
