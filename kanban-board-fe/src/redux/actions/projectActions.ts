import {
  projectCreateRequest, projectCreateSuccess, projectCreateFail,
  projectSetCurrent,
  projectDataRequest, projectDataSuccess, projectDataFail,
  projectDataUpdateLists, projectDataAddTask, projectDataAddList,
  projectDataMoveTask, projectDataUpdateLabels,
  projectSetMessages,
  projectTaskMove as projectTaskMoveAction, projectTaskMoveReset,
  projectSetTaskRequest, projectSetTaskSuccess, projectSetTaskFail,
  projectFindUsersRequest, projectFindUsersSuccess, projectFindUsersFail,
  projectToDoVisibilityUpdate, projectResetNewMessage,
} from '../slices/projectSlice';
import { userDataUpdate } from '../slices/userSlice';
import { apiClient, extractErrorMessage } from '../../services/apiClient';
import {
  fakeCreateProject, fakeGetProjectData, fakeGetTask, fakeFindUsersToInvite,
} from '../../services/fake/projectFakeApi';
import { isFakeMode } from '../../config/env';
import { v4 as uuidv4 } from 'uuid';
import { BACKGROUND_COLORS } from '../../util/colorsConstants';
import { getTaskIndexes } from '../../util/utilFunctions';
import type { AppThunk } from '../../types/store';
import type { Task, ListDocument, Label } from '../../types/models';

// ── 1. createProject ────────────────────────────────────────────────

export const createProject = (title: string, callback: (projectId: string) => void): AppThunk =>
  async (dispatch, getState) => {
    try {
      dispatch(projectCreateRequest());
      const { userLogin: { userInfo } } = getState();
      const background = BACKGROUND_COLORS[Math.floor(Math.random() * Math.floor(5))];

      let data;
      if (isFakeMode()) {
        data = await fakeCreateProject(title, background);
      } else {
        const { data: responseData } = await apiClient.post('/api/projects/', { title, background });
        data = responseData;
      }

      callback(data.project._id);

      const userInfoClone = structuredClone(userInfo!);
      userInfoClone.projectsCreated.push(data.project);
      userInfoClone.projectsThemes[data.project._id] = { background };

      dispatch(userDataUpdate(userInfoClone));
      dispatch(projectSetCurrent(data.project));
      dispatch(projectCreateSuccess({ project: data.project }));
    } catch (error) {
      dispatch(projectCreateFail(extractErrorMessage(error)));
    }
  };

// ── 2. getProjectData ───────────────────────────────────────────────

export const getProjectData = (projectId: string, prevProjectId?: string): AppThunk =>
  async (dispatch, getState) => {
    try {
      dispatch(projectDataRequest());
      const { userLogin: { userInfo }, socketConnection: { socket } } = getState();

      // join and leave socket's project board room
      if (prevProjectId && socket) socket.emit('disconnect-board', { room: prevProjectId });
      if (socket) socket.emit('join-board', { room: projectId });

      let project, labels, lists, messages;
      if (isFakeMode()) {
        const data = await fakeGetProjectData(projectId);
        project = data.project; labels = data.labels; lists = data.lists; messages = data.messages;
      } else {
        const config = { headers: { Authorization: `Bearer ${userInfo!.token}` } };
        const { data } = await apiClient.get(`/api/projects/${projectId}`, config);
        project = data.project; labels = data.labels; lists = data.lists; messages = data.messages;
      }

      dispatch(projectDataSuccess({ project, labels, lists }));
      dispatch(projectSetMessages(messages));
    } catch (error) {
      dispatch(projectDataFail(extractErrorMessage(error)));
    }
  };

// ── 3. projectTaskAdd ───────────────────────────────────────────────

