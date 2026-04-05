import PaletteIcon from "@mui/icons-material/Palette";
import Header from "./Header";
import BackgroundSelect from "./background/BackgroundSelect";

interface BackgroundProps {
  backgroundTheme?: string;
  projectId: string;
  open: boolean;
}

const Background = (props: BackgroundProps) => {
  return (
    <div style={{ marginBottom: 20 }}>
      <Header icon={PaletteIcon} title="Background Theme" />
      <BackgroundSelect {...props} />
    </div>
  );
};

export default Background;
