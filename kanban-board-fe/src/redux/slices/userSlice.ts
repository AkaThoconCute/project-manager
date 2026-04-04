import { createSlice, createAction, type PayloadAction } from '@reduxjs/toolkit';
import type {
  UserLoginState,
  UserRegisterState,
  UserEmailConfirmState,
  UserEmailResendState,
  UserPictureUpdateState,
  UserProjectBgUpdateState,
} from '../../types/store';
import type { User, Notifications } from '../../types/models';

// ── Cross-slice action (listened to via extraReducers) ──────────────

export const projectDataTitleUpdate = createAction<{
  title: string;
  projectId: string;
}>('project/dataTitleUpdate');

// ── 1. userLogin slice ──────────────────────────────────────────────

const userLoginInitialState: UserLoginState = { loading: true };

const userLoginSlice = createSlice({
  name: 'userLogin',
  initialState: userLoginInitialState,
  reducers: {
    userLoginRequest(state) {
      state.loading = true;
    },
    userLoginSuccess(
      _state,
      action: PayloadAction<{ userInfo: User; notifications: Notifications }>
    ) {
      return {
        loading: false,
        userInfo: action.payload.userInfo,
        notifications: action.payload.notifications,
      };
    },
    userDataUpdate(state, action: PayloadAction<User>) {
      state.userInfo = action.payload;
    },
    userNotificationsUpdate(state, action: PayloadAction<Notifications>) {
      state.notifications = action.payload;
    },
    userRemoved(
      state,
      action: PayloadAction<{ creator: boolean; projectId: string }>
    ) {
      const stateClone = structuredClone(state.userInfo!);
      if (action.payload.creator) {
        const projectIndex = stateClone.projectsCreated.findIndex(
          (x) => x._id === action.payload.projectId
        );
        stateClone.projectsCreated.splice(projectIndex, 1);
      } else {
        const projectIndex = stateClone.projectsJoined.findIndex(
          (x) => x._id === action.payload.projectId
        );
        stateClone.projectsJoined.splice(projectIndex, 1);
      }
      state.userInfo = stateClone;
    },
    userPictureUpdateInLogin(state, action: PayloadAction<string>) {
      if (state.userInfo) {
        state.userInfo.profilePicture = action.payload;
      }
    },
    userLoginFail(_state, action: PayloadAction<string>) {
      return { loading: false, error: action.payload };
    },
    userLogout() {
      return {} as UserLoginState;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(projectDataTitleUpdate, (state, action) => {
      const { title, projectId } = action.payload;
      const stateClone = structuredClone(state.userInfo!);
      stateClone.projectsCreated.forEach((x) => {
        if (x._id === projectId) x.title = title;
      });
      stateClone.projectsJoined.forEach((x) => {
        if (x._id === projectId) x.title = title;
      });
      state.userInfo = stateClone;
    });
  },
});

export const {
  userLoginRequest,
  userLoginSuccess,
  userDataUpdate,
  userNotificationsUpdate,
  userRemoved,
  userPictureUpdateInLogin,
  userLoginFail,
  userLogout,
} = userLoginSlice.actions;

export const userLoginReducer = userLoginSlice.reducer;

// ── 2. userRegister slice ───────────────────────────────────────────

const userRegisterInitialState: UserRegisterState = {};

const userRegisterSlice = createSlice({
  name: 'userRegister',
  initialState: userRegisterInitialState,
  reducers: {
    userRegisterRequest() {
      return { loading: true };
    },
    userRegisterSuccess(_state, action: PayloadAction<string>) {
      return { loading: false, success: action.payload };
    },
    userRegisterFail(_state, action: PayloadAction<string>) {
      return { loading: false, error: action.payload };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(userLogout, () => {
      return { userInfo: null };
    });
  },
});

export const { userRegisterRequest, userRegisterSuccess, userRegisterFail } =
  userRegisterSlice.actions;

export const userRegisterReducer = userRegisterSlice.reducer;

// ── 3. userEmailConfirm slice ───────────────────────────────────────

const userEmailConfirmInitialState: UserEmailConfirmState = {};

const userEmailConfirmSlice = createSlice({
  name: 'userEmailConfirm',
  initialState: userEmailConfirmInitialState,
  reducers: {
    userEmailConfirmRequest() {
      return { loading: true };
    },
    userEmailConfirmSuccess(_state, action: PayloadAction<string>) {
      return { loading: false, success: action.payload };
    },
    userEmailConfirmFail(_state, action: PayloadAction<string>) {
      return { loading: false, error: action.payload };
    },
  },
});

export const {
  userEmailConfirmRequest,
  userEmailConfirmSuccess,
  userEmailConfirmFail,
} = userEmailConfirmSlice.actions;

export const userEmailConfirmReducer = userEmailConfirmSlice.reducer;

// ── 4. userEmailResend slice ────────────────────────────────────────

const userEmailResendInitialState: UserEmailResendState = {};

const userEmailResendSlice = createSlice({
  name: 'userEmailResend',
  initialState: userEmailResendInitialState,
  reducers: {
    userEmailResendRequest() {
      return { loading: true };
    },
    userEmailResendSuccess(_state, action: PayloadAction<string>) {
      return { loading: false, success: action.payload };
    },
    userEmailResendFail(_state, action: PayloadAction<string>) {
      return { loading: false, error: action.payload };
    },
  },
});

export const {
  userEmailResendRequest,
  userEmailResendSuccess,
  userEmailResendFail,
} = userEmailResendSlice.actions;

export const userEmailResendReducer = userEmailResendSlice.reducer;

// ── 5. userPictureUpdate slice ──────────────────────────────────────

const userPictureUpdateInitialState: UserPictureUpdateState = {};

const userPictureUpdateSlice = createSlice({
  name: 'userPictureUpdate',
  initialState: userPictureUpdateInitialState,
  reducers: {
    userPictureUpdateRequest() {
      return { loading: true };
    },
    userPictureUpdateSuccess() {
      return { loading: false, success: true };
    },
    userPictureUpdateFail(_state, action: PayloadAction<string>) {
      return { loading: false, error: action.payload };
    },
  },
});

export const {
  userPictureUpdateRequest,
  userPictureUpdateSuccess,
  userPictureUpdateFail,
} = userPictureUpdateSlice.actions;

export const userPictureUpdateReducer = userPictureUpdateSlice.reducer;

// ── 6. userProjectBgUpdate slice ────────────────────────────────────

const userProjectBgUpdateInitialState: UserProjectBgUpdateState = {};

const userProjectBgUpdateSlice = createSlice({
  name: 'userProjectBgUpdate',
  initialState: userProjectBgUpdateInitialState,
  reducers: {
    userProjectBgUpdateRequest() {
      return { loading: true };
    },
    userProjectBgUpdateSuccess() {
      return { loading: false, success: true };
    },
    userProjectBgUpdateFail(_state, action: PayloadAction<string>) {
      return { loading: false, error: action.payload };
    },
  },
});

export const {
  userProjectBgUpdateRequest,
  userProjectBgUpdateSuccess,
  userProjectBgUpdateFail,
} = userProjectBgUpdateSlice.actions;

export const userProjectBgUpdateReducer = userProjectBgUpdateSlice.reducer;