export const projectTaskAdd = (
  projectId: string,
  listId: string,
  title: string,
  callback: () => void,
): AppThunk => (dispatch, getState) => {
  const { socketConnection: { socket }, userLogin: { userInfo } } = getState();

  if (isFakeMode()) {
    // Fake: optimistic add — no socket echo needed
    console.log("run projectTaskAdd");

    const optimisticTask: Task = {
      _id: uuidv4(),
      title,
      description: '',
      author: userInfo?._id ?? '',
      archived: false,
      comments: [],
      users: [],
      usersWatching: [],
      labels: [],
      toDoLists: { totalTasks: 0, tasksCompleted: 0, lists: [] },
      creatorId: userInfo?._id ?? '',
      projectId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    dispatch(projectDataAddTask({ listId, task: optimisticTask }));
    callback();
  } else {
    // Real: emit to server — server echoes 'new-task' to ALL via io.to(),
    // Board.tsx listener handles the add via projectDataAddTask
    if (socket) socket.emit('add-task', { projectId, listId, title }, callback);
  }
};

// ── 4. projectListAdd ───────────────────────────────────────────────

export const projectListAdd = (
  projectId: string,
  title: string,
  callback: () => void,
): AppThunk => (dispatch, getState) => {
  const { socketConnection: { socket } } = getState();

  if (isFakeMode()) {
    // Fake: optimistic add — no socket echo needed
    console.log("run projectListAdd");
    const optimisticList = {
      _id: uuidv4(),
      title,
      tasks: [] as Task[],
    };
    dispatch(projectDataAddList({ list: optimisticList }));
    callback();
  } else {
    // Real: emit to server — server echoes 'list-added' to ALL via io.to(),
    // Board.tsx listener handles the add via projectDataAddList
    if (socket) socket.emit('add-list', { projectId, title }, callback);
  }
};

// ── 5. projectTaskMove (DnD) ────────────────────────────────────────

export const projectTaskMove = (
  dropResult: { removedIndex: number | null; addedIndex: number | null },
  listIndex: number,
  projectId: string,
  task: Task,
): AppThunk => (dispatch, getState) => {
  const { socketConnection: { socket }, projectTaskMove: { added, removed } } = getState();

  const emitTaskMove = (
    addedPos: { index: number; listIndex: number },
    removedPos: { listIndex: number; index: number },
  ) => {
    dispatch(projectDataMoveTask({ added: addedPos, removed: removedPos, task }));
    if (socket) socket.emit('task-move', { added: addedPos, removed: removedPos, taskId: task._id, projectId });
    dispatch(projectTaskMoveReset());
  };

  if (dropResult.removedIndex !== null && dropResult.addedIndex !== null) {
    emitTaskMove(
      { index: dropResult.addedIndex, listIndex },
      { listIndex, index: dropResult.removedIndex },
    );
  } else if (dropResult.removedIndex !== null) {
    if (added) {
      emitTaskMove(added, { listIndex, index: dropResult.removedIndex });
    } else {
      dispatch(projectTaskMoveAction({ removed: { listIndex, index: dropResult.removedIndex } }));
    }
  } else if (dropResult.addedIndex !== null) {
    if (removed) {
      emitTaskMove({ index: dropResult.addedIndex, listIndex }, removed);
    } else {
      dispatch(projectTaskMoveAction({ added: { index: dropResult.addedIndex, listIndex } }));
    }
  }
};

// ── 4. projectListMove ──────────────────────────────────────────────

export const projectListMove = (removedIndex: number, addedIndex: number): AppThunk =>
  (dispatch, getState) => {
    const { socketConnection: { socket }, projectGetData: { lists } } = getState();
    const listsCopy = structuredClone(lists!);
    const [list] = listsCopy.lists.splice(removedIndex, 1);
    listsCopy.lists.splice(addedIndex, 0, list);
    dispatch(projectDataUpdateLists(listsCopy));
    if (socket) socket.emit('list-move', { addedIndex, removedIndex, projectId: lists!.projectId });
  };

// ── 5. projectTaskArchive ───────────────────────────────────────────

export const projectTaskArchive = (
  taskId: string,
  projectId: string,
  taskIndex: number,
  listIndex: number,
): AppThunk => (dispatch, getState) => {
  const { socketConnection: { socket }, projectGetData: { lists }, projectSetTask: { task: taskOpened } } = getState();

  getTaskIndexes(lists!.lists, taskIndex, listIndex, taskId, (currentListIndex, currentTaskIndex) => {
    const listsCopy = structuredClone(lists!);
    const [task] = listsCopy.lists[currentListIndex].tasks.splice(currentTaskIndex, 1);
    task.archived = true;
    listsCopy.archivedTasks.unshift(task);
    dispatch(projectDataUpdateLists(listsCopy));

    if (taskOpened && taskOpened._id === taskId) {
      dispatch(projectSetTaskSuccess({ ...taskOpened, archived: true }));
    }

    if (socket) socket.emit('task-archive', { taskId, projectId, listIndex: currentListIndex });
  });
};

// ── 6. projectTasksArchive ──────────────────────────────────────────

export const projectTasksArchive = (listIndex: number, callback: () => void): AppThunk =>
  (dispatch, getState) => {
    const { socketConnection: { socket }, projectGetData: { lists } } = getState();
    const listsCopy = structuredClone(lists!);
    const tasks = listsCopy.lists[listIndex].tasks.splice(0, listsCopy.lists[listIndex].tasks.length);
    if (tasks.length > 0) {
      const archivedTasks = tasks.map((task) => { task.archived = true; return task; });
      listsCopy.archivedTasks = [...archivedTasks, ...listsCopy.archivedTasks];
    }
    dispatch(projectDataUpdateLists(listsCopy));
    callback();
    if (socket) socket.emit('tasks-archive', { projectId: lists!.projectId, listIndex });
  };

// ── 7. projectListDelete ────────────────────────────────────────────

export const projectListDelete = (listIndex: number, listId: string, callback: () => void): AppThunk =>
  (dispatch, getState) => {
    const { socketConnection: { socket }, projectGetData: { lists } } = getState();
    const listsCopy = structuredClone(lists!);
    const [list] = listsCopy.lists.splice(listIndex, 1);
    if (list.tasks.length > 0) {
      const archivedTasks = list.tasks.map((task) => { task.archived = true; return task; });
      listsCopy.archivedTasks = [...archivedTasks, ...listsCopy.archivedTasks];
    }
    dispatch(projectDataUpdateLists(listsCopy));
    callback();
    if (socket) socket.emit('list-delete', { projectId: lists!.projectId, listIndex, listId });
  };

// ── 8. projectTaskDelete ────────────────────────────────────────────

export const projectTaskDelete = (taskId: string, taskIndex: number, callback: () => void): AppThunk =>
  (dispatch, getState) => {
    const { socketConnection: { socket }, projectGetData: { lists } } = getState();
    const listsCopy = structuredClone(lists!);
    listsCopy.archivedTasks.splice(taskIndex, 1);
    dispatch(projectDataUpdateLists(listsCopy));
    callback();
    if (socket) socket.emit('task-delete', { projectId: lists!.projectId, taskId, taskIndex });
  };

// ── 9. projectTaskTransfer ──────────────────────────────────────────

export const projectTaskTransfer = (
  taskId: string,
  taskIndex: number,
  listIndex: number | null,
  newListIndex: number,
  currentListId: string,
  newListId: string,
  callback: () => void,
): AppThunk => (dispatch, getState) => {
  const { socketConnection: { socket }, projectGetData: { lists }, projectSetTask: { task: taskOpened } } = getState();
  const listsCopy = structuredClone(lists!);

  let task: Task;
  // if listIndex is undefined/null then function is called from archived tasks
  if (listIndex !== null) {
    [task] = listsCopy.lists[listIndex].tasks.splice(taskIndex, 1);
  } else {
    if (taskOpened && taskOpened._id === taskId) {
      dispatch(projectSetTaskSuccess({ ...taskOpened, archived: false }));
    }
    [task] = listsCopy.archivedTasks.splice(taskIndex, 1);
    task.archived = false;
  }

  listsCopy.lists[newListIndex].tasks.push(task);
  dispatch(projectDataUpdateLists(listsCopy));
  callback();

  if (socket) socket.emit('task-transfer', { projectId: lists!.projectId, taskId, currentListId, newListId });
};

// ── 10. projectTasksTransfer ────────────────────────────────────────

export const projectTasksTransfer = (
  listIndex: number,
  newListIndex: number,
  callback: () => void,
): AppThunk => (dispatch, getState) => {
  const { socketConnection: { socket }, projectGetData: { lists } } = getState();
  const listsCopy = structuredClone(lists!);
  const tasks = listsCopy.lists[listIndex].tasks.splice(0, listsCopy.lists[listIndex].tasks.length);
  listsCopy.lists[newListIndex].tasks = [...listsCopy.lists[newListIndex].tasks, ...tasks];
  dispatch(projectDataUpdateLists(listsCopy));
  callback();
  if (socket) socket.emit('tasks-transfer', { projectId: lists!.projectId, listIndex, newListIndex });
};

// ── 11. findUsersToInvite ───────────────────────────────────────────

export const findUsersToInvite = (userData: string): AppThunk =>
  async (dispatch, getState) => {
    try {
      dispatch(projectFindUsersRequest());
      const { userLogin: { userInfo }, projectGetData: { project } } = getState();

      // eslint-disable-next-line no-useless-escape
      const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      const isEmail = regex.test(userData.toLowerCase());

      let data;
      if (isFakeMode()) {
        data = await fakeFindUsersToInvite(userData, isEmail);
      } else {
        const config = { headers: { Authorization: `Bearer ${userInfo!.token}` } };
        const { data: responseData } = await apiClient.post(
          `/api/users/find/${project!._id}`,
          { userData, isEmail },
          config,
        );
        data = responseData;
      }

      dispatch(projectFindUsersSuccess(data));
    } catch (error) {
      dispatch(projectFindUsersFail(extractErrorMessage(error)));
    }
  };

// ── 12. sendProjectInvitations ──────────────────────────────────────

export const sendProjectInvitations = (
  users: { _id: string; username: string }[],
  callback: () => void,
): AppThunk => (_dispatch, getState) => {
  const { socketConnection: { socket }, projectGetData: { project } } = getState();
  if (socket) socket.emit('project-invite-users', { projectId: project!._id, users }, callback);
};

// ── 13. updateUserPermissions ───────────────────────────────────────

export const updateUserPermissions = (
  userId: string,
  permissions: number,
  projectId: string,
  handleClose: () => void,
): AppThunk => (_dispatch, getState) => {
  const { socketConnection: { socket } } = getState();
  if (socket) {
    socket.emit(
      'project-user-permissions-update',
      { projectId, userId, newPermissions: permissions === 2 ? 1 : 2 },
      handleClose,
    );
  }
};

// ── 14. removeUserFromProject ───────────────────────────────────────

export const removeUserFromProject = (
  userId: string,
  projectId: string,
  handleClose: () => void,
): AppThunk => (_dispatch, getState) => {
  const { socketConnection: { socket }, projectGetData: { project } } = getState();
  if (project!.creatorId !== userId) {
    if (socket) socket.emit('project-user-remove', { projectId, userId }, handleClose);
  }
};

// ── 15. setTask ─────────────────────────────────────────────────────

export const setTask = (projectId: string, taskId: string): AppThunk =>
  async (dispatch, getState) => {
    try {
      dispatch(projectSetTaskRequest());
      const { userLogin: { userInfo } } = getState();

      let data;
      if (isFakeMode()) {
        data = await fakeGetTask(projectId, taskId);
      } else {
        const config = { headers: { Authorization: `Bearer ${userInfo!.token}` } };
        const { data: responseData } = await apiClient.get(
          `/api/projects/getTask/${projectId}/${taskId}`,
          config,
        );
        data = responseData;
      }

      dispatch(projectSetTaskSuccess(data));
    } catch (error) {
      dispatch(projectSetTaskFail(extractErrorMessage(error)));
    }
  };

// ── 16. taskFieldUpdate ─────────────────────────────────────────────

export const taskFieldUpdate = (
  taskId: string,
  projectId: string,
  updatedData: unknown,
  fieldName: string,
  callback: () => void,
): AppThunk => (_dispatch, getState) => {
  const { socketConnection: { socket } } = getState();
  if (socket) socket.emit('task-field-update', { taskId, projectId, updatedData, fieldName }, callback);
};

// ── 17. taskUsersUpdate ─────────────────────────────────────────────

export const taskUsersUpdate = (
  taskId: string,
  projectId: string,
  newUsers: string[],
  removedUsers: string[],
  addedUsers: string[],
  callback: () => void,
): AppThunk => (_dispatch, getState) => {
  const { socketConnection: { socket } } = getState();
  if (socket) socket.emit('task-users-update', { taskId, projectId, newUsers, removedUsers, addedUsers }, callback);
};

// ── 18. updateLabels ────────────────────────────────────────────────

export const updateLabels = (
  taskId: string,
  projectId: string,
  newLabels: string[],
  listIndex: number,
  taskIndex: number,
): AppThunk => (dispatch, getState) => {
  const { socketConnection: { socket }, projectGetData: { lists }, projectSetTask: { task } } = getState();
  const listsCopy = structuredClone(lists!);

  getTaskIndexes(listsCopy.lists, listIndex, taskIndex, taskId, (newListIndex, newTaskIndex) => {
    listsCopy.lists[newListIndex].tasks[newTaskIndex].labels = newLabels;
    dispatch(projectDataUpdateLists(listsCopy));
    dispatch(projectSetTaskSuccess({ ...task!, labels: newLabels }));
  });

  if (socket) socket.emit('task-field-update', { taskId, projectId, updatedData: newLabels, fieldName: 'labels' });
};

// ── 19. createLabel ─────────────────────────────────────────────────

export const createLabel = (
  listIndex: number,
  taskIndex: number,
  taskId: string,
  label: Label,
  callback: () => void,
): AppThunk => (dispatch, getState) => {
  const { projectGetData: { lists, labels }, projectSetTask: { task } } = getState();
  const listsCopy = structuredClone(lists!);
  const labelsCopy = structuredClone(labels!);

  getTaskIndexes(listsCopy.lists, listIndex, taskIndex, taskId, (newListIndex, newTaskIndex) => {
    listsCopy.lists[newListIndex].tasks[newTaskIndex].labels.push(label._id);
    labelsCopy.labels[label._id] = label;
    labelsCopy.labelIds.push(label._id);
    dispatch(projectDataUpdateLabels(labelsCopy));

    if (task!._id === taskId) {
      dispatch(projectSetTaskSuccess({ ...task!, labels: [...task!.labels, label._id] }));
      callback();
    }

    dispatch(projectDataUpdateLists(listsCopy));
  });
};

// ── 20. deleteLabel ─────────────────────────────────────────────────

export const deleteLabel = (labelId: string, callback: () => void): AppThunk =>
  (dispatch, getState) => {
    const { projectGetData: { labels }, socketConnection: { socket } } = getState();
    const labelsCopy = structuredClone(labels!);
    delete labelsCopy.labels[labelId];
    labelsCopy.labelIds = labelsCopy.labelIds.filter((id) => id !== labelId);
    dispatch(projectDataUpdateLabels(labelsCopy));
    callback();
    if (socket) socket.emit('label-delete', { projectId: labelsCopy.projectId, labelId });
  };

// ── 21. editLabel ───────────────────────────────────────────────────

export const editLabel = (
  labelId: string,
  title: string,
  color: string,
  callback: () => void,
): AppThunk => (dispatch, getState) => {
  const { projectGetData: { labels }, socketConnection: { socket } } = getState();
  const labelsCopy = structuredClone(labels!);
  labelsCopy.labels[labelId] = { ...labelsCopy.labels[labelId], title, color };
  dispatch(projectDataUpdateLabels(labelsCopy));
  callback();
  if (socket) socket.emit('label-edit', { projectId: labelsCopy.projectId, title, color, labelId });
};

// ── 22. createToDoList ──────────────────────────────────────────────

export const createToDoList = (
  taskId: string,
  projectId: string,
  title: string,
  callback: () => void,
): AppThunk => (_dispatch, getState) => {
  const { socketConnection: { socket } } = getState();
  if (socket) socket.emit('add-to-do-list', { projectId, title, taskId }, callback);
};

// ── 23. updateToDoListTitle ─────────────────────────────────────────

export const updateToDoListTitle = (
  taskId: string,
  projectId: string,
  listId: string,
  listIndex: number,
  title: string,
  callback: () => void,
): AppThunk => (dispatch, getState) => {
  const { socketConnection: { socket }, projectSetTask: { task } } = getState();

  if (task && task._id === taskId) {
    const taskClone = structuredClone(task);
    taskClone.toDoLists.lists[listIndex].title = title;
    dispatch(projectSetTaskSuccess(taskClone));
    callback();
  }

  if (socket) socket.emit('update-to-do-list-title', { projectId, title, listId, taskId });
};

// ── 24. updateToDoListVisibility ────────────────────────────────────

export const updateToDoListVisibility = (listId: string, visibility: boolean): AppThunk =>
  (dispatch, getState) => {
    const { projectToDoVisibility: { listIds } } = getState();
    const listIdsCopy = [...listIds];

    if (visibility) {
      listIdsCopy.push(listId);
    } else {
      const idIndex = listIdsCopy.indexOf(listId);
      listIdsCopy.splice(idIndex, 1);
    }

    dispatch(projectToDoVisibilityUpdate(listIdsCopy));
    localStorage.setItem('toDoListIds', JSON.stringify(listIdsCopy));
  };

// ── 25. deleteToDoList ──────────────────────────────────────────────

export const deleteToDoList = (
  taskId: string,
  projectId: string,
  listId: string,
  listIndex: number,
  callback: () => void,
): AppThunk => (dispatch, getState) => {
  const { socketConnection: { socket }, projectSetTask: { task } } = getState();

  if (task && task._id === taskId) {
    const taskClone = structuredClone(task);
    const [toDoList] = taskClone.toDoLists.lists.splice(listIndex, 1);
    taskClone.toDoLists.totalTasks -= toDoList.tasks.length;
    taskClone.toDoLists.tasksCompleted -= toDoList.tasksFinished;
    dispatch(projectSetTaskSuccess(taskClone));
    callback();
  }

  if (socket) socket.emit('delete-to-do-list', { taskId, projectId, listId });
};

// ── 26. addToDoTask ─────────────────────────────────────────────────

export const addToDoTask = (
  taskId: string,
  toDoListId: string,
  toDoListIndex: number,
  projectId: string,
  title: string,
  callback: () => void,
): AppThunk => (dispatch, getState) => {
  const { socketConnection: { socket }, projectSetTask: { task } } = getState();

  if (isFakeMode()) {
    if (task && task._id === taskId) {
      const optimisticToDoTask = { _id: uuidv4(), title, finished: false };
      const taskClone = structuredClone(task);
      taskClone.toDoLists.lists[toDoListIndex].tasks.push(optimisticToDoTask);
      taskClone.toDoLists.totalTasks += 1;
      dispatch(projectSetTaskSuccess(taskClone));
      callback();
    }
    return;
  }

  if (socket) {
    socket.emit(
      'add-to-do-task',
      { taskId, projectId, title, toDoListId },
      (toDoTask: { _id: string; title: string; finished: boolean }) => {
        if (task && task._id === taskId) {
          const taskClone = structuredClone(task);
          taskClone.toDoLists.lists[toDoListIndex].tasks.push(toDoTask);
          taskClone.toDoLists.totalTasks += 1;
          dispatch(projectSetTaskSuccess(taskClone));
          callback();
        }
      },
    );
  }
};

// ── 27. updateToDoTaskProgress ──────────────────────────────────────

export const updateToDoTaskProgress = (
  taskId: string,
  toDoListId: string,
  toDoListIndex: number,
  toDoTaskId: string,
  toDoTaskIndex: number,
  projectId: string,
  completed: boolean,
): AppThunk => (dispatch, getState) => {
  const { socketConnection: { socket }, projectSetTask: { task } } = getState();

  if (task && task._id === taskId) {
    const taskClone = structuredClone(task);
    taskClone.toDoLists.lists[toDoListIndex].tasks[toDoTaskIndex].finished = completed;
    if (completed) {
      taskClone.toDoLists.tasksCompleted++;
      taskClone.toDoLists.lists[toDoListIndex].tasksFinished++;
    } else {
      taskClone.toDoLists.tasksCompleted--;
      taskClone.toDoLists.lists[toDoListIndex].tasksFinished--;
    }
    dispatch(projectSetTaskSuccess(taskClone));
  }

  if (socket) socket.emit('update-to-do-task-progress', { taskId, toDoTaskId, toDoListId, projectId, completed });
};

// ── 28. updateToDoTaskTitle ─────────────────────────────────────────

export const updateToDoTaskTitle = (
  taskId: string,
  toDoListId: string,
  toDoListIndex: number,
  toDoTaskId: string,
  toDoTaskIndex: number,
  projectId: string,
  title: string,
  callback: () => void,
): AppThunk => (dispatch, getState) => {
  const { socketConnection: { socket }, projectSetTask: { task } } = getState();

  if (task && task._id === taskId) {
    const taskClone = structuredClone(task);
    taskClone.toDoLists.lists[toDoListIndex].tasks[toDoTaskIndex].title = title;
    dispatch(projectSetTaskSuccess(taskClone));
    callback();
  }

  if (socket) socket.emit('update-to-do-task-title', { taskId, toDoTaskId, toDoListId, projectId, title });
};

// ── 29. deleteToDoTask ──────────────────────────────────────────────

export const deleteToDoTask = (
  taskId: string,
  toDoListId: string,
  toDoListIndex: number,
  toDoTaskId: string,
  toDoTaskIndex: number,
  projectId: string,
  completed: boolean,
): AppThunk => (dispatch, getState) => {
  const { socketConnection: { socket }, projectSetTask: { task } } = getState();

  if (task && task._id === taskId) {
    const taskClone = structuredClone(task);
    taskClone.toDoLists.lists[toDoListIndex].tasks.splice(toDoTaskIndex, 1);
    taskClone.toDoLists.totalTasks -= 1;
    if (completed) {
      taskClone.toDoLists.tasksCompleted -= 1;
      taskClone.toDoLists.lists[toDoListIndex].tasksFinished -= 1;
    }
    dispatch(projectSetTaskSuccess(taskClone));
  }

  if (socket) socket.emit('delete-to-do-task', { taskId, toDoTaskId, toDoListId, projectId, completed });
};

// ── 30. addComment ──────────────────────────────────────────────────

export const addComment = (
  taskId: string,
  projectId: string,
  comment: string,
  callback: () => void,
): AppThunk => (dispatch, getState) => {
  const { userLogin: { userInfo }, socketConnection: { socket }, projectSetTask: { task } } = getState();

  if (isFakeMode()) {
    if (task && task._id === taskId) {
      const now = new Date().toISOString();
      const optimisticComment = {
        _id: uuidv4(),
        comment,
        user: {
          _id: userInfo!._id,
          username: userInfo!.username,
          profilePicture: userInfo!.profilePicture,
        },
        createdAt: now,
        updatedAt: now,
      };
      const taskClone = structuredClone(task);
      taskClone.comments.unshift(optimisticComment);
      dispatch(projectSetTaskSuccess(taskClone));
      callback();
    }
    return;
  }

  if (socket) {
    socket.emit(
      'add-comment',
      { taskId, projectId, comment },
      (createdComment: { _id: string; comment: string; user?: unknown; createdAt: string; updatedAt: string }) => {
        if (task && task._id === taskId) {
          const taskClone = structuredClone(task);
          const commentWithUser = {
            ...createdComment,
            user: {
              _id: userInfo!._id,
              username: userInfo!.username,
              profilePicture: userInfo!.profilePicture,
            },
          };
          taskClone.comments.unshift(commentWithUser);
          dispatch(projectSetTaskSuccess(taskClone));
          callback();
        }
      },
    );
  }
};

// ── 31. editComment ─────────────────────────────────────────────────

export const editComment = (
  taskId: string,
  projectId: string,
  commentId: string,
  newComment: string,
  commentIndex: number,
  callback: () => void,
): AppThunk => (dispatch, getState) => {
  const { socketConnection: { socket }, projectSetTask: { task } } = getState();

  if (task && task._id === taskId) {
    const taskClone = structuredClone(task);
    taskClone.comments[commentIndex].comment = newComment;
    taskClone.comments[commentIndex].updatedAt = new Date().toISOString();
    dispatch(projectSetTaskSuccess(taskClone));
    callback();
  }

  if (socket) socket.emit('edit-comment', { taskId, projectId, commentId, newComment });
};

// ── 32. deleteComment ───────────────────────────────────────────────

export const deleteComment = (
  taskId: string,
  projectId: string,
  commentId: string,
  commentIndex: number,
  callback: () => void,
): AppThunk => (dispatch, getState) => {
  const { socketConnection: { socket }, projectSetTask: { task } } = getState();

  if (task && task._id === taskId) {
    const taskClone = structuredClone(task);
    taskClone.comments.splice(commentIndex, 1);
    dispatch(projectSetTaskSuccess(taskClone));
    callback();
  }

  if (socket) socket.emit('delete-comment', { taskId, projectId, commentId });
};

// ── 33. copyTask ────────────────────────────────────────────────────

export const copyTask = (
  projectId: string,
  taskId: string,
  newListId: string,
  callback: () => void,
): AppThunk => (_dispatch, getState) => {
  const { socketConnection: { socket } } = getState();
  if (socket) socket.emit('copy-task', { taskId, projectId, newListId }, callback);
};

// ── 34. updateTaskWatch ─────────────────────────────────────────────

export const updateTaskWatch = (
  taskId: string,
  userId: string,
  isWatching: boolean,
  taskIndex: number,
  listIndex: number | null,
): AppThunk => (dispatch, getState) => {
  const { socketConnection: { socket }, projectSetTask: { task }, projectGetData: { lists } } = getState();

  const updateUsersWatching = (
    currentListIndex: number | null,
    currentTaskIndex: number,
    listsDoc: ListDocument,
    taskClone: Task,
  ) => {
    if (isWatching) {
      const userIndex = taskClone.usersWatching.indexOf(userId);
      if (userIndex > -1) {
        taskClone.usersWatching.splice(userIndex, 1);
        if (currentListIndex !== null) {
          listsDoc.lists[currentListIndex].tasks[currentTaskIndex].usersWatching.splice(userIndex, 1);
        } else {
          listsDoc.archivedTasks[currentTaskIndex].usersWatching.splice(userIndex, 1);
        }
      }
    } else {
      taskClone.usersWatching.push(userId);
      if (currentListIndex !== null) {
        listsDoc.lists[currentListIndex].tasks[currentTaskIndex].usersWatching.push(userId);
      } else {
        listsDoc.archivedTasks[currentTaskIndex].usersWatching.push(userId);
      }
    }

    dispatch(projectDataUpdateLists(listsDoc));
    dispatch(projectSetTaskSuccess(taskClone));
  };

  if (listIndex) {
    getTaskIndexes(lists!.lists, taskIndex, listIndex, taskId, (currentListIndex, currentTaskIndex) => {
      const taskClone = structuredClone(task!);
      updateUsersWatching(currentListIndex, currentTaskIndex, lists!, taskClone);
    });
  } else {
    const taskClone = structuredClone(task!);
    updateUsersWatching(null, taskIndex, lists!, taskClone);
  }

  if (socket) socket.emit('task-watch', { taskId, isWatching });
};

// ── 35. sendMessage ─────────────────────────────────────────────────

export const sendMessage = (message: string, callback: () => void): AppThunk =>
  (dispatch, getState) => {
    const {
      socketConnection: { socket },
      projectGetData: { project },
      userLogin: { userInfo },
    } = getState();

    dispatch(projectResetNewMessage());

    if (socket) {
      socket.emit(
        'send-message',
        {
          projectId: project!._id,
          message,
          username: userInfo!.username,
          profilePicture: userInfo!.profilePicture,
        },
        callback,
      );
    }
  };

// ── 36. deleteProject ───────────────────────────────────────────────

export const deleteProject = (projectId: string, callback: () => void): AppThunk =>
  (_dispatch, getState) => {
    const { socketConnection: { socket } } = getState();
    if (socket) socket.emit('delete-project', { projectId }, callback);
  };
