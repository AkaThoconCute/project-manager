# Frontend Quickmap — Where Things Are & Where They Go

> Quick-reference for understanding the `frontend/src/` codebase at overview level and mapping it to `kanban-board-fe/src/`.
> For details, always read the original file.

Overview is here:

1. Entry Points & App Shell
2. Pages (`src/components/pages/`)
3. Shared / Top-Level Components (`src/components/`)
4. Shared / Top-Level Components (`src/components/`)
5. Layout (`src/components/layout/`)
6. Board & Lists (`src/components/dashboard/`)
7. Boards Grid (`src/components/boards/`)
8. Dashboard Navbar (`src/components/dashboard/navbar/`)
9. Shared Dashboard Components (`src/components/dashboard/shared/`)
10. Task Modal (`src/components/dashboard/taskModal/`)
11. Redux Store (`src/redux/`)
12. API Endpoints (from actions)
13. Socket Events (from actions + Board.js + Users.js)
14. Utilities (`src/util/`)
15. Static Assets (`src/images/`)
16. External Package Usage Hotspots
17. New Structure Additions (kanban-board-fe only)
18. File Count Summary

Details is below

---

## 1. Entry Points & App Shell

| Original File   | Lines | New File        | Notes                                                                                                                                                                                                                                                                                  |
| --------------- | ----- | --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/index.js`  | 15    | `src/main.tsx`  | `ReactDOM.render` → `createRoot`; `Provider` stays; add `HelmetProvider` wrapper                                                                                                                                                                                                       |
| `src/App.js`    | 148   | `src/App.tsx`   | Router v5→v7 (`Switch`→`Routes`, `Redirect`→`Navigate`, `Route component`→`Route element`); `MuiThemeProvider`→`ThemeProvider` from @mui; Socket listeners for `notifications-updated`, `user-updated`, `auth-error`, `user-removed-from-project`; `PrivateRoute` pattern to replicate |
| `src/index.css` | 33    | `src/index.css` | Keep as-is; `.active-project-link`, custom scrollbar styles                                                                                                                                                                                                                            |

### App Routes (defined in App.js)

| Path                         | Page Component  | Auth        | Particles |
| ---------------------------- | --------------- | ----------- | --------- |
| `/`                          | Home            | public      | yes       |
| `/signin`                    | Login           | public      | yes       |
| `/register`                  | Register        | public      | yes       |
| `/confirm/:id`               | Confirm         | public      | yes       |
| `/boards`                    | Boards          | **private** | yes       |
| `/project/:id/:taskId?`      | Project         | **private** | no        |
| `/invite/:projectId/:joinId` | ProjectJoinPage | **private** | no        |
| `*`                          | NotFoundPage    | public      | yes       |

---

## 2. Pages (`src/components/pages/`)

| Original File              | Lines | New File                    | Key Dependencies                                                                                      | Redux State Used                                                                                              |
| -------------------------- | ----- | --------------------------- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `pages/Home.js`            | 89    | `pages/Home.tsx`            | makeStyles, Button, Link                                                                              | `userLogin.userInfo`                                                                                          |
| `pages/Login.js`           | 160   | `pages/Login.tsx`           | makeStyles, TextField, Button, useHistory→useNavigate                                                 | `userLogin` (loading/error/userInfo); dispatches `login`                                                      |
| `pages/Register.js`        | 194   | `pages/Register.tsx`        | makeStyles, TextField, Button, Visibility icons, useHistory→useNavigate                               | `userRegister`, `userLogin.userInfo`; dispatches `register`                                                   |
| `pages/Confirm.js`         | 101   | `pages/Confirm.tsx`         | makeStyles, Button, useParams                                                                         | `userEmailConfirm`, `userEmailResend`, `userLogin.userInfo`; dispatches `confirmEmail`, `resendEmail`         |
| `pages/Boards.js`          | 57    | `pages/Boards.tsx`          | Container, Grid, makeStyles                                                                           | `userLogin.userInfo` (projectsJoined, projectsCreated, projectsThemes)                                        |
| `pages/Project.js`         | 158   | `pages/Project.tsx`         | createMuiTheme→createTheme, MuiThemeProvider→ThemeProvider, useHistory→useNavigate, Redirect→Navigate | `projectGetData`, `userLogin`, `socketConnection`; dispatches `getProjectData`, `PROJECT_SET_CURRENT`, resets |
| `pages/NotFoundPage.js`    | 34    | `pages/NotFoundPage.tsx`    | makeStyles, Button, Link                                                                              | none                                                                                                          |
| `pages/ProjectJoinPage.js` | 35    | `pages/ProjectJoinPage.tsx` | useHistory→useNavigate, useParams                                                                     | `socketConnection.socket`, `userLogin.userInfo`; socket emits `project-join`                                  |

---

## 3. Shared / Top-Level Components (`src/components/`)

| Original File            | Lines | New File                  | Key Dependencies                                            | Notes                                                             |
| ------------------------ | ----- | ------------------------- | ----------------------------------------------------------- | ----------------------------------------------------------------- |
| `AuthFormPanel.js`       | 77    | `AuthFormPanel.tsx`       | makeStyles, Typography, Link, PolygonBackground.jpg         | Props: `login` boolean; conditional panel for auth forms          |
| `Helmet.js`              | 7     | `Helmet.tsx`              | react-helmet → react-helmet-async                           | Wrap app in `<HelmetProvider>`                                    |
| `Loader.js`              | 31    | `Loader.tsx`              | CircularProgress                                            | Props: `button`, `contained`; 3 sizes                             |
| `ParticlesBackground.js` | 70    | `ParticlesBackground.tsx` | react-particles-js → @tsparticles/react + @tsparticles/slim | Complete API change; Props: `disableMove`; 200 particles, dark bg |

---

## 4. Layout (`src/components/layout/`)

| Original File           | Lines | New File                 | Key Dependencies                          | Notes                                                                                                             |
| ----------------------- | ----- | ------------------------ | ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `layout/Layout.js`      | 13    | `layout/Layout.tsx`      | VerticalNav                               | Simple flex wrapper: sidebar + main content                                                                       |
| `layout/VerticalNav.js` | 119   | `layout/VerticalNav.tsx` | makeStyles, ArrowForwardIosIcon, NavLinks | Responsive sidebar; state: `navExpanded`, `prepareToHide`, `mobile`; breakpoint 768px; Redux: `userLogin.loading` |

### Nav Components (`layout/navComponents/`)

| Original File        | Lines | New File              | Props                                                      | Notes                                                                                                                                                               |
| -------------------- | ----- | --------------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NavItem.js`         | 57    | `NavItem.tsx`         | `link`, `title`, `action`, `Icon`, `navExpanded`, `mobile` | Reusable nav link/button with tooltip                                                                                                                               |
| `NavLinks.js`        | 79    | `NavLinks.tsx`        | `navExpanded`, `mobile`, `closeNav`                        | Conditional auth/unauth nav; Redux: `userLogin`; dispatches `logout`; opens `NewProjectModal`                                                                       |
| `NewProjectModal.js` | 119   | `NewProjectModal.tsx` | `open`, `handleClose`                                      | Dialog with title input; Redux: `projectCreate`; dispatches `createProject`; uses `useHistory`→`useNavigate`; Alert from @material-ui/lab→@mui/lab or @mui/material |
| `ProjectItems.js`    | 37    | `ProjectItems.tsx`    | `navExpanded`, `mobile`                                    | Renders Chat, ArchivedTasks, Settings, Users, InviteUsers when project loaded; Redux: `projectGetData`                                                              |
| `UserNav.js`         | 47    | `UserNav.tsx`         | `navExpanded`, `mobile`                                    | Avatar + username, Notifications, opens UserModal; Redux: `userLogin.userInfo`                                                                                      |
| `UserModal.js`       | 135   | `UserModal.tsx`       | `open`, `closeHandle`, `user`                              | Profile picture upload modal; Redux: `userPictureUpdate`; dispatches `updateProfilePicture`; file validation (jpg/jpeg/png/gif)                                     |

