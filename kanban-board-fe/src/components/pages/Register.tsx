import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { register } from "../../redux/actions/userActions";
import { styled } from "@mui/material/styles";
import {
  Grid,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Box,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import AuthFormPanel from "../AuthFormPanel";
import Loader from "../Loader";
import Helmet from "../Helmet";

const GridContainer = styled(Grid)({
  backgroundColor: "#fff",
  boxShadow: "0px 0px 15px -4px",
  borderRadius: 23,
  display: "flex",
  justifyContent: "flex-start",
  height: 400,
  "@media (max-width: 768px)": {
    flexDirection: "column",
    height: "auto",
  },
});

const MainContainer = styled(Box)({
  padding: "25px 50px",
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
  "& label": {
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
  fontSize: "0.775rem",
  color: "#f44336",
  marginBottom: 10,
});

const InfoMessage = styled(Typography)({
  color: "rgb(13, 60, 97)",
  background: "#49aaff3d",
  padding: 7,
  borderRadius: 3,
  marginBottom: 10,
  fontSize: "0.775rem",
});

const SmallText = styled("p")({
  textAlign: "center",
  fontSize: ".75rem",
  margin: "5px 0 0 0",
});

const Register = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { loading, error, success } = useAppSelector(
    (state) => state.userRegister,
  );
  const { userInfo: userLoggedIn } = useAppSelector((state) => state.userLogin);

  useEffect(() => {
    if (userLoggedIn) navigate("/boards");
  }, [dispatch, navigate, userLoggedIn]);

  const validate = () => {
    let returnVal = true;
    const regex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!regex.test(email.toLowerCase())) {
      returnVal = false;
      setEmailError("Please use full email address (i.e., john@example.com)");
    } else {
      returnVal = returnVal ? returnVal : false;
      setEmailError("");
    }
    if (username.trim() !== "") {
      returnVal = returnVal ? returnVal : false;
      setUsernameError("");
    } else {
      returnVal = false;
      setPasswordError("Cannot be empty");
    }
    if (password.length >= 7) {
      returnVal = returnVal ? returnVal : false;
      setPasswordError("");
    } else {
      returnVal = false;
      setPasswordError("Must be at least 7 characters long");
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
  const usernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsernameError("");
    setUsername(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isValidated = validate();
    if (isValidated) {
      dispatch(register(username, email, password));
    }
  };

  return (
    <div>
      <Helmet title={"Register"} />
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        style={{ height: "80vh" }}
      >
        <GridContainer size={{ lg: 5, md: 7, sm: 9, xs: 9 }}>
          <MainContainer>
            <Typography variant="h1">Register</Typography>
            <FormContainer onSubmit={handleSubmit}>
              <InputField
                name="username"
                type="text"
                label="Username"
                variant="outlined"
                fullWidth
                error={Boolean(usernameError)}
                helperText={usernameError}
                value={username}
                onChange={usernameChange}
              />
              <InputField
                name="email"
                type="email"
                label="Email"
                variant="outlined"
                fullWidth
                error={Boolean(emailError)}
                helperText={emailError}
                value={email}
                onChange={emailChange}
              />
              <InputField
                name="password"
                type={showPassword ? "text" : "password"}
                label="Password"
                variant="outlined"
                fullWidth
                error={Boolean(passwordError)}
                helperText={passwordError}
                value={password}
                onChange={passwordChange}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          style={{ padding: 8 }}
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword((prevVal) => !prevVal)}
                        >
                          {showPassword ? (
                            <VisibilityIcon />
                          ) : (
                            <VisibilityOffIcon />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
              {error && (
                <CustomError variant="body2" align="center">
                  {error}
                </CustomError>
              )}
              {success && (
                <InfoMessage variant="body2" align="center">
                  {success}
                </InfoMessage>
              )}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
              >
                Signup
                {loading && <Loader button />}
              </Button>
            </FormContainer>
            <SmallText>
              Already have an account? <Link to="/signin">Login</Link>
            </SmallText>
          </MainContainer>
          <AuthFormPanel login />
        </GridContainer>
      </Grid>
    </div>
  );
};

export default Register;
