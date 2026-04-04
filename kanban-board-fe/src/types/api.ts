import type { User, Notifications, Project, LabelsDocument, ListDocument, Message, Task, UserSummary } from './models';

// Generic API response wrapper
export interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
}

// ---- User API ----

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  userInfo: User;
  notifications: Notifications;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface MessageResponse {
  message: string;
}

export interface EmailConfirmRequest {
  emailCode: string;
}

export interface EmailResendRequest {
  emailCode: string;
}

export type GetUserDataResponse = LoginResponse;

export interface GetNotificationsResponse {
  notifications: Notifications;
}

export interface ImageUploadResponse {
  image: string;
}

export interface UpdateColorThemeRequest {
  projectId: string;
  color: string;
}

export interface UpdateProjectBgColorRequest {
  projectId: string;
  background: string;
}

// ---- Project API ----

export interface CreateProjectRequest {
  title: string;
  background: string;
}

export interface CreateProjectResponse {
  project: Project;
}

export interface GetProjectDataResponse {
  project: Project;
  labels: LabelsDocument;
  lists: ListDocument;
  messages: Message[];
}

export interface FindUsersRequest {
  userData: string;
  isEmail: boolean;
}

export type FindUsersResponse = UserSummary[];

export type GetTaskResponse = Task;