### Project Select (`layout/navComponents/projectSelect/`)

| Original File             | Lines | New File                   | Notes                                                                                |
| ------------------------- | ----- | -------------------------- | ------------------------------------------------------------------------------------ |
| `ProjectSelect.js`        | 22    | `ProjectSelect.tsx`        | Wrapper with `anchorEl` state for Select + Menu                                      |
| `menu/Select.js`          | —     | `menu/Select.tsx`          | Trigger button for project dropdown                                                  |
| `menu/Menu.js`            | 105   | `menu/Menu.tsx`            | Popper + ClickAwayListener; lists Owned/Joined projects; Redux: `userLogin`          |
| `menu/ProjectMenuItem.js` | 33    | `menu/ProjectMenuItem.tsx` | NavLink to `/project/:id` with activeClassName → use NavLink className function (v7) |

### Notifications (`layout/navComponents/notifications/`)

| Original File              | Lines | New File                   | Notes                                                                       |
| -------------------------- | ----- | -------------------------- | --------------------------------------------------------------------------- |
| `NotificationConstants.js` | —     | `NotificationConstants.ts` | Notification type constants                                                 |
| `Notifications.js`         | —     | `Notifications.tsx`        | Badge with notification count; Redux: `userLogin.notifications`             |
| `NotificationsMenu.js`     | —     | `NotificationsMenu.tsx`    | Popper menu with notification list; dispatches `markNotificationsSeen`      |
| `NotificationItem.js`      | —     | `NotificationItem.tsx`     | Single notification with Link and discard; dispatches `discardNotification` |

---

## 5. Board & Lists (`src/components/dashboard/`)

