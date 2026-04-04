import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

import { useAppDispatch, useAppSelector } from "./redux/hooks";
import {
  getUpdatedNotifications,
  getUserData,
  logout,
} from "./redux/actions/userActions";
import { userDataUpdate, userRemoved } from "./redux/slices/userSlice";

import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import LinearProgress from "@mui/material/LinearProgress";

import theme from "./util/theme";
import Home from "./components/pages/Home";
import Login from "./components/pages/Login";
import Register from "./components/pages/Register";
import Layout from "./components/layout/Layout";
import ParticlesBackground from "./components/ParticlesBackground";
import Confirm from "./components/pages/Confirm";
import Boards from "./components/pages/Boards";
import Project from "./components/pages/Project";
import ProjectJoinPage from "./components/pages/ProjectJoinPage";
import NotFoundPage from "./components/pages/NotFoundPage";

import type { User } from "./types/models";

const PrivateRoute = ({ userInfo }: { userInfo: User | null | undefined }) => {
  return userInfo ? <Outlet /> : <Navigate to="/signin" />;
};

const App = () => {
  const { loading, userInfo } = useAppSelector((state) => state.userLogin);
  const { socket } = useAppSelector((state) => state.socketConnection);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (userInfo && Object.keys(userInfo).length === 1) {
      dispatch(getUserData(userInfo.token));
    }
  }, [dispatch, userInfo]);

  useEffect(() => {
    if (socket) {
      socket.on("notifications-updated", () =>
        dispatch(getUpdatedNotifications()),
      );
      socket.on("user-updated", (data: User) => dispatch(userDataUpdate(data)));
      socket.on("auth-error", () => dispatch(logout()));
      socket.on(
        "user-removed-from-project",
        (data: { creator: boolean; projectId: string }) =>
          dispatch(userRemoved(data)),
      );
    }
  }, [dispatch, socket]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout>
          {loading && userInfo && userInfo.token ? (
            <LinearProgress
              style={{
                position: "absolute",
                left: 0,
                width: "100%",
              }}
            />
          ) : (
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <ParticlesBackground />
                    <Home />
                  </>
                }
              />
              <Route
                path="/signin"
                element={
                  <>
                    <ParticlesBackground />
                    <Login />
                  </>
                }
              />
              <Route
                path="/register"
                element={
                  <>
                    <ParticlesBackground />
                    <Register />
                  </>
                }
              />
              <Route
                path="/confirm/:id"
                element={
                  <>
                    <ParticlesBackground />
                    <Confirm />
                  </>
                }
              />
              <Route element={<PrivateRoute userInfo={userInfo} />}>
                <Route
                  path="/boards"
                  element={
                    <>
                      <ParticlesBackground />
                      <Boards />
                    </>
                  }
                />
                <Route path="/project/:id/:taskId?" element={<Project />} />
                <Route
                  path="/invite/:projectId/:joinId"
                  element={<ProjectJoinPage />}
                />
              </Route>
              <Route
                path="*"
                element={
                  <>
                    <ParticlesBackground />
                    <NotFoundPage />
                  </>
                }
              />
            </Routes>
          )}
        </Layout>
      </Router>
    </ThemeProvider>
  );
};

export default App;
