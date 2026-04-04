// Slice actions from userSlice:
import {
  userLoginRequest,
  userLoginSuccess,
  userDataUpdate,
  userNotificationsUpdate,
  userPictureUpdateInLogin,
  userLoginFail,
  userLogout,
  userRegisterRequest,
  userRegisterSuccess,
  userRegisterFail,
  userEmailConfirmRequest,
  userEmailConfirmSuccess,
  userEmailConfirmFail,
  userEmailResendRequest,
  userEmailResendSuccess,
  userEmailResendFail,
  userPictureUpdateRequest,
  userPictureUpdateSuccess,
  userPictureUpdateFail,
  userProjectBgUpdateRequest,
  userProjectBgUpdateSuccess,
  userProjectBgUpdateFail,
} from '../slices/userSlice';

// Socket slice actions:
import { socketConnectSuccess, socketConnectReset } from '../slices/socketSlice';

// API client:
import { apiClient, extractErrorMessage } from '../../services/apiClient';

// Fake API:
import {
  fakeLogin,
  fakeRegister,
  fakeConfirmEmail,
  fakeResendEmail,
  fakeGetUserData,
  fakeGetNotifications,
  fakeDiscardNotification,
  fakeMarkNotificationsSeen,
  fakeUpdateProfilePicture,
  fakeUploadProjectBgImage,
} from '../../services/fake/userFakeApi';

// Socket service:
import { connectSocket } from '../../services/socket';

// Env:
import { isFakeMode } from '../../config/env';

// Types:
import type { AppThunk } from '../../types/store';

// ── 1. login ────────────────────────────────────────────────────────

export const login =
  (email: string, password: string): AppThunk =>
    async (dispatch) => {
      try {
        dispatch(userLoginRequest());
        let data;
        if (isFakeMode()) {
          data = await fakeLogin();
        } else {
          const response = await apiClient.post('/api/users/login', { email, password });
          data = response.data;
        }
        // Connect socket (returns fake stub in fake mode)
        const socket = connectSocket(data.userInfo.token);
        socket.on('connect', () => {
          dispatch(socketConnectSuccess(socket));
          dispatch(userLoginSuccess(data));
          socket.emit('join-notifications', { room: data.userInfo._id });
        });
        // In fake mode, socket.on won't fire, so dispatch directly
        if (isFakeMode()) {
          dispatch(socketConnectSuccess(socket));
          dispatch(userLoginSuccess(data));
        }
        localStorage.setItem('userInfo', JSON.stringify({ token: data.userInfo.token }));
      } catch (error) {
        dispatch(userLoginFail(extractErrorMessage(error)));
      }
    };

// ── 2. register ─────────────────────────────────────────────────────

export const register =
  (username: string, email: string, password: string): AppThunk =>
    async (dispatch) => {
      try {
        dispatch(userRegisterRequest());
        let data;
        if (isFakeMode()) {
          data = await fakeRegister();
        } else {
          const response = await apiClient.post('/api/users/register', {
            username,
            email,
            password,
          });
          data = response.data;
        }
        dispatch(userRegisterSuccess(data.message));
      } catch (error) {
        dispatch(userRegisterFail(extractErrorMessage(error)));
      }
    };

// ── 3. logout ───────────────────────────────────────────────────────

export const logout = (): AppThunk => async (dispatch, getState) => {
  const {
    socketConnection: { socket },
  } = getState();
  localStorage.removeItem('userInfo');
  dispatch(userLogout());
  if (socket) socket.disconnect();
  dispatch(socketConnectReset());
};

// ── 4. confirmEmail ─────────────────────────────────────────────────

export const confirmEmail =
  (emailCode: string): AppThunk =>
    async (dispatch) => {
      try {
        dispatch(userEmailConfirmRequest());
        let data;
        if (isFakeMode()) {
          data = await fakeConfirmEmail();
        } else {
          const response = await apiClient.post('/api/users/confirm', { emailCode });
          data = response.data;
        }
        dispatch(userEmailConfirmSuccess(data.message));
      } catch (error) {
        dispatch(userEmailConfirmFail(extractErrorMessage(error)));
      }
    };