| Original File | Lines | New File    | Key Dependencies | Notes                                                                                                                                                                                                                                                                                                                       |
| ------------- | ----- | ----------- | ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Board.js`    | 129   | `Board.tsx` | Navbar, Lists    | **13 socket listeners**: `new-task`, `lists-update`, `list-added`, `list-title-updated`, `project-title-updated`, `project-join-link-updated`, `project-users-updated`, `task-archived`, `task-updated`, `tasks-updated`, `labels-updated`, `task-deleted`, `new-message`; dispatches corresponding PROJECT*DATA*\* actions |

### Lists (`dashboard/lists/`)

| Original File              | Lines | New File                   | Key Dependencies                                                                                                                  | Notes                                                                                                  |
| -------------------------- | ----- | -------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `lists/Lists.js`           | 57    | `lists/Lists.tsx`          | **react-smooth-dnd Container** → @hello-pangea/dnd DragDropContext+Droppable                                                      | Horizontal list container; dispatches `projectListMove`; AddInput for new lists                        |
| `lists/ListItem.js`        | 105   | `lists/ListItem.tsx`       | **react-smooth-dnd Container+Draggable** → @hello-pangea/dnd Droppable+Draggable; **fast-deep-equal** → native or structuredClone | Memo'd component; task reorder via `projectTaskMove`; contains TitleUpdate, ListMore, Task, AddInput   |
| `lists/TitleUpdate.js`     | 108   | `lists/TitleUpdate.tsx`    | InputBase, Loader                                                                                                                 | Inline editable title; socket emits `list-title-update`; also used for task title                      |
| `lists/draggingStyles.css` | 13    | `lists/draggingStyles.css` | —                                                                                                                                 | `.list-drag-ghost`, `.smooth-dnd-ghost`, `.drop-preview` — must remap to @hello-pangea/dnd equivalents |

### Tasks (`dashboard/lists/tasks/`)

| Original File                                | Lines | New File                                      | Notes                                                                                                                                                                                                        |
| -------------------------------------------- | ----- | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `tasks/Task.js`                              | 121   | `tasks/Task.tsx`                              | **react-smooth-dnd Draggable** → @hello-pangea/dnd Draggable; Link to `/project/:id/:taskId`; displays labels, title, description icon, deadline icon, task progress, users; dispatches `projectTaskArchive` |
| `tasks/taskComponents/TaskDeadlineIcon.js`   | 50    | `tasks/taskComponents/TaskDeadlineIcon.tsx`   | Uses **moment** — consider date-fns/dayjs; deadline proximity color                                                                                                                                          |
| `tasks/taskComponents/TaskTasksCompleted.js` | 23    | `tasks/taskComponents/TaskTasksCompleted.tsx` | Pure presentational; completed/total display                                                                                                                                                                 |
| `tasks/taskComponents/TaskUsers.js`          | 36    | `tasks/taskComponents/TaskUsers.tsx`          | AvatarGroup from **@material-ui/lab** → @mui/material; Redux: `userLogin.userInfo`                                                                                                                           |

### List More Menu (`dashboard/lists/listMore/`)

| Original File               | Lines | New File                     | Notes                                                                                                                                |
| --------------------------- | ----- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `listMore/ListMore.js`      | 27    | `listMore/ListMore.tsx`      | MoreVertIcon trigger for ListMenu                                                                                                    |
| `listMore/ListMenu.js`      | 115   | `listMore/ListMenu.tsx`      | Menu with: Transfer tasks, Archive tasks, Delete list; dispatches `projectListDelete`, `projectTasksArchive`, `projectTasksTransfer` |
| `listMore/TransferTasks.js` | 58    | `listMore/TransferTasks.tsx` | Reusable list picker for transfer; Redux: `projectGetData.lists`                                                                     |

---

## 6. Boards Grid (`src/components/boards/`)

| Original File               | Lines | New File                     | Notes                                                                                                                   |
| --------------------------- | ----- | ---------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `boards/BoardItem.js`       | 78    | `boards/BoardItem.tsx`       | Grid item with Link to `/project/:id`; background image lazy-loaded; Skeleton from **@material-ui/lab** → @mui/material |
| `boards/LazyImage.js`       | —     | `boards/LazyImage.tsx`       | Lazy image loader for board backgrounds                                                                                 |
| `boards/NewProjectBoard.js` | —     | `boards/NewProjectBoard.tsx` | "+ New" board card; opens NewProjectModal or inline creation                                                            |

---

## 7. Dashboard Navbar (`src/components/dashboard/navbar/`)

| Original File        | Lines | New File              | Notes                                                                                                                      |
| -------------------- | ----- | --------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `navbar/Navbar.js`   | 62    | `navbar/Navbar.tsx`   | Fixed navbar header with DeveloperBoardIcon + NavTitle                                                                     |
| `navbar/NavTitle.js` | 102   | `navbar/NavTitle.tsx` | Editable project title using **react-input-autosize** → native autosize or equivalent; socket emits `project-title-update` |

### Archived Tasks (`navbar/archivedTasks/`)

| Original File        | Lines | New File              | Notes                                                                                  |
| -------------------- | ----- | --------------------- | -------------------------------------------------------------------------------------- |
| `ArchivedTasks.js`   | 35    | `ArchivedTasks.tsx`   | RestoreFromTrashIcon trigger; opens ArchivedMenu Popover                               |
| `ArchivedMenu.js`    | 124   | `ArchivedMenu.tsx`    | Popover with archived task list; dispatches `projectTaskDelete`, `projectTaskTransfer` |
| `ArchivedActions.js` | 40    | `ArchivedActions.tsx` | "Transfer to list" / "Delete" links per archived task                                  |
| `TransferMenu.js`    | 54    | `TransferMenu.tsx`    | Menu with list targets for transfer                                                    |

### Group Chat (`navbar/groupChat/`)

| Original File      | Lines | New File            | Notes                                                                                                     |
| ------------------ | ----- | ------------------- | --------------------------------------------------------------------------------------------------------- |
| `Chat.js`          | 60    | `Chat.tsx`          | ChatIcon with Badge for unread; toggles ChatContainer; Redux: `projectMessages.newMessage`                |
| `ChatContainer.js` | 121   | `ChatContainer.tsx` | Paper container with Messages + input; dispatches `sendMessage`; responsive Modal for mobile              |
| `Messages.js`      | 142   | `Messages.tsx`      | Scrollable message list with Avatars; uses **moment** → dayjs/date-fns; Redux: `projectMessages.messages` |

### Invite Users (`navbar/inviteUsers/`)

| Original File    | Lines | New File          | Notes                                                                                                   |
| ---------------- | ----- | ----------------- | ------------------------------------------------------------------------------------------------------- |
| `InviteUsers.js` | 24    | `InviteUsers.tsx` | PersonAddIcon trigger; opens AddUserMenu                                                                |
| `AddUserMenu.js` | 158   | `AddUserMenu.tsx` | Popover with search, Chips for selected users; dispatches `findUsersToInvite`, `sendProjectInvitations` |
| `SearchMenu.js`  | 106   | `SearchMenu.tsx`  | Popper with Grow transition showing user results; Redux: `projectFindUsers`                             |
| `InviteLink.js`  | 61    | `InviteLink.tsx`  | Toggle join link; socket emits `project-disable-join-link`, `project-create-join-link`                  |

### Settings (`navbar/settings/`)

| Original File                                       | Lines | New File                                             | Notes                                                                                |
| --------------------------------------------------- | ----- | ---------------------------------------------------- | ------------------------------------------------------------------------------------ |
| `Settings.js`                                       | 29    | `Settings.tsx`                                       | SettingsIcon trigger; opens SettingsModal                                            |
| `SettingsModal.js`                                  | 44    | `SettingsModal.tsx`                                  | Dialog with ColorSelect, Background, DeleteProject (if creator)                      |
| `settingsComponents/Header.js`                      | 26    | `settingsComponents/Header.tsx`                      | Reusable icon+title header                                                           |
| `settingsComponents/ColorSelect.js`                 | 77    | `settingsComponents/ColorSelect.tsx`                 | Color grid (THEME_COLORS); dispatches `updateColorTheme`                             |
| `settingsComponents/Background.js`                  | 20    | `settingsComponents/Background.tsx`                  | Wrapper with PaletteIcon + BackgroundSelect                                          |
| `settingsComponents/DeleteProject.js`               | 81    | `settingsComponents/DeleteProject.tsx`               | Confirmation dialog; dispatches `deleteProject`                                      |
| `settingsComponents/background/BackgroundSelect.js` | 194   | `settingsComponents/background/BackgroundSelect.tsx` | Color grid + image upload; dispatches `updateProjectBgColor`, `uploadProjectBgImage` |
| `settingsComponents/background/ImageUpload.js`      | 56    | `settingsComponents/background/ImageUpload.tsx`      | Fab + file input; uses **uuid** → uuid v13                                           |

### Users (`navbar/users/`)

| Original File                                 | Lines | New File                                       | Notes                                                                                                            |
| --------------------------------------------- | ----- | ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `Users.js`                                    | 77    | `Users.tsx`                                    | Socket listeners: `user-permissions-changed`, `user-removed`, `project-deleted`; uses `useHistory`→`useNavigate` |
| `UsersGroup.js`                               | 59    | `UsersGroup.tsx`                               | Avatar row with overflow badge; opens GroupMenu                                                                  |
| `UserItem.js`                                 | 94    | `UserItem.tsx`                                 | Avatar with permission indicators                                                                                |
| `userMenus/UserMenu.js`                       | 44    | `userMenus/UserMenu.tsx`                       | AdminInnerMenu or NormalInnerMenu based on permissions                                                           |
| `userMenus/GroupMenu.js`                      | 99    | `userMenus/GroupMenu.tsx`                      | Full user list; 3 groups: admins, users, invited                                                                 |
| `userMenus/innerMenus/AdminInnerMenu.js`      | 189   | `userMenus/innerMenus/AdminInnerMenu.tsx`      | Withdraw/remove user, change permissions; dispatches `removeUserFromProject`, `updateUserPermissions`            |
| `userMenus/innerMenus/NormalInnerMenu.js`     | 106   | `userMenus/innerMenus/NormalInnerMenu.tsx`     | Leave project or view permissions; dispatches `removeUserFromProject`                                            |
| `userMenus/innerMenus/UsersGroupInnerMenu.js` | 83    | `userMenus/innerMenus/UsersGroupInnerMenu.tsx` | 3-section list: Administrators, Users, Invited                                                                   |

---

## 8. Shared Dashboard Components (`src/components/dashboard/shared/`)

| Original File          | Lines | New File                | Notes                                                                                        |
| ---------------------- | ----- | ----------------------- | -------------------------------------------------------------------------------------------- |
| `shared/AddInput.js`   | 163   | `shared/AddInput.tsx`   | Expandable input; socket emits `add-task` or `add-list`; uses **react-scroll** animateScroll |
| `shared/DeleteMenu.js` | 58    | `shared/DeleteMenu.tsx` | Confirmation Menu/popover; reusable                                                          |
| `shared/LabelItem.js`  | 46    | `shared/LabelItem.tsx`  | Color badge/pill with label title; props: `label`, `small`                                   |
| `shared/MenuHeader.js` | 46    | `shared/MenuHeader.tsx` | Back arrow / title / close icon row; reusable                                                |

---

## 9. Task Modal (`src/components/dashboard/taskModal/`)

| Original File       | Lines | New File             | Notes                                                                                                       |
| ------------------- | ----- | -------------------- | ----------------------------------------------------------------------------------------------------------- |
| `TaskModal.js`      | ~102  | `TaskModal.tsx`      | Modal wrapper; dispatches `setTask`, `PROJECT_SET_TASK_RESET`; uses `useHistory`→`useNavigate`, `useParams` |
| `ModalContainer.js` | ~77   | `ModalContainer.tsx` | Layout: header, description, side panel, deadline, users, labels, to-do lists, comments                     |

### Modal Components (`taskModal/modalComponents/`)

| Original File              | Lines | New File                    | Notes                                                                                                                           |
| -------------------------- | ----- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `TaskHeader.js`            | ~68   | `TaskHeader.tsx`            | LabelImportantIcon + TitleUpdate + creation date (**moment** → dayjs)                                                           |
| `TaskDescription.js`       | ~130  | `TaskDescription.tsx`       | **CKEditor5 Classic** → ckeditor5 v48; rich text editor with save/cancel                                                        |
| `Labels.js`                | ~38   | `Labels.tsx`                | Label badges from Redux `projectGetData.labels`                                                                                 |
| `Deadline.js`              | ~91   | `Deadline.tsx`              | **@material-ui/pickers DatePicker** → @mui/x-date-pickers DatePicker + AdapterDayjs; dispatches `taskFieldUpdate`               |
| `SideContent.js`           | ~105  | `SideContent.tsx`           | Side panel: Users, Label, ToDoList, Deadline, Copy, Watch, Transfer, Archive; uses **fast-deep-equal** → structuredClone/native |
| `ArchivedHeader.js`        | ~24   | `ArchivedHeader.tsx`        | Blue banner "This task is archived"                                                                                             |
| `users/Users.js`           | ~54   | `users/Users.tsx`           | AvatarGroup (max 6) with AddUsersMenu; @material-ui/lab→@mui/material                                                           |
| `comments/Comments.js`     | ~88   | `comments/Comments.tsx`     | Comment list with add/edit/delete; dispatches `addComment`, `deleteComment`, `editComment`                                      |
| `comments/CommentItem.js`  | ~92   | `comments/CommentItem.tsx`  | Single comment with avatar, **moment** → dayjs; edit/delete links                                                               |
| `comments/CommentInput.js` | ~97   | `comments/CommentInput.tsx` | TextField multiline with keyboard handlers                                                                                      |

### To-Do Lists (`taskModal/modalComponents/toDoLists/`)

| Original File        | Lines | New File              | Notes                                                                       |
| -------------------- | ----- | --------------------- | --------------------------------------------------------------------------- |
| `ToDoList.js`        | ~131  | `ToDoList.tsx`        | Main to-do list; dispatches 7 to-do actions; Redux: `projectToDoVisibility` |
| `ToDoItem.js`        | ~75   | `ToDoItem.tsx`        | Checkbox + inline edit + delete                                             |
| `ToDoInput.js`       | ~122  | `ToDoInput.tsx`       | InputBase multiline; add/update task title                                  |
| `ToDoMenu.js`        | ~71   | `ToDoMenu.tsx`        | Show/Hide finished, Delete list                                             |
| `ToDoTitleUpdate.js` | ~75   | `ToDoTitleUpdate.tsx` | Inline editable to-do list title                                            |
| `TasksProgress.js`   | ~44   | `TasksProgress.tsx`   | Progress bar with percentage                                                |

### Side Components (`taskModal/modalComponents/sideComponents/`)

| Original File   | Lines | New File         | Notes                                                                          |
| --------------- | ----- | ---------------- | ------------------------------------------------------------------------------ |
| `SideButton.js` | ~60   | `SideButton.tsx` | Reusable button with icon; gray/orange variant                                 |
| `Archive.js`    | ~51   | `Archive.tsx`    | SideButton + DeleteMenu; dispatches `projectTaskArchive`, `projectTaskDelete`  |
| `Copy.js`       | ~58   | `Copy.tsx`       | SideButton + TransferTasks picker; dispatches `copyTask`                       |
| `Deadline.js`   | ~43   | `Deadline.tsx`   | SideButton + hidden DatePicker; **@material-ui/pickers** → @mui/x-date-pickers |
| `Transfer.js`   | ~78   | `Transfer.tsx`   | SideButton + TransferTasks; dispatches `projectTaskTransfer`                   |
| `Watch.js`      | ~34   | `Watch.tsx`      | SideButton + VisibilityIcon; dispatches `updateTaskWatch`                      |

### Labels (`sideComponents/labels/`)

| Original File    | Lines | New File          | Notes                                                                                                              |
| ---------------- | ----- | ----------------- | ------------------------------------------------------------------------------------------------------------------ |
| `LabelMenu.js`   | ~155  | `LabelMenu.tsx`   | Label CRUD menu; socket emits `create-label`; dispatches `createLabel`, `deleteLabel`, `editLabel`, `updateLabels` |
| `LabelItem.js`   | ~63   | `LabelItem.tsx`   | Selectable label with color                                                                                        |
| `Label.js`       | ~23   | `Label.tsx`       | SideButton wrapper for LabelMenu                                                                                   |
| `CreateLabel.js` | ~79   | `CreateLabel.tsx` | Title + color picker + save/delete                                                                                 |

### Side To-Do (`sideComponents/toDoList/`)

| Original File | Lines | New File       | Notes                                                 |
| ------------- | ----- | -------------- | ----------------------------------------------------- |
| `ToDoList.js` | ~23   | `ToDoList.tsx` | SideButton wrapper for ToDoMenu                       |
| `ToDoMenu.js` | ~70   | `ToDoMenu.tsx` | Popover with title input; dispatches `createToDoList` |

### Side Users (`sideComponents/users/`)

| Original File     | Lines | New File           | Notes                                                                                  |
| ----------------- | ----- | ------------------ | -------------------------------------------------------------------------------------- |
| `Users.js`        | ~24   | `Users.tsx`        | SideButton wrapper for AddUsersMenu                                                    |
| `UserItem.js`     | ~56   | `UserItem.tsx`     | Avatar + username + selected check                                                     |
| `AddUsersMenu.js` | ~158  | `AddUsersMenu.tsx` | User selection menu; uses **deepcopy** → structuredClone; dispatches `taskUsersUpdate` |

---

## 10. Redux Store (`src/redux/`)

### Store Shape (store.js → store.ts)

```
{
  userLogin:            { loading, userInfo, notifications, error }
  userRegister:         { loading, success, error }
  userEmailConfirm:     { loading, success, error }
  userEmailResend:      { loading, success, error }
  userPictureUpdate:    { loading, success, error }
  userProjectBgUpdate:  { loading, success, error }
  projectCreate:        { loading, project, error }
  projectSetCurrent:    { project }
  projectGetData:       { loading, project, lists, labels, error }
  projectTaskMove:      { added, removed }
  projectFindUsers:     { loading, users, error }
  projectSetTask:       { loading, task, error }
  projectToDoVisibility:{ listIds }
  projectMessages:      { messages, newMessage }
  socketConnection:     { socket }
}
```

**Migration**: `redux` + `redux-thunk` + `combineReducers` → `@reduxjs/toolkit` (`configureStore` + `createSlice` + `createAsyncThunk`). Constants + actions + reducers collapse into slices.

### Constants → Slice mapping

| Old Files                                                                                                                           | New File                                             |
| ----------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| `constants/userConstants.js` (26 types) + `reducers/userReducers.js` (6 reducers) + `actions/userActions.js` (13 actions)           | `slices/userSlice.ts` + `thunks/userThunks.ts`       |
| `constants/projectConstants.js` (39 types) + `reducers/projectReducers.js` (8 reducers) + `actions/projectActions.js` (36+ actions) | `slices/projectSlice.ts` + `thunks/projectThunks.ts` |
| `constants/socketConstants.js` (2 types) + `reducers/socketReducers.js` (1 reducer)                                                 | `slices/socketSlice.ts`                              |

### localStorage Persistence

- `userInfo` (token only) — read on store init
- `toDoListIds` — read on store init, written by `updateToDoListVisibility`

---

## 11. API Endpoints (from actions)

### User API (userActions.js)

| Method | Endpoint                                        | Action                    | Auth                     |
| ------ | ----------------------------------------------- | ------------------------- | ------------------------ |
| POST   | `/api/users/login`                              | `login`                   | no                       |
| POST   | `/api/users/register`                           | `register`                | no                       |
| POST   | `/api/users/confirm`                            | `confirmEmail`            | no                       |
| POST   | `/api/users/resend`                             | `resendEmail`             | no                       |
| GET    | `/api/users`                                    | `getUserData`             | Bearer token             |
| GET    | `/api/users/notifications`                      | `getUpdatedNotifications` | Bearer token             |
| DELETE | `/api/users/:notificationId`                    | `discardNotification`     | Bearer token             |
| PUT    | `/api/users/markNotifications`                  | `markNotificationsSeen`   | Bearer token             |
| POST   | `/api/images/upload`                            | `updateProfilePicture`    | Bearer token + multipart |
| PUT    | `/api/users/projectColorTheme`                  | `updateColorTheme`        | Bearer token             |
| POST   | `/api/images/upload/projectBgUpload/:projectId` | `uploadProjectBgImage`    | Bearer token + multipart |
| PUT    | `/api/users/projectBgColorTheme`                | `updateProjectBgColor`    | Bearer token             |

### Project API (projectActions.js)

| Method | Endpoint                                   | Action              | Auth         |
| ------ | ------------------------------------------ | ------------------- | ------------ |
| POST   | `/api/projects/`                           | `createProject`     | Bearer token |
| GET    | `/api/projects/:projectId`                 | `getProjectData`    | Bearer token |
| GET    | `/api/projects/getTask/:projectId/:taskId` | `setTask`           | Bearer token |
| POST   | `/api/users/find/:projectId`               | `findUsersToInvite` | Bearer token |

---

## 12. Socket Events (from actions + Board.js + Users.js)

### Client Emits

| Event                             | Source                           |
| --------------------------------- | -------------------------------- |
| `join-notifications`              | login/getUserData                |
| `join-board`                      | getProjectData                   |
| `disconnect-board`                | getProjectData / Project cleanup |
| `task-move`                       | projectTaskMove                  |
| `list-move`                       | projectListMove                  |
| `task-archive`                    | projectTaskArchive               |
| `tasks-archive`                   | projectTasksArchive              |
| `list-delete`                     | projectListDelete                |
| `task-delete`                     | projectTaskDelete                |
| `task-transfer`                   | projectTaskTransfer              |
| `tasks-transfer`                  | projectTasksTransfer             |
| `project-invite-users`            | sendProjectInvitations           |
| `project-user-permissions-update` | updateUserPermissions            |
| `project-user-remove`             | removeUserFromProject            |
| `task-field-update`               | taskFieldUpdate / updateLabels   |
| `task-users-update`               | taskUsersUpdate                  |
| `create-label`                    | LabelMenu.js                     |
| `label-delete`                    | deleteLabel                      |
| `label-edit`                      | editLabel                        |
| `add-to-do-list`                  | createToDoList                   |
| `update-to-do-list-title`         | updateToDoListTitle              |
| `delete-to-do-list`               | deleteToDoList                   |
| `add-to-do-task`                  | addToDoTask                      |
| `update-to-do-task-progress`      | updateToDoTaskProgress           |
| `update-to-do-task-title`         | updateToDoTaskTitle              |
| `delete-to-do-task`               | deleteToDoTask                   |
| `add-comment`                     | addComment                       |
| `edit-comment`                    | editComment                      |
| `delete-comment`                  | deleteComment                    |
| `copy-task`                       | copyTask                         |
| `task-watch`                      | updateTaskWatch                  |
| `send-message`                    | sendMessage                      |
| `delete-project`                  | deleteProject                    |
| `project-join`                    | ProjectJoinPage                  |
| `list-title-update`               | TitleUpdate                      |
| `project-title-update`            | NavTitle                         |
| `project-disable-join-link`       | InviteLink                       |
| `project-create-join-link`        | InviteLink                       |
| `add-task`                        | AddInput                         |
| `add-list`                        | AddInput                         |

### Client Listens (App.js)

| Event                       | Handler                          |
| --------------------------- | -------------------------------- |
| `notifications-updated`     | dispatch getUpdatedNotifications |
| `user-updated`              | dispatch USER_DATA_UPDATE        |
| `auth-error`                | dispatch logout                  |
| `user-removed-from-project` | dispatch USER_REMOVED            |

### Client Listens (Board.js)

| Event                       | Handler                                                    |
| --------------------------- | ---------------------------------------------------------- |
| `new-task`                  | dispatch PROJECT_DATA_ADD_TASK                             |
| `lists-update`              | dispatch PROJECT_DATA_UPDATE_LISTS                         |
| `list-added`                | dispatch PROJECT_DATA_ADD_LIST                             |
| `list-title-updated`        | dispatch PROJECT_DATA_LIST_TITLE_UPDATE                    |
| `project-title-updated`     | dispatch PROJECT_DATA_TITLE_UPDATE                         |
| `project-join-link-updated` | dispatch PROJECT_DATA_JOIN_LINK_UPDATE                     |
| `project-users-updated`     | dispatch PROJECT_DATA_USERS_UPDATE                         |
| `task-archived`             | dispatch PROJECT_DATA_TASK_ARCHIVED                        |
| `task-updated`              | dispatch PROJECT_SET_TASK_SUCCESS                          |
| `tasks-updated`             | dispatch PROJECT_DATA_UPDATE_LISTS                         |
| `labels-updated`            | dispatch PROJECT_DATA_UPDATE_LABELS                        |
| `task-deleted`              | handles delete + updates lists                             |
| `new-message`               | dispatch PROJECT_UPDATE_MESSAGES + PROJECT_SET_NEW_MESSAGE |

### Client Listens (Users.js)

| Event                      | Handler                                  |
| -------------------------- | ---------------------------------------- |
| `user-permissions-changed` | dispatch PROJECT_DATA_PERMISSIONS_UPDATE |
| `user-removed`             | redirect to /boards                      |
| `project-deleted`          | redirect to /boards                      |

---

## 13. Utilities (`src/util/`)

| Original File            | Lines | New File                  | Notes                                                                        |
| ------------------------ | ----- | ------------------------- | ---------------------------------------------------------------------------- |
| `util/theme.js`          | ~14   | `util/theme.ts`           | Theme config: primary `#00bcd4`, secondary `#ff3d00`                         |
| `util/colorsContants.js` | ~18   | `util/colorsConstants.ts` | `LABEL_COLORS` (9), `THEME_COLORS` (8), `BACKGROUND_COLORS` (5 gradients)    |
| `util/utilFunctions.js`  | ~28   | `util/utilFunctions.ts`   | `getTaskIndexes()` — finds task position in lists by ID with fallback search |

