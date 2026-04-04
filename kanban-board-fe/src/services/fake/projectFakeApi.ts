import type {
  CreateProjectResponse,
  GetProjectDataResponse,
  FindUsersResponse,
  GetTaskResponse,
} from '../../types/api';
import type {
  Project,
  ListDocument,
  LabelsDocument,
  Message,
  Task,
  UserSummary,
} from '../../types/models';

const delay = () => new Promise<void>((r) => setTimeout(r, 200));

const NOW = '2026-04-05T12:00:00.000Z';

function makeTask(overrides: Partial<Task> & Pick<Task, '_id' | 'title' | 'projectId'>): Task {
  return {
    description: '',
    author: 'fake-user-1',
    archived: false,
    comments: [],
    users: [],
    usersWatching: [],
    labels: [],
    toDoLists: { totalTasks: 0, tasksCompleted: 0, lists: [] },
    creatorId: 'fake-user-1',
    createdAt: NOW,
    updatedAt: NOW,
    ...overrides,
  };
}

export async function fakeCreateProject(
  title: string,
  background: string,
): Promise<CreateProjectResponse> {
  await delay();

  const project: Project = {
    _id: 'fake-project-new',
    title,
    background: { color: background },
    creatorId: 'fake-user-1',
    joinId: 'fake-join-id',
    joinIdActive: true,
    users: [{ user: 'fake-user-1', permissions: 2, tasksAssigned: [] }],
  };

  return { project };
}

export async function fakeGetProjectData(
  projectId: string,
): Promise<GetProjectDataResponse> {
  await delay();

  const task1 = makeTask({ _id: `${projectId}-task-1`, title: 'Setup project', projectId });
  const task2 = makeTask({ _id: `${projectId}-task-2`, title: 'Design mockups', projectId });
  const task3 = makeTask({ _id: `${projectId}-task-3`, title: 'Implement API', projectId });
  const task4 = makeTask({ _id: `${projectId}-task-4`, title: 'Write tests', projectId });

  const lists: ListDocument = {
    _id: `${projectId}-lists`,
    lists: [
      { _id: `${projectId}-list-1`, title: 'To Do', tasks: [task1, task2] },
      { _id: `${projectId}-list-2`, title: 'In Progress', tasks: [task3, task4] },
    ],
    archivedTasks: [],
    projectId,
  };

  const labelBug: string = `${projectId}-label-1`;
  const labelFeature: string = `${projectId}-label-2`;
  const labelEnhancement: string = `${projectId}-label-3`;

  const labels: LabelsDocument = {
    _id: `${projectId}-labels`,
    labelIds: [labelBug, labelFeature, labelEnhancement],
    labels: {
      [labelBug]: { _id: labelBug, title: 'Bug', color: '#f44336' },
      [labelFeature]: { _id: labelFeature, title: 'Feature', color: '#4caf50' },
      [labelEnhancement]: { _id: labelEnhancement, title: 'Enhancement', color: '#2196f3' },
    },
    projectId,
  };

  const messages: Message[] = [
    {
      _id: `${projectId}-msg-1`,
      message: 'Welcome to the project!',
      user: { _id: 'fake-user-1', username: 'Demo User', profilePicture: null },
      projectId,
      createdAt: NOW,
    },
  ];

  const project: Project = {
    _id: projectId,
    title: 'Demo Project',
    background: { color: '#0079bf' },
    creatorId: 'fake-user-1',
    joinId: 'fake-join-id',
    joinIdActive: true,
    users: [{ user: 'fake-user-1', permissions: 2, tasksAssigned: [] }],
  };

  return { project, labels, lists, messages };
}

export async function fakeGetTask(
  projectId: string,
  taskId: string,
): Promise<GetTaskResponse> {
  await delay();

  return makeTask({
    _id: taskId,
    title: 'Sample Task',
    description: 'Detailed description of the sample task.',
    projectId,
    comments: [
      {
        _id: `${taskId}-comment-1`,
        comment: 'Looks good, let\'s proceed.',
        user: { _id: 'fake-user-1', username: 'Demo User', profilePicture: null },
        createdAt: NOW,
        updatedAt: NOW,
      },
    ],
    toDoLists: {
      totalTasks: 2,
      tasksCompleted: 1,
      lists: [
        {
          _id: `${taskId}-todo-1`,
          title: 'Checklist',
          tasksFinished: 1,
          tasks: [
            { _id: `${taskId}-todo-1-task-1`, title: 'Subtask A', finished: true },
            { _id: `${taskId}-todo-1-task-2`, title: 'Subtask B', finished: false },
          ],
          creatorId: 'fake-user-1',
          taskId,
          projectId,
        },
      ],
    },
  });
}

export async function fakeFindUsersToInvite(
  _userData: string,
  _isEmail: boolean,
): Promise<FindUsersResponse> {
  await delay();

  const users: UserSummary[] = [
    { _id: 'fake-user-2', username: 'Alice Johnson', profilePicture: null },
    { _id: 'fake-user-3', username: 'Bob Smith', profilePicture: null },
  ];

  return users;
}
