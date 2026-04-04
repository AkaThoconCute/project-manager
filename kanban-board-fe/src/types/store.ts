import type { ThunkAction, Action } from '@reduxjs/toolkit';
import type { ThunkDispatch } from '@reduxjs/toolkit';
import type {
  User,
  Notifications,
  Project,
  ListDocument,
  LabelsDocument,
  Task,
  Message,
  UserSummary,
} from './models';
import type { Socket } from 'socket.io-client';

// --- User slice states ---

export interface UserLoginState {
  loading?: boolean;
  userInfo?: User | null;
  notifications?: Notifications;
  error?: string;
}

export interface UserRegisterState {
  loading?: boolean;
  success?: string;
  error?: string;
  userInfo?: null;
}

export interface UserEmailConfirmState {
  loading?: boolean;
  success?: string;
  error?: string;
}

export interface UserEmailResendState {
  loading?: boolean;
  success?: string;
  error?: string;
}

export interface UserPictureUpdateState {
  loading?: boolean;
  success?: boolean;
  error?: string;
}

export interface UserProjectBgUpdateState {
  loading?: boolean;
  success?: boolean;
  error?: string;
}

// --- Project slice states ---

export interface ProjectCreateState {
  loading?: boolean;
  project?: Project;
  error?: string;
}

export interface ProjectSetCurrentState {
  project?: Project;
}

export interface ProjectGetDataState {
  loading?: boolean;
  project?: Project;
  lists?: ListDocument;
  labels?: LabelsDocument;
  error?: string;
}

export interface TaskMovePosition {
  index: number;
  listIndex: number;
}

export interface ProjectTaskMoveState {
  removed: TaskMovePosition | null;
  added: TaskMovePosition | null;
}

export interface ProjectFindUsersState {
  loading?: boolean;
  users: UserSummary[];
  error?: string;
}

export interface ProjectSetTaskState {
  loading?: boolean;
  task?: Task;
  error?: string;
}

export interface ProjectToDoVisibilityState {
  listIds: string[];
}

export interface ProjectMessagesState {
  messages: Message[];
  newMessage?: boolean;
}

// --- Socket slice state ---

export interface SocketConnectionState {
  socket?: Socket;
}

// --- Root state ---

export interface RootState {
  userLogin: UserLoginState;
  userRegister: UserRegisterState;
  userEmailConfirm: UserEmailConfirmState;
  userEmailResend: UserEmailResendState;
  userPictureUpdate: UserPictureUpdateState;
  userProjectBgUpdate: UserProjectBgUpdateState;
  projectCreate: ProjectCreateState;
  projectSetCurrent: ProjectSetCurrentState;
  projectGetData: ProjectGetDataState;
  projectTaskMove: ProjectTaskMoveState;
  projectFindUsers: ProjectFindUsersState;
  projectSetTask: ProjectSetTaskState;
  projectToDoVisibility: ProjectToDoVisibilityState;
  projectMessages: ProjectMessagesState;
  socketConnection: SocketConnectionState;
}

// --- Typed dispatch & thunk ---

export type AppDispatch = ThunkDispatch<RootState, undefined, Action>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  undefined,
  Action
>;