---

## 14. Static Assets (`src/images/`)

| File                           | New Location                   | Notes                   |
| ------------------------------ | ------------------------------ | ----------------------- |
| `images/PolygonBackground.jpg` | `images/PolygonBackground.jpg` | Used by AuthFormPanel   |
| `images/ProjectSvg.svg`        | `images/ProjectSvg.svg`        | Used by NewProjectModal |

---

## 15. External Package Usage Hotspots

These components have the most complex package migrations:

| Component                                                                       | Packages to Migrate                                                               |
| ------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| `Lists.js` + `ListItem.js` + `Task.js`                                          | **react-smooth-dnd** → @hello-pangea/dnd (complete rewrite of drag logic)         |
| `ParticlesBackground.js`                                                        | **react-particles-js** → @tsparticles/react + @tsparticles/slim                   |
| `TaskDescription.js`                                                            | **@ckeditor/ckeditor5-build-classic** → ckeditor5 v48                             |
| `Deadline.js` (modal) + `Deadline.js` (side)                                    | **@material-ui/pickers + @date-io/date-fns** → @mui/x-date-pickers + AdapterDayjs |
| `NavTitle.js`                                                                   | **react-input-autosize** → native autosize or equivalent                          |
| `TaskDeadlineIcon.js`, `Messages.js`, `CommentItem.js`, `TaskHeader.js`         | **moment** → dayjs or date-fns v4                                                 |
| `ListItem.js`, `SideContent.js`                                                 | **fast-deep-equal** → native comparison                                           |
| `AddUsersMenu.js`, `projectActions.js`, `projectReducers.js`, `userReducers.js` | **deepcopy** → structuredClone                                                    |
| `AddInput.js`                                                                   | **react-scroll** → react-scroll v1.9                                              |
| All makeStyles/withStyles                                                       | **@material-ui/core makeStyles** → @mui/material sx prop or styled()              |
| `TaskUsers.js`, `BoardItem.js`, `Users.js` (modal)                              | **@material-ui/lab** → @mui/material or @mui/lab v7                               |

