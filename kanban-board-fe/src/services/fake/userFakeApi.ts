import type {
  LoginResponse,
  MessageResponse,
  GetUserDataResponse,
  GetNotificationsResponse,
  ImageUploadResponse,
} from '../../types/api';
import type { User, Notifications } from '../../types/models';

const delay = () => new Promise<void>((r) => setTimeout(r, 200));

const fakeUser: User = {
  _id: 'fake-user-1',
  username: 'Demo User',
  email: 'demo@example.com',
  profilePicture: null,
  emailConfirmed: true,
  emailCode: '',
  projectsThemes: {
    'fake-project-1': {
      mainColor: '#00bcd4',
      background: 'linear-gradient(135deg, #0055ff 0%, #00bcd4 100%)',
    },
  },
  projectsJoined: [],
  projectsCreated: [{ _id: 'fake-project-1', title: 'Demo Project' }],
  token: 'fake-jwt-token',
};

const fakeNotifications: Notifications = {
  items: [],
  newNotificationsCount: 0,
};

export async function fakeLogin(): Promise<LoginResponse> {
  await delay();
  return { userInfo: { ...fakeUser }, notifications: { ...fakeNotifications } };
}

export async function fakeRegister(): Promise<MessageResponse> {
  await delay();
  return { message: 'Registration successful. Please check your email to confirm your account.' };
}

export async function fakeConfirmEmail(): Promise<MessageResponse> {
  await delay();
  return { message: 'Email confirmed successfully.' };
}

export async function fakeResendEmail(): Promise<MessageResponse> {
  await delay();
  return { message: 'Confirmation email resent successfully.' };
}

export async function fakeGetUserData(): Promise<GetUserDataResponse> {
  await delay();
  return { userInfo: { ...fakeUser }, notifications: { ...fakeNotifications } };
}

export async function fakeGetNotifications(): Promise<GetNotificationsResponse> {
  await delay();
  return { notifications: { ...fakeNotifications } };
}

export async function fakeDiscardNotification(): Promise<void> {
  await delay();
}

export async function fakeMarkNotificationsSeen(): Promise<void> {
  await delay();
}

export async function fakeUpdateProfilePicture(): Promise<ImageUploadResponse> {
  await delay();
  return { image: '/images/default-avatar.png' };
}

export async function fakeUpdateColorTheme(): Promise<void> {
  await delay();
}

export async function fakeUploadProjectBgImage(): Promise<ImageUploadResponse> {
  await delay();
  return { image: '/images/default-avatar.png' };
}

export async function fakeUpdateProjectBgColor(): Promise<void> {
  await delay();
}
