import { Link } from "react-router-dom";
import { Typography, Box, styled } from "@mui/material";
import PolygonBackground from "../images/PolygonBackground.jpg";

interface AuthFormPanelProps {
  login?: boolean;
}

const Container = styled(Box, {
  shouldForwardProp: (prop) => prop !== "login",
})<{ login?: boolean }>(({ login }) => ({
  backgroundImage: `url(${PolygonBackground})`,
  backgroundSize: "cover",
  width: "50%",
  padding: 20,
  borderRadius: login ? "0 20px 20px 0" : "20px 0 0 20px",
  "@media (max-width: 768px)": {
    width: "100%",
    borderRadius: "0 0 20px 20px",
  },
}));

const InnerContainer = styled(Box)({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  color: "#fff",
  "& h1": {
    fontSize: "2.5rem",
  },
  "& h6": {
    fontSize: ".9rem",
    color: "#cacaca",
    marginTop: 10,
  },
});

const CustomButton = styled("div")({
  padding: "4px 45px",
  backgroundColor: "transparent",
  border: "2px solid #fff",
  borderRadius: 50,
  color: "#fff",
  fontSize: "1rem",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  transition: ".2s ease",
  "&:hover": {
    backgroundColor: "#fff",
    color: "#000",
  },
});

const StyledLink = styled(Link)({
  textDecoration: "none",
  marginTop: 10,
});

const AuthFormPanel = ({ login }: AuthFormPanelProps) => {
  return (
    <Container login={login}>
      <InnerContainer>
        <Typography
          variant="h1"
          align="center"
          style={{ fontFamily: "Segoe UI" }}
        >
          {login ? "Welcome Back!" : "Hi there!"}
        </Typography>
        <Typography variant="h6" align="center">
          {login
            ? "To check on your projects sing in using your personal details"
            : "Register to keep your productivity and project flow at highest levels possible!"}
        </Typography>
        <StyledLink to={login ? "/signin" : "/register"}>
          <CustomButton>{login ? "SIGN IN" : "SIGN UP"}</CustomButton>
        </StyledLink>
      </InnerContainer>
    </Container>
  );
};

export default AuthFormPanel;