---

## 16. New Structure Additions (kanban-board-fe only)

| New Path                            | Purpose                                                  |
| ----------------------------------- | -------------------------------------------------------- |
| `src/types/user.ts`                 | User, Notification, UserInfo interfaces                  |
| `src/types/project.ts`              | Project, List, Task, Label, ToDoList, Comment interfaces |
| `src/types/socket.ts`               | Socket event payload types                               |
| `src/config/env.ts`                 | `isBackendEnabled()` helper checking `VITE_BACKEND_MODE` |
| `src/services/apiClient.ts`         | Axios instance with backend mode gate                    |
| `src/mocks/userData.ts`             | Fake user API responses                                  |
| `src/mocks/projectData.ts`          | Fake project API responses                               |
| `src/mocks/taskData.ts`             | Fake task API responses                                  |
| `src/redux/hooks.ts`                | Typed `useAppDispatch`, `useAppSelector`                 |
| `src/redux/slices/userSlice.ts`     | Replaces userConstants + userReducers                    |
| `src/redux/slices/projectSlice.ts`  | Replaces projectConstants + projectReducers              |
| `src/redux/slices/socketSlice.ts`   | Replaces socketConstants + socketReducers                |
| `src/redux/thunks/userThunks.ts`    | Replaces userActions (async thunks)                      |
| `src/redux/thunks/projectThunks.ts` | Replaces projectActions (async thunks)                   |

