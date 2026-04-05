// ── Enums ───────────────────────────────────────────────────────────

export const NotificationType = {
  TASK_ASSIGNED: 'task-assigned',
  TASK_COMMENT: 'task-comment',
  PROJECT_INVITE: 'project-invite',
  TASK_UPDATED: 'task-updated',
} as const;

export type NotificationType =
  (typeof NotificationType)[keyof typeof NotificationType];

export const UserPermission = {
  VIEWER: 0,
  MEMBER: 1,
  ADMIN: 2,
} as const;

export type UserPermission =
  (typeof UserPermission)[keyof typeof UserPermission];

// ── Helper / Embedded Types ─────────────────────────────────────────

export interface UserSummary {
  _id: string;
  username: string;
  email?: string;
  profilePicture: string | null;
}

export interface ProjectSummary {
  _id: string;
  title: string;
}

export interface ProjectTheme {
  mainColor?: string;
  background?: string;
}

export interface ProjectBackground {
  color?: string;
  image?: string;
  size?: string;
  position?: string;
  repeat?: string;
}

export interface ProjectUser {
  user: string | UserSummary;
  permissions: number;
  tasksAssigned: string[];
}

// ── User ────────────────────────────────────────────────────────────

export interface User {
  _id: string;
  username: string;
  email: string;
  profilePicture: string | null;
  emailConfirmed: boolean;
  emailCode: string;
  projectsThemes: Record<string, ProjectTheme>;
  projectsJoined: ProjectSummary[];
  projectsCreated: ProjectSummary[];
  token: string;
}

// ── Project ─────────────────────────────────────────────────────────

export interface Project {
  _id: string;
  title: string;
  colorTheme?: string;
  background: ProjectBackground;
  users: ProjectUser[];
  creatorId: string;
  joinId: string;
  joinIdActive: boolean;
  permissions?: number;
}

// ── List ────────────────────────────────────────────────────────────

export interface ListItem {
  _id: string;
  title: string;
  tasks: Task[];
}

export interface ListDocument {
  _id: string;
  lists: ListItem[];
  archivedTasks: Task[];
  projectId: string;
}

// ── Task ────────────────────────────────────────────────────────────

export interface Comment {
  _id: string;
  comment: string;
  user: string | UserSummary;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  deadline?: string;
  author: string;
  archived: boolean;
  deleted?: boolean;
  comments: Comment[];
  users: (string | UserSummary)[];
  usersWatching: string[];
  labels: string[];
  toDoLists: TaskToDoLists;
  creatorId: string;
  projectId: string;
  createdAt: string;
  updatedAt: string;
}

// ── Labels ──────────────────────────────────────────────────────────

export interface Label {
  _id: string;
  title: string;
  color: string;
}

export interface LabelsDocument {
  _id: string;
  labelIds: string[];
  labels: Record<string, Label>;
  projectId: string;
}

// ── To-Do Lists ─────────────────────────────────────────────────────

export interface ToDoTask {
  _id: string;
  title: string;
  finished: boolean;
}

export interface ToDoList {
  _id: string;
  title: string;
  tasksFinished: number;
  tasks: ToDoTask[];
  creatorId: string;
  taskId: string;
  projectId: string;
}

export interface TaskToDoLists {
  totalTasks: number;
  tasksCompleted: number;
  lists: ToDoList[];
}

// ── Message ─────────────────────────────────────────────────────────

export interface Message {
  _id: string;
  message: string;
  user: string | UserSummary;
  projectId: string;
  createdAt: string;
}

// ── Notification ────────────────────────────────────────────────────

export interface Notification {
  _id: string;
  type: string;
  description?: string;
  project: string | ProjectSummary;
  listId?: string;
  task?: string;
  seenDate?: string;
  sender: string | UserSummary;
  recipient: string;
  createdAt: string;
}

export interface Notifications {
  items: Notification[];
  newNotificationsCount: number;
}
