import { Typography } from "@mui/material";

interface HeaderProps {
  icon: React.ElementType;
  title: string;
}

const Header = ({ icon: Icon, title }: HeaderProps) => {
  return (
    <div
      style={{
        padding: 5,
        display: "flex",
        alignItems: "center",
      }}
    >
      <Icon
        color="primary"
        sx={{ marginRight: "10px", height: "27px", width: "27px" }}
      />
      <Typography variant="h6" sx={{ fontSize: "1.10rem" }}>
        {title}
      </Typography>
    </div>
  );
};

export default Header;