// ── 5. resendEmail ──────────────────────────────────────────────────

export const resendEmail =
  (emailCode: string): AppThunk =>
    async (dispatch) => {
      try {
        dispatch(userEmailResendRequest());
        let data;
        if (isFakeMode()) {
          data = await fakeResendEmail();
        } else {
          const response = await apiClient.post('/api/users/resend', { emailCode });
          data = response.data;
        }
        dispatch(userEmailResendSuccess(data.message));
      } catch (error) {
        dispatch(userEmailResendFail(extractErrorMessage(error)));
      }
    };

// ── 6. getUserData ──────────────────────────────────────────────────

export const getUserData =
  (token: string): AppThunk =>
    async (dispatch) => {
      try {
        dispatch(userLoginRequest());
        let data;
        if (isFakeMode()) {
          data = await fakeGetUserData();
        } else {
          const config = { headers: { Authorization: `Bearer ${token}` } };
          const response = await apiClient.get('/api/users', config);
          data = response.data;
        }
        const socket = connectSocket(data.userInfo.token);
        socket.on('connect', () => {
          dispatch(socketConnectSuccess(socket));
          dispatch(userLoginSuccess(data));
          socket.emit('join-notifications', { room: data.userInfo._id });
        });
        if (isFakeMode()) {
          dispatch(socketConnectSuccess(socket));
          dispatch(userLoginSuccess(data));
        }
      } catch (error) {
        localStorage.removeItem('userInfo');
        dispatch(userLogout());
      }
    };

// ── 7. getUpdatedNotifications ──────────────────────────────────────

export const getUpdatedNotifications = (): AppThunk => async (dispatch, getState) => {
  const {
    userLogin: { userInfo },
  } = getState();
  let notifications;
  if (isFakeMode()) {
    const data = await fakeGetNotifications();
    notifications = data.notifications;
  } else {
    const config = { headers: { Authorization: `Bearer ${userInfo!.token}` } };
    const { data } = await apiClient.get('/api/users/notifications', config);
    notifications = data.notifications;
  }
  dispatch(userNotificationsUpdate(notifications));
};

// ── 8. discardNotification ──────────────────────────────────────────

export const discardNotification =
  (notificationId: string, notificationIndex: number, callback: () => void): AppThunk =>
    async (dispatch, getState) => {
      const {
        userLogin: { userInfo, notifications },
      } = getState();
      const notifClone = structuredClone(notifications!);
      notifClone.items.splice(notificationIndex, 1);
      dispatch(userNotificationsUpdate(notifClone));
      callback();
      if (!isFakeMode()) {
        const config = { headers: { Authorization: `Bearer ${userInfo!.token}` } };
        await apiClient.delete(`/api/users/${notificationId}`, config);
      } else {
        await fakeDiscardNotification();
      }
    };

// ── 9. markNotificationsSeen ────────────────────────────────────────

export const markNotificationsSeen = (): AppThunk => async (dispatch, getState) => {
  const {
    userLogin: { userInfo, notifications },
  } = getState();
  const notifClone = structuredClone(notifications!);
  notifClone.newNotificationsCount = 0;
  dispatch(userNotificationsUpdate(notifClone));
  if (!isFakeMode()) {
    const config = { headers: { Authorization: `Bearer ${userInfo!.token}` } };
    await apiClient.put('/api/users/markNotifications', {}, config);
  } else {
    await fakeMarkNotificationsSeen();
  }
};

// ── 10. updateProfilePicture ────────────────────────────────────────

