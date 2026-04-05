import DeveloperBoardIcon from "@mui/icons-material/DeveloperBoard";
import NavTitle from "./NavTitle";

const Navbar = () => {
  return (
    <div>
      <div
        style={{
          borderBottom: "1px solid #d8d8d8",
          background: "#ffffffd9",
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: 51,
          zIndex: 1,
        }}
      />
      <div
        style={{
          display: "flex",
          flexWrap: "nowrap",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 5,
          height: "auto",
          zIndex: 1,
          position: "relative",
        }}
      >
        <DeveloperBoardIcon color="primary" style={{ fontSize: 40 }} />
        <NavTitle />
      </div>
    </div>
  );
};

export default Navbar;
