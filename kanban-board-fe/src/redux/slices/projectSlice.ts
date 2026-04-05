import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type {
  ProjectCreateState,
  ProjectSetCurrentState,
  ProjectGetDataState,
  ProjectTaskMoveState,
  TaskMovePosition,
  ProjectFindUsersState,
  ProjectSetTaskState,
  ProjectToDoVisibilityState,
  ProjectMessagesState,
} from '../../types/store';
import type {
  Project,
  ProjectSummary,
  ListDocument,
  ListItem,
  LabelsDocument,
  Task,
  Message,
  UserSummary,
  ProjectUser,
} from '../../types/models';
import { projectDataTitleUpdate } from './userSlice';

// ── 1. projectCreate slice ──────────────────────────────────────────

const projectCreateInitialState: ProjectCreateState = {};

const projectCreateSlice = createSlice({
  name: 'projectCreate',
  initialState: projectCreateInitialState,
  reducers: {
    projectCreateRequest() {
      return { loading: true };
    },
    projectCreateSuccess(
      _state,
      action: PayloadAction<{ project: Project }>
    ) {
      return { loading: false, project: action.payload.project };
    },
    projectCreateFail(_state, action: PayloadAction<string>) {
      return { loading: false, error: action.payload };
    },
    projectCreateReset() {
      return {};
    },
  },
});

export const {
  projectCreateRequest,
  projectCreateSuccess,
  projectCreateFail,
  projectCreateReset,
} = projectCreateSlice.actions;

export const projectCreateReducer = projectCreateSlice.reducer;

// ── 2. projectSetCurrent slice ──────────────────────────────────────

const projectSetCurrentInitialState: ProjectSetCurrentState = {};

const projectSetCurrentSlice = createSlice({
  name: 'projectSetCurrent',
  initialState: projectSetCurrentInitialState,
  reducers: {
    projectSetCurrent(_state, action: PayloadAction<ProjectSummary>) {
      return { project: action.payload };
    },
    projectSetCurrentReset() {
      return {};
    },
  },
  extraReducers: (builder) => {
    builder.addCase(projectDataTitleUpdate, (state, action) => {
      const stateClone = structuredClone(state);
      stateClone.project!.title = action.payload.title;
      return stateClone;
    });
  },
});

export const { projectSetCurrent, projectSetCurrentReset } =
  projectSetCurrentSlice.actions;

export const projectSetCurrentReducer = projectSetCurrentSlice.reducer;

// ── 3. projectGetData slice (most complex) ──────────────────────────

const projectGetDataInitialState: ProjectGetDataState = { loading: true };

const projectGetDataSlice = createSlice({
  name: 'projectGetData',
  initialState: projectGetDataInitialState,
  reducers: {
    projectDataRequest() {
      return { loading: true };
    },
    projectDataSuccess(
      _state,
      action: PayloadAction<{
        project: Project;
        lists: ListDocument;
        labels: LabelsDocument;
      }>
    ) {
      return {
        loading: false,
        project: action.payload.project,
        lists: action.payload.lists,
        labels: action.payload.labels,
      };
    },
    projectDataAddTask(
      state,
      action: PayloadAction<{ listId: string; task: Task }>
    ) {
      const stateClone = structuredClone(state);
      const listIndex = stateClone.lists!.lists.findIndex(
        (list) => list._id === action.payload.listId
      );
      stateClone.lists!.lists[listIndex].tasks.push(action.payload.task);
      return stateClone;
    },
    projectDataUpdateLists(state, action: PayloadAction<ListDocument>) {
      return { ...state, lists: action.payload };
    },
    projectDataMoveTask(
      state,
      action: PayloadAction<{
        added: TaskMovePosition;
        removed: TaskMovePosition;
        task: Task;
      }>
    ) {
      const { added, removed, task } = action.payload;
      const stateCopy = structuredClone(state);
      stateCopy.lists!.lists[removed.listIndex].tasks.splice(removed.index, 1);
      stateCopy.lists!.lists[added.listIndex].tasks.splice(
        added.index,
        0,
        task
      );
      return stateCopy;
    },
    projectDataAddList(state, action: PayloadAction<{ list: ListItem }>) {
      const stateClone = { ...state };
      stateClone.lists!.lists.push(action.payload.list);
      return stateClone;
    },
    projectDataListTitleUpdate(
      state,
      action: PayloadAction<{ listIndex: number; title: string }>
    ) {
      const { listIndex, title } = action.payload;
      const stateClone = structuredClone(state);
      stateClone.lists!.lists[listIndex].title = title;
      return stateClone;
    },
    projectDataJoinLinkUpdate(
      state,
      action: PayloadAction<{ joinId: string; joinIdActive: boolean }>
    ) {
      const stateClone = structuredClone(state);
      stateClone.project!.joinId = action.payload.joinId;
      stateClone.project!.joinIdActive = action.payload.joinIdActive;
      return stateClone;
    },
    projectDataUsersUpdate(state, action: PayloadAction<ProjectUser[]>) {
      const stateClone = structuredClone(state);
      stateClone.project!.users = action.payload;
      return stateClone;
    },
    projectDataPermissionsUpdate(state, action: PayloadAction<number>) {
      return {
        ...state,
        project: { ...state.project!, permissions: action.payload },
      };
    },
    projectDataTaskArchived(
      state,
      action: PayloadAction<{ listIndex: number; taskId: string }>
    ) {
      const { listIndex, taskId } = action.payload;
      const stateClone = structuredClone(state);
      const taskIndex = stateClone.lists!.lists[listIndex].tasks.findIndex(
        (x) => x._id === taskId
      );
      stateClone.lists!.lists[listIndex].tasks.splice(taskIndex, 1);
      return stateClone;
    },
    projectDataUpdateLabels(state, action: PayloadAction<LabelsDocument>) {
      return { ...state, labels: action.payload };
    },
    projectDataFail(_state, action: PayloadAction<string>) {
      return { loading: false, error: action.payload };
    },
    projectDataReset() {
      return {};
    },
  },
  extraReducers: (builder) => {
    builder.addCase(projectDataTitleUpdate, (state, action) => {
      const stateClone = structuredClone(state);
      stateClone.project!.title = action.payload.title;
      return stateClone;
    });
  },
});

