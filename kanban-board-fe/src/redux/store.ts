import { configureStore } from '@reduxjs/toolkit';
import {
  userLoginReducer,
  userRegisterReducer,
  userEmailConfirmReducer,
  userEmailResendReducer,
  userPictureUpdateReducer,
  userProjectBgUpdateReducer,
} from './slices/userSlice';
import {
  projectCreateReducer,
  projectSetCurrentReducer,
  projectGetDataReducer,
  projectTaskMoveReducer,
  projectFindUsersReducer,
  projectSetTaskReducer,
  projectToDoVisibilityReducer,
  projectMessagesReducer,
} from './slices/projectSlice';
import { socketConnectionReducer } from './slices/socketSlice';

const userInfoFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo')!)
  : null;
const toDoListVisibilityFromStorage = localStorage.getItem('toDoListIds')
  ? JSON.parse(localStorage.getItem('toDoListIds')!)
  : [];

const store = configureStore({
  reducer: {
    userLogin: userLoginReducer,
    userRegister: userRegisterReducer,
    userEmailConfirm: userEmailConfirmReducer,
    userEmailResend: userEmailResendReducer,
    userPictureUpdate: userPictureUpdateReducer,
    userProjectBgUpdate: userProjectBgUpdateReducer,
    projectCreate: projectCreateReducer,
    projectSetCurrent: projectSetCurrentReducer,
    projectGetData: projectGetDataReducer,
    projectTaskMove: projectTaskMoveReducer,
    projectFindUsers: projectFindUsersReducer,
    projectSetTask: projectSetTaskReducer,
    projectToDoVisibility: projectToDoVisibilityReducer,
    projectMessages: projectMessagesReducer,
    socketConnection: socketConnectionReducer,
  },
  preloadedState: {
    userLogin: {
      userInfo: userInfoFromStorage,
      loading: userInfoFromStorage && userInfoFromStorage.token ? true : false,
    },
    projectToDoVisibility: { listIds: toDoListVisibilityFromStorage },
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredPaths: ['socketConnection.socket'],
        ignoredActions: ['socketConnection/setSocket'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
