import { Link } from "react-router-dom";
import { Box, Button } from "@mui/material";
import Helmet from "../Helmet";

const NotFoundPage: React.FC = () => {
  return (
    <Box
      sx={{
        margin: "25vh auto 0 auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontSize: "3.5em",
        padding: "10px",
        "& h6": {
          margin: 0,
          color: "#a4a4a4",
          fontWeight: 100,
          fontSize: "1.2rem",
          textAlign: "center",
        },
        "& h2": {
          margin: 0,
          color: "#fff",
          fontSize: { xs: "1.2em" },
        },
      }}
    >
      <Helmet title="Page not found" />
      <h2>404...</h2>
      <h6 style={{ maxWidth: 500 }}>
        Such page does not exist. Head back to your projects!
      </h6>
      <Link
        to="/boards"
        style={{ textDecoration: "none", marginTop: "10px", fontSize: 0 }}
      >
        <Button color="primary" variant="outlined" size="large">
          Boards
        </Button>
      </Link>
    </Box>
  );
};

export default NotFoundPage;