export const {
  projectDataRequest,
  projectDataSuccess,
  projectDataAddTask,
  projectDataUpdateLists,
  projectDataMoveTask,
  projectDataAddList,
  projectDataListTitleUpdate,
  projectDataJoinLinkUpdate,
  projectDataUsersUpdate,
  projectDataPermissionsUpdate,
  projectDataTaskArchived,
  projectDataUpdateLabels,
  projectDataFail,
  projectDataReset,
} = projectGetDataSlice.actions;

export const projectGetDataReducer = projectGetDataSlice.reducer;

// ── 4. projectTaskMove slice ────────────────────────────────────────

const projectTaskMoveInitialState: ProjectTaskMoveState = {
  removed: null,
  added: null,
};

const projectTaskMoveSlice = createSlice({
  name: 'projectTaskMove',
  initialState: projectTaskMoveInitialState,
  reducers: {
    projectTaskMove(
      state,
      action: PayloadAction<{
        removed?: TaskMovePosition;
        added?: TaskMovePosition;
      }>
    ) {
      const { removed, added } = action.payload;
      if (removed && added) return { removed, added };
      else if (removed) return { ...state, removed };
      else if (added) return { ...state, added };
      return state;
    },
    projectTaskMoveReset() {
      return { removed: null, added: null };
    },
  },
});

export const { projectTaskMove, projectTaskMoveReset } =
  projectTaskMoveSlice.actions;

export const projectTaskMoveReducer = projectTaskMoveSlice.reducer;

// ── 5. projectFindUsers slice ───────────────────────────────────────

const projectFindUsersInitialState: ProjectFindUsersState = { users: [] };

const projectFindUsersSlice = createSlice({
  name: 'projectFindUsers',
  initialState: projectFindUsersInitialState,
  reducers: {
    projectFindUsersRequest() {
      return { loading: true, users: [] };
    },
    projectFindUsersSuccess(
      _state,
      action: PayloadAction<UserSummary[]>
    ) {
      return { loading: false, users: action.payload };
    },
    projectFindUsersFail(_state, action: PayloadAction<string>) {
      return { loading: false, error: action.payload, users: [] };
    },
  },
});

export const {
  projectFindUsersRequest,
  projectFindUsersSuccess,
  projectFindUsersFail,
} = projectFindUsersSlice.actions;

export const projectFindUsersReducer = projectFindUsersSlice.reducer;

// ── 6. projectSetTask slice ─────────────────────────────────────────

const projectSetTaskInitialState: ProjectSetTaskState = {};

const projectSetTaskSlice = createSlice({
  name: 'projectSetTask',
  initialState: projectSetTaskInitialState,
  reducers: {
    projectSetTaskRequest() {
      return { loading: true };
    },
    projectSetTaskSuccess(_state, action: PayloadAction<Task>) {
      return { loading: false, task: action.payload };
    },
    projectSetTaskFail(_state, action: PayloadAction<string>) {
      return { loading: false, error: action.payload };
    },
    projectSetTaskReset() {
      return {};
    },
  },
});

export const {
  projectSetTaskRequest,
  projectSetTaskSuccess,
  projectSetTaskFail,
  projectSetTaskReset,
} = projectSetTaskSlice.actions;

export const projectSetTaskReducer = projectSetTaskSlice.reducer;

// ── 7. projectToDoVisibility slice ──────────────────────────────────

const projectToDoVisibilityInitialState: ProjectToDoVisibilityState = {
  listIds: [],
};

const projectToDoVisibilitySlice = createSlice({
  name: 'projectToDoVisibility',
  initialState: projectToDoVisibilityInitialState,
  reducers: {
    projectToDoVisibilityUpdate(
      _state,
      action: PayloadAction<string[]>
    ) {
      return { listIds: action.payload };
    },
  },
});

export const { projectToDoVisibilityUpdate } =
  projectToDoVisibilitySlice.actions;

export const projectToDoVisibilityReducer = projectToDoVisibilitySlice.reducer;

// ── 8. projectMessages slice ────────────────────────────────────────

const projectMessagesInitialState: ProjectMessagesState = { messages: [] };

const projectMessagesSlice = createSlice({
  name: 'projectMessages',
  initialState: projectMessagesInitialState,
  reducers: {
    projectSetMessages(_state, action: PayloadAction<Message[]>) {
      return { messages: action.payload };
    },
    projectUpdateMessages(state, action: PayloadAction<Message>) {
      return { ...state, messages: [...state.messages, action.payload] };
    },
    projectSetNewMessage(state) {
      return { ...state, newMessage: true };
    },
    projectResetNewMessage(state) {
      return { ...state, newMessage: false };
    },
  },
});

export const {
  projectSetMessages,
  projectUpdateMessages,
  projectSetNewMessage,
  projectResetNewMessage,
} = projectMessagesSlice.actions;

export const projectMessagesReducer = projectMessagesSlice.reducer;