---

## 17. File Count Summary

| Area              | Original Files                 | Notes                                                                                    |
| ----------------- | ------------------------------ | ---------------------------------------------------------------------------------------- |
| Entry + Config    | 3                              | index.js, App.js, index.css                                                              |
| Pages             | 8                              | Home, Login, Register, Confirm, Boards, Project, NotFoundPage, ProjectJoinPage           |
| Shared Components | 4                              | AuthFormPanel, Helmet, Loader, ParticlesBackground                                       |
| Layout            | 2 + 6 + 4 + 4 = 16             | Layout, VerticalNav + navComponents + projectSelect + notifications                      |
| Boards            | 3                              | BoardItem, LazyImage, NewProjectBoard                                                    |
| Dashboard Core    | 1 + 4 + 3 + 3 = 11             | Board + lists + tasks + listMore                                                         |
| Dashboard Navbar  | 2 + 4 + 3 + 4 + 8 + 8 = 29     | Navbar/NavTitle + archived + chat + invite + settings + users                            |
| Dashboard Shared  | 4                              | AddInput, DeleteMenu, LabelItem, MenuHeader                                              |
| Task Modal        | 2 + 6 + 6 + 6 + 4 + 2 + 3 = 29 | Modal + modalComponents + toDoLists + sideComponents + labels + sideToDoList + sideUsers |
| Redux             | 1 + 2 + 3 + 3 = 9              | store + actions + constants + reducers                                                   |
| Utilities         | 3                              | theme, colorsConstants, utilFunctions                                                    |
| Images            | 2                              | PolygonBackground.jpg, ProjectSvg.svg                                                    |
| **TOTAL**         | **~104 source files**          | + 2 image assets                                                                         |
