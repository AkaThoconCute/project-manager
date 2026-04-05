import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Grid, Typography, TextField, Button, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { login } from "../../redux/actions/userActions";
import AuthFormPanel from "../AuthFormPanel";
import Loader from "../Loader";
import Helmet from "../Helmet";

const GridContainer = styled(Grid)({
  backgroundColor: "#fff",
  boxShadow: "0px 0px 15px -4px",
  borderRadius: 23,
  display: "flex",
  justifyContent: "flex-end",
  height: 400,
  "@media (max-width: 768px)": {
    flexDirection: "column-reverse",
    height: "auto",
  },
});

const MainContainer = styled(Box)({
  padding: "50px",
  width: "50%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  "& h1": {
    fontSize: "2.5rem",
    color: "#00bcd4",
    fontFamily: "Segoe UI",
    fontWeight: 400,
  },
  "@media (max-width: 768px)": {
    width: "100%",
    padding: "20px 50px",
  },
  "@media (min-width: 768px) and (max-width: 1500px)": {
    padding: "50px 20px",
  },
});

const FormContainer = styled("form")({
  display: "flex",
  flexDirection: "column",
});

const InputField = styled(TextField)({
  marginBottom: 10,
  "& input": {
    padding: "11px 10px",
  },
  "& label:not(.MuiInputLabel-shrink)": {
    transform: "translate(10px, 13px) scale(1)",
  },
  "&:first-of-type": {
    marginTop: 20,
  },
  "&:nth-of-type(3)": {
    marginBottom: 10,
    display: "flex",
    alignItems: "center",
  },
});

const CustomError = styled(Typography)({
  color: "#f44336",
  marginBottom: 10,
});

const SmallText = styled("p")({
  textAlign: "center",
  fontSize: ".75rem",
  margin: "5px 0 0 0",
});

const SignIn = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const { loading, error, userInfo } = useAppSelector(
    (state) => state.userLogin,
  );

  useEffect(() => {
    if (userInfo) navigate("/boards");
  }, [navigate, userInfo]);

  const validate = () => {
    let returnVal = true;
    const regex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!regex.test(email.toLowerCase())) {
      returnVal = false;
      setEmailError("Please use full email address (i.e., john@example.com)");
    } else {
      returnVal = returnVal ? returnVal : false;
      setEmailError("");
    }
    if (password === "") {
      returnVal = false;
      setPasswordError("Cannot be empty!");
    }
    return returnVal;
  };

  const emailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailError("");
    setEmail(e.target.value);
  };

  const passwordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordError("");
    setPassword(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validation = validate();
    if (validation) dispatch(login(email, password));
  };

  return (
    <div>
      <Helmet title={"Login"} />
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        style={{ height: "80vh" }}
      >
        <Grid size={{ lg: 5, md: 7, sm: 9, xs: 9 }}>
          <GridContainer>
            <AuthFormPanel />
            <MainContainer>
              <Typography variant="h1" style={{ fontFamily: "Segoe UI" }}>
                Sign in
              </Typography>
              <FormContainer onSubmit={handleSubmit}>
                <InputField
                  name="email"
                  type="email"
                  label="Email"
                  variant="outlined"
                  fullWidth
                  error={Boolean(emailError)}
                  helperText={emailError}
                  onChange={emailChange}
                  value={email}
                />
                <InputField
                  name="password"
                  type="password"
                  label="Password"
                  variant="outlined"
                  fullWidth
                  error={Boolean(passwordError)}
                  helperText={passwordError}
                  onChange={passwordChange}
                  value={password}
                />
                {error && <CustomError variant="body2">{error}</CustomError>}
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                >
                  Login
                  {loading && <Loader button />}
                </Button>
              </FormContainer>
              <SmallText>
                Don't have an account? <Link to="/register">Register</Link>
              </SmallText>
            </MainContainer>
          </GridContainer>
        </Grid>
      </Grid>
    </div>
  );
};

export default SignIn;