export const updateProfilePicture =
  (formData: FormData): AppThunk =>
    async (dispatch, getState) => {
      try {
        const {
          userLogin: { userInfo },
        } = getState();
        dispatch(userPictureUpdateRequest());
        let imageUrl: string;
        if (isFakeMode()) {
          const data = await fakeUpdateProfilePicture();
          imageUrl = data.image;
        } else {
          const config = {
            headers: {
              'Content-type': 'multipart/form-data',
              Authorization: `Bearer ${userInfo!.token}`,
            },
          };
          const { data } = await apiClient.post('/api/images/upload', formData, config);
          imageUrl = data.image;
        }
        if (imageUrl) {
          const newImg = new Image();
          newImg.src = imageUrl;
          newImg.onload = () => {
            dispatch(userPictureUpdateSuccess());
            dispatch(userPictureUpdateInLogin(imageUrl));
          };
          // In fake mode, onload won't fire, dispatch directly
          if (isFakeMode()) {
            dispatch(userPictureUpdateSuccess());
            dispatch(userPictureUpdateInLogin(imageUrl));
          }
        }
      } catch (error) {
        dispatch(userPictureUpdateFail(extractErrorMessage(error)));
      }
    };

// ── 11. updateColorTheme ────────────────────────────────────────────

export const updateColorTheme =
  (color: string, projectId: string): AppThunk =>
    (dispatch, getState) => {
      const {
        userLogin: { userInfo },
      } = getState();
      const userInfoClone = structuredClone(userInfo!);
      if (userInfoClone.projectsThemes[projectId]) {
        userInfoClone.projectsThemes[projectId].mainColor = color;
      } else {
        userInfoClone.projectsThemes = {
          ...userInfoClone.projectsThemes,
          [projectId]: { mainColor: color },
        };
      }
      dispatch(userDataUpdate(userInfoClone));
      if (!isFakeMode()) {
        apiClient.put('/api/users/projectColorTheme', { projectId, color });
      }
    };

// ── 12. uploadProjectBgImage ────────────────────────────────────────

export const uploadProjectBgImage =
  (formData: FormData, projectId: string): AppThunk =>
    async (dispatch, getState) => {
      try {
        const {
          userLogin: { userInfo },
        } = getState();
        dispatch(userProjectBgUpdateRequest());
        let imageUrl: string;
        if (isFakeMode()) {
          const data = await fakeUploadProjectBgImage();
          imageUrl = data.image;
        } else {
          const config = {
            headers: {
              'Content-type': 'multipart/form-data',
              Authorization: `Bearer ${userInfo!.token}`,
            },
          };
          const { data } = await apiClient.post(
            `/api/images/upload/projectBgUpload/${projectId}`,
            formData,
            config,
          );
          imageUrl = data.image;
        }
        if (imageUrl) {
          const newImg = new Image();
          newImg.src = imageUrl;
          newImg.onload = () => {
            const bgEl = document.getElementById('project-background');
            if (bgEl) bgEl.style.backgroundImage = `url(${imageUrl})`;
            dispatch(userProjectBgUpdateSuccess());
            const userInfoClone = structuredClone(userInfo!);
            userInfoClone.projectsThemes[projectId].background = imageUrl;
            dispatch(userDataUpdate(userInfoClone));
          };
          if (isFakeMode()) {
            dispatch(userProjectBgUpdateSuccess());
            const userInfoClone = structuredClone(userInfo!);
            if (!userInfoClone.projectsThemes[projectId]) {
              userInfoClone.projectsThemes[projectId] = {};
            }
            userInfoClone.projectsThemes[projectId].background = imageUrl;
            dispatch(userDataUpdate(userInfoClone));
          }
        }
      } catch (error) {
        dispatch(userProjectBgUpdateFail(extractErrorMessage(error)));
      }
    };

// ── 13. updateProjectBgColor ────────────────────────────────────────

export const updateProjectBgColor =
  (background: string, projectId: string): AppThunk =>
    (dispatch, getState) => {
      const {
        userLogin: { userInfo },
      } = getState();
      const bgEl = document.getElementById('project-background');
      if (bgEl) bgEl.style.backgroundImage = background;
      const userInfoClone = structuredClone(userInfo!);
      if (userInfoClone.projectsThemes[projectId]) {
        userInfoClone.projectsThemes[projectId].background = background;
      } else {
        userInfoClone.projectsThemes = {
          ...userInfoClone.projectsThemes,
          [projectId]: { background },
        };
      }
      dispatch(userDataUpdate(userInfoClone));
      if (!isFakeMode()) {
        apiClient.put('/api/users/projectBgColorTheme', { projectId, background });
      }
    };
