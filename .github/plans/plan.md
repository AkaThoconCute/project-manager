
---

# Migration Plan: frontend → kanban-board-fe

**Source**: React 17 / CRA / JavaScript — ~80 source files  
**Target**: React 19 / Vite 8 / TypeScript — all new packages per migration map  
**Existing target state**: Bare Vite scaffold with all dependencies already in package.json. No application code yet.

---

## Feature 1: Foundation & Project Configuration

### Epic 1.1 — Environment, Entry Point & HTML Shell

> **Story 1.1.1 — Configure Vite environment and `VITE_BACKEND_MODE` toggle**
> **Files**: `kanban-board-fe/.env`, `kanban-board-fe/.env.example`, `kanban-board-fe/src/config/env.ts`
> **Depends on**: nothing
> **Package changes**: CRA `REACT_APP_*` → Vite `VITE_*`
> **Acceptance criteria**:
>
> - [ ] `.env` defines `VITE_BACKEND_MODE=0` (fake) and `VITE_API_URL`
> - [ ] `env.ts` exports typed env constants including `BACKEND_MODE` (`0` | `1`)
> - [ ] `import.meta.env` used everywhere instead of `process.env`
> - [ ] `.env.example` documents all variables

> **Story 1.1.2 — Migrate `index.html` and public assets**
> **Files**: index.html, `kanban-board-fe/public/*`
> **Depends on**: nothing
> **Package changes**: CRA `public/index.html` → Vite root `index.html`
> **Acceptance criteria**:
>
> - [ ] `index.html` matches original meta tags, favicon links, manifest, `browserconfig.xml`
> - [ ] `<div id="root">` present, `<script type="module" src="/src/main.tsx">` entry
> - [ ] Favicon, `robots.txt`, `site.webmanifest` copied to `public/`

> **Story 1.1.3 — Migrate `index.css` global styles**
> **Files**: index.css
> **Depends on**: nothing
> **Package changes**: Tailwind v4 `@import "tailwindcss"` added alongside original global CSS
> **Acceptance criteria**:
>
> - [ ] All original `index.css` rules preserved
> - [ ] Tailwind base layer imported
> - [ ] No visual regression in global resets/fonts

---

### Epic 1.2 — TypeScript Types & Interfaces

> **Story 1.2.1 — Define domain model types**
> **Files**: `kanban-board-fe/src/types/models.ts`
> **Depends on**: nothing (derived from backend models + Redux state shapes)
> **Package changes**: JS → TS
> **Acceptance criteria**:
>
> - [ ] Types defined for: `User`, `Project`, `List`, `Task`, `Label`, `ToDoList`, `ToDoTask`, `Comment`, `Message`, `Notification`
> - [ ] All fields match shapes used in original reducers and API responses
> - [ ] Enums for `NotificationType`, `UserPermission`

> **Story 1.2.2 — Define API request/response types**
> **Files**: `kanban-board-fe/src/types/api.ts`
> **Depends on**: 1.2.1
> **Package changes**: JS → TS
> **Acceptance criteria**:
>
> - [ ] Request/response types for every API endpoint used in `userActions.js` and `projectActions.js`
> - [ ] Generic `ApiResponse<T>` wrapper matching axios response shape

> **Story 1.2.3 — Define Redux state types**
> **Files**: `kanban-board-fe/src/types/store.ts`
> **Depends on**: 1.2.1
> **Package changes**: JS → TS
> **Acceptance criteria**:
>
> - [ ] `RootState` type covering all reducer slices
> - [ ] Typed `AppDispatch`, `AppThunk`
> - [ ] Matches all state shapes in original reducers

---

### Epic 1.3 — Theme & Utility Foundation

> **Story 1.3.1 — Migrate MUI theme**
> **Files**: `kanban-board-fe/src/util/theme.ts`
> **Depends on**: nothing
> **Package changes**: `@material-ui/core` `createMuiTheme` → `@mui/material` `createTheme`
> **Acceptance criteria**:
>
> - [ ] Primary cyan `#00bcd4`, secondary orange `#ff3d00` preserved
> - [ ] Theme exported as typed MUI v7 `Theme` object

> **Story 1.3.2 — Migrate color constants**
> **Files**: `kanban-board-fe/src/util/colorsConstants.ts`
> **Depends on**: nothing
> **Package changes**: JS → TS
> **Acceptance criteria**:
>
> - [ ] `LABEL_COLORS`, `THEME_COLORS`, `BACKGROUND_COLORS` arrays identical to original
> - [ ] Properly typed (string arrays / tuple types)

> **Story 1.3.3 — Migrate utility functions**
> **Files**: `kanban-board-fe/src/util/utilFunctions.ts`
> **Depends on**: 1.2.1
> **Package changes**: `deepcopy` → `structuredClone`
> **Acceptance criteria**:
>
> - [ ] `getTaskIndexes()` function preserved with TypeScript types
> - [ ] Any usage of `deepcopy` replaced with `structuredClone`
> - [ ] Any usage of `fast-deep-equal` replaced with native comparison

> **Story 1.3.4 — Migrate images/assets**
> **Files**: `kanban-board-fe/src/images/*`
> **Depends on**: nothing
> **Acceptance criteria**:
>
> - [ ] All images from images copied to `kanban-board-fe/src/images/`
> - [ ] Vite asset imports work for all image files

---

## Feature 2: State Management & Services

### Epic 2.1 — Redux Store with RTK

> **Story 2.1.1 — Create Redux store with RTK `configureStore`**
> **Files**: `kanban-board-fe/src/redux/store.ts`
> **Depends on**: 1.2.3
> **Package changes**: `redux` + `redux-thunk` + `redux-devtools-extension` → `@reduxjs/toolkit` `configureStore`
> **Acceptance criteria**:
>
> - [ ] Store created with `configureStore` (thunk middleware included by default)
> - [ ] DevTools auto-configured
> - [ ] `localStorage` initialization for `userInfo` and `toDoVisibility` preserved
> - [ ] Typed `RootState` and `AppDispatch` exported via typed hooks

> **Story 2.1.2 — Create typed Redux hooks**
> **Files**: `kanban-board-fe/src/redux/hooks.ts`
> **Depends on**: 2.1.1
> **Package changes**: `useSelector`/`useDispatch` → typed `useAppSelector`/`useAppDispatch`
> **Acceptance criteria**:
>
> - [ ] `useAppDispatch` and `useAppSelector` hooks exported
> - [ ] Fully typed with `RootState` and `AppDispatch`

> **Story 2.1.3 — Migrate user constants and user reducer → user slice**
> **Files**: `kanban-board-fe/src/redux/slices/userSlice.ts`
> **Depends on**: 2.1.1, 1.2.1
> **Package changes**: `redux` reducer + constants → `createSlice`
> **Acceptance criteria**:
>
> - [ ] All 25 user action types preserved as slice actions/extra reducers
> - [ ] All 6 user reducer shapes preserved identically (`userLogin`, `userRegister`, `userEmailConfirm`, `userEmailResend`, `userPictureUpdate`, `userProjectBgUpdate`)
> - [ ] `localStorage` sync on login/logout preserved

> **Story 2.1.4 — Migrate project constants and project reducer → project slice**
> **Files**: `kanban-board-fe/src/redux/slices/projectSlice.ts`
> **Depends on**: 2.1.1, 1.2.1
> **Package changes**: `redux` reducer + constants → `createSlice`
> **Acceptance criteria**:
>
> - [ ] All 28 project action types preserved
> - [ ] All 8 project reducer shapes preserved (`projectCreate`, `projectSetCurrent`, `projectGetData`, `projectTaskMove`, `projectFindUsers`, `projectSetTask`, `projectToDoVisibility`, `projectMessages`)
> - [ ] Complex `projectGetData` reducer logic (nested list/task updates) identical

> **Story 2.1.5 — Migrate socket constants and socket reducer → socket slice**
> **Files**: `kanban-board-fe/src/redux/slices/socketSlice.ts`
> **Depends on**: 2.1.1
> **Package changes**: `redux` reducer → `createSlice`
> **Acceptance criteria**:
>
> - [ ] `SOCKET_CONNECT_SUCCESS` / `SOCKET_CONNECT_RESET` preserved
> - [ ] Socket instance stored in state

---

### Epic 2.2 — API Service Layer (with Fake Mode)

> **Story 2.2.1 — Create API client with backend mode toggle**
> **Files**: `kanban-board-fe/src/services/apiClient.ts`
> **Depends on**: 1.1.1
> **Package changes**: `axios` 0.21 → `axios` 1.14
> **Acceptance criteria**:
>
> - [ ] Axios instance with `baseURL` from `VITE_API_URL`
> - [ ] Auth token interceptor matching original pattern
> - [ ] Export function checks `VITE_BACKEND_MODE` before real call

> **Story 2.2.2 — Create fake API response layer for user endpoints**
> **Files**: `kanban-board-fe/src/services/fake/userFakeApi.ts`
> **Depends on**: 1.2.2
> **Acceptance criteria**:
>
> - [ ] Fake happy-path responses for: `login`, `register`, `confirmEmail`, `resendEmail`, `getUserData`, `getNotifications`, `discardNotification`, `markNotificationsSeen`, `updateProfilePicture`, `updateColorTheme`
> - [ ] Response shapes match real API exactly
> - [ ] Returns after small delay to simulate network

> **Story 2.2.3 — Create fake API response layer for project endpoints**
> **Files**: `kanban-board-fe/src/services/fake/projectFakeApi.ts`
> **Depends on**: 1.2.2
> **Acceptance criteria**:
>
> - [ ] Fake happy-path responses for all 20+ project endpoints
> - [ ] Response shapes match real API exactly
> - [ ] Fake project data includes lists, tasks, labels, messages

> **Story 2.2.4 — Migrate user actions → RTK async thunks**
> **Files**: `kanban-board-fe/src/redux/actions/userActions.ts`
> **Depends on**: 2.1.3, 2.2.1, 2.2.2
> **Package changes**: manual dispatch → `createAsyncThunk`
> **Acceptance criteria**:
>
> - [ ] All 10+ user action creators migrated
> - [ ] Each thunk checks `VITE_BACKEND_MODE` — calls fake or real API
> - [ ] Socket connection logic in `login()` preserved (socket.io-client v4)
> - [ ] Error handling (try/catch) identical to original

> **Story 2.2.5 — Migrate project actions → RTK async thunks**
> **Files**: `kanban-board-fe/src/redux/actions/projectActions.ts`
> **Depends on**: 2.1.4, 2.2.1, 2.2.3
> **Package changes**: manual dispatch + `deepcopy` → `createAsyncThunk` + `structuredClone`
> **Acceptance criteria**:
>
> - [ ] All 20+ project action creators migrated
> - [ ] `deepcopy` calls replaced with `structuredClone`
> - [ ] Each thunk checks `VITE_BACKEND_MODE`
> - [ ] `getTaskIndexes()` usage preserved
> - [ ] Socket emissions preserved in drag-drop actions

---

### Epic 2.3 — Socket Service

> **Story 2.3.1 — Create socket.io service**
> **Files**: `kanban-board-fe/src/services/socket.ts`
> **Depends on**: 1.1.1
> **Package changes**: `socket.io-client` v3 → v4
> **Acceptance criteria**:
>
> - [ ] Socket connect/disconnect functions exported
> - [ ] Auth token passed on connect
> - [ ] When `VITE_BACKEND_MODE=0`, socket is a no-op stub
> - [ ] Socket instance retrievable for event emission/listening

---

## Feature 3: Layout Shell & Navigation

### Epic 3.1 — App Entry & Routing

> **Story 3.1.1 — Migrate `main.tsx` entry point**
> **Files**: main.tsx
> **Depends on**: 2.1.1, 1.3.1
> **Package changes**: `ReactDOM.render` → `createRoot`, add `HelmetProvider`
> **Acceptance criteria**:
>
> - [ ] Redux `Provider` wraps app
> - [ ] `HelmetProvider` from `react-helmet-async` wraps app
> - [ ] MUI `ThemeProvider` applied
> - [ ] `createRoot` used (React 19)

> **Story 3.1.2 — Migrate `App.tsx` routing**
> **Files**: App.tsx
> **Depends on**: 3.1.1, all page components placeholders
> **Package changes**: `react-router-dom` v5 (`Switch`, `Route`) → v7 (`Routes`, `Route`)
> **Acceptance criteria**:
>
> - [ ] All routes preserved: `/`, `/login`, `/register`, `/boards`, `/project/:id`, `/confirm/:id`, `/project-join/:id`, `*` (404)
> - [ ] Protected route logic identical (redirect unauthenticated to `/login`)
> - [ ] `useEffect` for `getUserData()` on mount preserved
> - [ ] Socket event listeners for user updates preserved
> - [ ] `<Switch>` → `<Routes>`, `component=` → `element=`

---

### Epic 3.2 — Layout & VerticalNav

> **Story 3.2.1 — Migrate `Layout` component**
> **Files**: `kanban-board-fe/src/components/layout/Layout.tsx`
> **Depends on**: nothing
> **Acceptance criteria**:
>
> - [ ] Two-column layout: fixed sidebar + main content
> - [ ] Styled identically to original

> **Story 3.2.2 — Migrate `VerticalNav` component**
> **Files**: `kanban-board-fe/src/components/layout/VerticalNav.tsx`
> **Depends on**: 3.2.1
> **Package changes**: MUI v4 `makeStyles` → MUI v7 `styled` / `sx`
> **Acceptance criteria**:
>
> - [ ] Collapsible sidebar — desktop sticky, mobile overlay
> - [ ] Expand/collapse animation preserved
> - [ ] Breakpoint behavior identical

---

### Epic 3.3 — Navigation Components

> **Story 3.3.1 — Migrate `NavItem`, `NavLinks`, `ProjectItems`**
> **Files**: `kanban-board-fe/src/components/layout/navComponents/NavItem.tsx`, `NavLinks.tsx`, `ProjectItems.tsx`
> **Depends on**: 3.2.2, 2.1.2
> **Package changes**: MUI v4 → v7, router v5 `useHistory` → v7 `useNavigate`
> **Acceptance criteria**:
>
> - [ ] Nav items with icons and tooltips identical
> - [ ] Auth vs. guest nav conditional rendering preserved
> - [ ] Project-specific nav items appear when project loaded

> **Story 3.3.2 — Migrate `UserNav`, `UserModal`**
> **Files**: `kanban-board-fe/src/components/layout/navComponents/UserNav.tsx`, `UserModal.tsx`
> **Depends on**: 3.3.1
> **Acceptance criteria**:
>
> - [ ] User avatar, username, notification badge rendered identically
> - [ ] UserModal with avatar upload (file validation for jpg/jpeg/png/gif)
> - [ ] Profile picture update action dispatched

> **Story 3.3.3 — Migrate `NewProjectModal`**
> **Files**: `kanban-board-fe/src/components/layout/navComponents/NewProjectModal.tsx`
> **Depends on**: 3.3.1, 2.2.5
> **Package changes**: MUI v4 Dialog → MUI v7 Dialog
> **Acceptance criteria**:
>
> - [ ] Modal dialog with title input and validation
> - [ ] Calls `createProject()` action
> - [ ] Redirects to new project on success

> **Story 3.3.4 — Migrate `ProjectSelect` (dropdown with menu)**
> **Files**: `kanban-board-fe/src/components/layout/navComponents/projectSelect/ProjectSelect.tsx`, `Select.tsx`, `Menu.tsx`, `ProjectMenuItem.tsx`
> **Depends on**: 3.3.1
> **Package changes**: v5 `NavLink` → v7 `NavLink`
> **Acceptance criteria**:
>
> - [ ] Project dropdown shows current project title
> - [ ] Menu lists owned/joined projects categorized
> - [ ] NavLink routing to each project preserved

> **Story 3.3.5 — Migrate `Notifications` system**
> **Files**: `kanban-board-fe/src/components/layout/navComponents/notifications/Notifications.tsx`, `NotificationsMenu.tsx`, `NotificationItem.tsx`, `NotificationConstants.ts`
> **Depends on**: 3.3.2, 2.2.4
> **Package changes**: `moment` → `date-fns` v4 or `dayjs`
> **Acceptance criteria**:
>
> - [ ] Bell icon with unread badge count
> - [ ] 17 notification types with correct labels
> - [ ] Accept/discard for invitations
> - [ ] Timestamp formatting identical
> - [ ] Marks as seen when dropdown opened

---

## Feature 4: Authentication Pages

### Epic 4.1 — Auth Shared Components

> **Story 4.1.1 — Migrate `ParticlesBackground`**
> **Files**: `kanban-board-fe/src/components/ParticlesBackground.tsx`
> **Depends on**: nothing
> **Package changes**: `react-particles-js` → `@tsparticles/react` + `@tsparticles/slim`
> **Acceptance criteria**:
>
> - [ ] 200 particles with matching movement/opacity config
> - [ ] tsParticles initialization via `@tsparticles/slim` engine
> - [ ] Visual appearance identical to original

> **Story 4.1.2 — Migrate `AuthFormPanel`**
> **Files**: `kanban-board-fe/src/components/AuthFormPanel.tsx`
> **Depends on**: nothing
> **Package changes**: MUI v4 → v7, router v5 → v7
> **Acceptance criteria**:
>
> - [ ] Styled side panel with welcome text and nav links
> - [ ] Routing links preserved

> **Story 4.1.3 — Migrate `Helmet` and `Loader` components**
> **Files**: `kanban-board-fe/src/components/Helmet.tsx`, `kanban-board-fe/src/components/Loader.tsx`
> **Depends on**: nothing
> **Package changes**: `react-helmet` → `react-helmet-async`, MUI v4 `CircularProgress` → v7
> **Acceptance criteria**:
>
> - [ ] Document title set with "Project Manager" suffix
> - [ ] Loader renders with button / contained / full-screen variants

---

### Epic 4.2 — Auth Pages

> **Story 4.2.1 — Migrate `Home` page**
> **Files**: `kanban-board-fe/src/components/pages/Home.tsx`
> **Depends on**: 4.1.1, 4.1.3, 3.1.2
> **Acceptance criteria**:
>
> - [ ] Auth vs. guest UI conditional rendering
> - [ ] Links to Boards or Register
> - [ ] ParticlesBackground displayed

> **Story 4.2.2 — Migrate `Login` page**
> **Files**: `kanban-board-fe/src/components/pages/Login.tsx`
> **Depends on**: 4.1.2, 2.2.4
> **Package changes**: router v5 `useHistory` → v7 `useNavigate`
> **Acceptance criteria**:
>
> - [ ] Email/password form with validation
> - [ ] Calls `login()` thunk, redirects to `/boards`
> - [ ] Error display preserved
> - [ ] Fake mode returns success

> **Story 4.2.3 — Migrate `Register` page**
> **Files**: `kanban-board-fe/src/components/pages/Register.tsx`
> **Depends on**: 4.1.2, 2.2.4
> **Acceptance criteria**:
>
> - [ ] Username/email/password form, 7+ char validation
> - [ ] Calls `register()` thunk
> - [ ] Error display preserved

> **Story 4.2.4 — Migrate `Confirm` page**
> **Files**: `kanban-board-fe/src/components/pages/Confirm.tsx`
> **Depends on**: 2.2.4
> **Package changes**: router v5 `useParams` → v7 `useParams`
> **Acceptance criteria**:
>
> - [ ] Auto-confirms on mount with URL ID
> - [ ] Success/error states with icons
> - [ ] Resend email button

---

## Feature 5: Board Listing

### Epic 5.1 — Boards Page & Components

> **Story 5.1.1 — Migrate `Boards` page**
> **Files**: `kanban-board-fe/src/components/pages/Boards.tsx`
> **Depends on**: 3.2.1, 2.1.3
> **Acceptance criteria**:
>
> - [ ] Grid layout showing all projects (created + joined)
> - [ ] Uses `BoardItem` and `NewProjectBoard` components

> **Story 5.1.2 — Migrate `BoardItem` and `LazyImage`**
> **Files**: `kanban-board-fe/src/components/boards/BoardItem.tsx`, `LazyImage.tsx`
> **Depends on**: 5.1.1
> **Acceptance criteria**:
>
> - [ ] Project card with title, background (image or gradient)
> - [ ] Lazy-loading hook for background images
> - [ ] Link to `/project/:id`

> **Story 5.1.3 — Migrate `NewProjectBoard`**
> **Files**: `kanban-board-fe/src/components/boards/NewProjectBoard.tsx`
> **Depends on**: 3.3.3
> **Acceptance criteria**:
>
> - [ ] "Create new project" card with add icon
> - [ ] Opens `NewProjectModal` on click

---

## Feature 6: Dashboard Core

### Epic 6.1 — Project Page & Board

> **Story 6.1.1 — Migrate `Project` page**
> **Files**: `kanban-board-fe/src/components/pages/Project.tsx`
> **Depends on**: 2.2.5, 2.3.1, 1.3.1
> **Acceptance criteria**:
>
> - [ ] Validates project ID, fetches project data
> - [ ] Sets dynamic theme color per project
> - [ ] Manages socket room join/leave
> - [ ] Renders `Board` + `TaskModal`

> **Story 6.1.2 — Migrate `Board` component with socket listeners**
> **Files**: `kanban-board-fe/src/components/dashboard/Board.tsx`
> **Depends on**: 6.1.1, 2.3.1
> **Acceptance criteria**:
>
> - [ ] Socket listeners for: new tasks, list updates, user changes, messages, labels, archiving
> - [ ] Renders `Navbar` + `Lists`
> - [ ] All real-time dispatch actions preserved

> **Story 6.1.3 — Migrate `Navbar` and `NavTitle`**
> **Files**: `kanban-board-fe/src/components/dashboard/navbar/Navbar.tsx`, `NavTitle.tsx`
> **Depends on**: 6.1.2
> **Package changes**: `react-input-autosize` → native autosize or equivalent
> **Acceptance criteria**:
>
> - [ ] Top bar with board icon and editable project title
> - [ ] Permission check before allowing edit
> - [ ] Socket emission on title change
> - [ ] AutosizeInput behavior replicated

---

### Epic 6.2 — Lists with Drag-and-Drop

> **Story 6.2.1 — Migrate shared components: `AddInput`, `DeleteMenu`, `LabelItem`, `MenuHeader`**
> **Files**: `kanban-board-fe/src/components/dashboard/shared/AddInput.tsx`, `DeleteMenu.tsx`, `LabelItem.tsx`, `MenuHeader.tsx`
> **Depends on**: 2.3.1
> **Package changes**: `react-scroll` v1.8 → v1.9
> **Acceptance criteria**:
>
> - [ ] `AddInput`: expands on focus, scrolls to view, emits socket event
> - [ ] `DeleteMenu`: confirmation dialog with warning text
> - [ ] `LabelItem`: color badge with small variant
> - [ ] `MenuHeader`: back/close buttons for nested menus

> **Story 6.2.2 — Migrate `Lists` container**
> **Files**: `kanban-board-fe/src/components/dashboard/lists/Lists.tsx`
> **Depends on**: 6.2.1
> **Package changes**: `react-smooth-dnd` `Container` → `@hello-pangea/dnd` `DragDropContext` + `Droppable`
> **Acceptance criteria**:
>
> - [ ] Horizontal scrollable board of lists
> - [ ] List drag-and-drop with drop zones using `@hello-pangea/dnd`
> - [ ] Add new list input at end
> - [ ] `onDrop` dispatches `projectListMove()` + socket emit

> **Story 6.2.3 — Migrate `ListItem` component**
> **Files**: `kanban-board-fe/src/components/dashboard/lists/ListItem.tsx`
> **Depends on**: 6.2.2
> **Package changes**: `react-smooth-dnd` `Draggable` → `@hello-pangea/dnd` `Draggable`
> **Acceptance criteria**:
>
> - [ ] Single list card with title, task container, more menu, add task input
> - [ ] Task drag-and-drop within and between lists
> - [ ] `React.memo` for performance
> - [ ] `onDrop` dispatches `projectTaskMove()` + socket emit

> **Story 6.2.4 — Migrate `TitleUpdate`**
> **Files**: `kanban-board-fe/src/components/dashboard/lists/TitleUpdate.tsx`
> **Depends on**: 6.2.3
> **Acceptance criteria**:
>
> - [ ] Editable inline input, Enter to save, Escape to cancel
> - [ ] Used by both `ListItem` and `TaskHeader`

> **Story 6.2.5 — Migrate `ListMore` and `ListMenu` with `TransferTasks`**
> **Files**: `kanban-board-fe/src/components/dashboard/lists/listMore/ListMore.tsx`, `ListMenu.tsx`, `TransferTasks.tsx`
> **Depends on**: 6.2.3, 6.2.1
> **Acceptance criteria**:
>
> - [ ] Three-dot menu with actions: delete list, delete+archive tasks, archive tasks, transfer tasks
> - [ ] TransferTasks submenu lists destination lists with loader

---

### Epic 6.3 — Task Cards

> **Story 6.3.1 — Migrate `Task` card component**
> **Files**: `kanban-board-fe/src/components/dashboard/lists/tasks/Task.tsx`
> **Depends on**: 6.2.3
> **Package changes**: `react-smooth-dnd` `Draggable` → `@hello-pangea/dnd` `Draggable`
> **Acceptance criteria**:
>
> - [ ] Draggable task card showing labels, title, description icon, deadline, to-do progress, assigned users
> - [ ] Delete/archive icons on hover
> - [ ] Link to task detail modal (`/project/:id/task/:taskId`)
> - [ ] `React.memo` for performance

> **Story 6.3.2 — Migrate task sub-icons: `TaskDeadlineIcon`, `TaskTasksCompleted`, `TaskUsers`**
> **Files**: `kanban-board-fe/src/components/dashboard/lists/tasks/taskComponents/TaskDeadlineIcon.tsx`, `TaskTasksCompleted.tsx`, `TaskUsers.tsx`
> **Depends on**: 6.3.1
> **Package changes**: `moment` → `dayjs` or `date-fns` v4
> **Acceptance criteria**:
>
> - [ ] Deadline icon turns red within 24 hours
> - [ ] To-do progress "X/Y" with green when complete
> - [ ] AvatarGroup max 4 users

---

## Feature 7: Task Detail System

### Epic 7.1 — Task Modal Shell

> **Story 7.1.1 — Migrate `TaskModal` (route-based dialog)**
> **Files**: `kanban-board-fe/src/components/dashboard/taskModal/TaskModal.tsx`
> **Depends on**: 6.1.1, 2.1.4
> **Package changes**: router v5 `useRouteMatch` → v7 `useMatch` / `useParams`
> **Acceptance criteria**:
>
> - [ ] Modal opens when task ID in URL
> - [ ] Fetches task data from state
> - [ ] Escape key closes modal
> - [ ] Route-based open/close preserved

> **Story 7.1.2 — Migrate `ModalContainer`**
> **Files**: `kanban-board-fe/src/components/dashboard/taskModal/ModalContainer.tsx`
> **Depends on**: 7.1.1
> **Acceptance criteria**:
>
> - [ ] Renders all task detail sections
> - [ ] Passes task data to child components
> - [ ] Shows `ArchivedHeader` when task is archived

> **Story 7.1.3 — Migrate `ArchivedHeader`, `TaskHeader`**
> **Files**: `kanban-board-fe/src/components/dashboard/taskModal/modalComponents/ArchivedHeader.tsx`, `TaskHeader.tsx`
> **Depends on**: 7.1.2, 6.2.4
> **Package changes**: `moment` → `dayjs`
> **Acceptance criteria**:
>
> - [ ] Archived warning bar with striped blue background
> - [ ] Editable task title, creation date, author info

---

### Epic 7.2 — Modal Content Components

> **Story 7.2.1 — Migrate `TaskDescription` (CKEditor)**
> **Files**: `kanban-board-fe/src/components/dashboard/taskModal/modalComponents/TaskDescription.tsx`
> **Depends on**: 7.1.2
> **Package changes**: `@ckeditor/ckeditor5-build-classic` → `ckeditor5` v48 + `@ckeditor/ckeditor5-react` v11
> **Acceptance criteria**:
>
> - [ ] Rich text editor expands on focus
> - [ ] Click-away dismisses editor
> - [ ] CKEditor v48 initialization with same toolbar/config
> - [ ] Dispatches `taskFieldUpdate()` on save

> **Story 7.2.2 — Migrate `Deadline` (date picker)**
> **Files**: `kanban-board-fe/src/components/dashboard/taskModal/modalComponents/Deadline.tsx`
> **Depends on**: 7.1.2
> **Package changes**: `@material-ui/pickers` v3 → `@mui/x-date-pickers` v8 + `dayjs`
> **Acceptance criteria**:
>
> - [ ] Date picker for deadline
> - [ ] Red highlight when within 24 hours
> - [ ] `dayjs` adapter instead of `date-fns` adapter
> - [ ] Click updates deadline via action

> **Story 7.2.3 — Migrate `Labels` display**
> **Files**: `kanban-board-fe/src/components/dashboard/taskModal/modalComponents/Labels.tsx`
> **Depends on**: 7.1.2, 6.2.1
> **Acceptance criteria**:
>
> - [ ] Shows assigned labels as badges
> - [ ] Uses shared `LabelItem` component

> **Story 7.2.4 — Migrate `SideContent` with all side action buttons**
> **Files**: `kanban-board-fe/src/components/dashboard/taskModal/modalComponents/SideContent.tsx`, `sideComponents/SideButton.tsx`, `Archive.tsx`, `Copy.tsx`, `Deadline.tsx` (side), `Transfer.tsx`, `Watch.tsx`
> **Depends on**: 7.1.2, 2.2.5
> **Acceptance criteria**:
>
> - [ ] Right sidebar with "Add to Task" and "Actions" sections
> - [ ] Archive/delete toggle based on state
> - [ ] Copy task to list, Transfer task, Watch toggle
> - [ ] `React.memo` preserved on SideContent

---

### Epic 7.3 — Labels (Side Component)

> **Story 7.3.1 — Migrate label management: `Label`, `LabelMenu`, `CreateLabel`, `LabelItem`**
> **Files**: `kanban-board-fe/src/components/dashboard/taskModal/modalComponents/sideComponents/labels/Label.tsx`, `LabelMenu.tsx`, `CreateLabel.tsx`, `LabelItem.tsx`
> **Depends on**: 7.2.4, 2.2.5
> **Acceptance criteria**:
>
> - [ ] Label menu lists all project labels with toggle assignment
> - [ ] Create/edit label form with title + color selector (9 colors)
> - [ ] Delete label with confirmation
> - [ ] Checkmark on assigned labels

---

### Epic 7.4 — To-Do Lists

> **Story 7.4.1 — Migrate to-do list creation: `ToDoList` (side button) + `ToDoMenu`**
> **Files**: `kanban-board-fe/src/components/dashboard/taskModal/modalComponents/sideComponents/toDoList/ToDoList.tsx`, `ToDoMenu.tsx`
> **Depends on**: 7.2.4
> **Acceptance criteria**:
>
> - [ ] Button opens popover to create new to-do list
> - [ ] Title input with loader on submit

> **Story 7.4.2 — Migrate to-do list display: `ToDoList`, `ToDoItem`, `ToDoInput`, `TasksProgress`, `ToDoTitleUpdate`, `ToDoMenu`**
> **Files**: `kanban-board-fe/src/components/dashboard/taskModal/modalComponents/toDoLists/ToDoList.tsx`, `ToDoItem.tsx`, `ToDoInput.tsx`, `TasksProgress.tsx`, `ToDoTitleUpdate.tsx`, `ToDoMenu.tsx`
> **Depends on**: 7.4.1, 2.2.5
> **Acceptance criteria**:
>
> - [ ] To-do list with title, progress bar, items, add input
> - [ ] Checkbox toggle on items
> - [ ] Editable item title (Enter save, Escape cancel)
> - [ ] Delete icon on hover
> - [ ] Hide/show completed toggle
> - [ ] Progress bar with "100% done" message
> - [ ] Delete to-do list with confirmation

---

### Epic 7.5 — Task Users Assignment

> **Story 7.5.1 — Migrate task user assignment: `Users`, `AddUsersMenu`, `UserItem`**
> **Files**: `kanban-board-fe/src/components/dashboard/taskModal/modalComponents/sideComponents/users/Users.tsx`, `AddUsersMenu.tsx`, `UserItem.tsx`
> **Depends on**: 7.2.4
> **Package changes**: `deepcopy` → `structuredClone`
> **Acceptance criteria**:
>
> - [ ] Menu shows all project members with checkmark for assigned
> - [ ] Toggle selection, save dispatches `taskUsersUpdate()`
> - [ ] Avatar + name display per user

---

### Epic 7.6 — Comments

> **Story 7.6.1 — Migrate comments: `Comments`, `CommentItem`, `CommentInput`**
> **Files**: `kanban-board-fe/src/components/dashboard/taskModal/modalComponents/comments/Comments.tsx`, `CommentItem.tsx`, `CommentInput.tsx`
> **Depends on**: 7.1.2, 2.2.5
> **Package changes**: `moment` → `dayjs`
> **Acceptance criteria**:
>
> - [ ] Comments list with add/edit/delete
> - [ ] Avatar, username, timestamp per comment
> - [ ] Edit/delete only for own comments
> - [ ] Expandable textarea, Enter to submit
> - [ ] Delete confirmation dialog

---

## Feature 8: Collaboration

### Epic 8.1 — Group Chat

> **Story 8.1.1 — Migrate `Chat` button and `ChatContainer`**
> **Files**: `kanban-board-fe/src/components/dashboard/navbar/groupChat/Chat.tsx`, `ChatContainer.tsx`
> **Depends on**: 6.1.2, 2.2.5
> **Acceptance criteria**:
>
> - [ ] Chat icon with "new message" badge
> - [ ] Desktop: fixed window; Mobile: modal
> - [ ] Input field + send button
> - [ ] Clears notification badge when opened

> **Story 8.1.2 — Migrate `Messages` display**
> **Files**: `kanban-board-fe/src/components/dashboard/navbar/groupChat/Messages.tsx`
> **Depends on**: 8.1.1
> **Package changes**: `moment` → `dayjs`
> **Acceptance criteria**:
>
> - [ ] Auto-scrolling message list
> - [ ] Own messages blue (right), others gray (left)
> - [ ] Consecutive message grouping
> - [ ] Timestamp on hover

---

### Epic 8.2 — Invite Users

> **Story 8.2.1 — Migrate `InviteUsers`, `AddUserMenu`, `SearchMenu`**
> **Files**: `kanban-board-fe/src/components/dashboard/navbar/inviteUsers/InviteUsers.tsx`, `AddUserMenu.tsx`, `SearchMenu.tsx`
> **Depends on**: 6.1.2, 2.2.5
> **Acceptance criteria**:
>
> - [ ] Search users popover with avatar/name/email
> - [ ] Selected users as chips
> - [ ] Send invitation button

> **Story 8.2.2 — Migrate `InviteLink`**
> **Files**: `kanban-board-fe/src/components/dashboard/navbar/inviteUsers/InviteLink.tsx`
> **Depends on**: 8.2.1, 2.3.1
> **Acceptance criteria**:
>
> - [ ] Create/disable join link
> - [ ] Copy-to-clipboard button
> - [ ] Socket events for link creation/disabling

---

### Epic 8.3 — User Management

> **Story 8.3.1 — Migrate `Users`, `UsersGroup`, `UserItem`**
> **Files**: `kanban-board-fe/src/components/dashboard/navbar/users/Users.tsx`, `UsersGroup.tsx`, `UserItem.tsx`
> **Depends on**: 6.1.2, 2.3.1
> **Acceptance criteria**:
>
> - [ ] Avatar group (max 6) with "+X more"
> - [ ] Permission badges (admin/user/invited)
> - [ ] Socket listeners for permission changes and user removal

> **Story 8.3.2 — Migrate user menus: `UserMenu`, `GroupMenu`, `AdminInnerMenu`, `NormalInnerMenu`, `UsersGroupInnerMenu`**
> **Files**: `kanban-board-fe/src/components/dashboard/navbar/users/userMenus/UserMenu.tsx`, `GroupMenu.tsx`, `innerMenus/AdminInnerMenu.tsx`, `NormalInnerMenu.tsx`, `UsersGroupInnerMenu.tsx`
> **Depends on**: 8.3.1, 2.2.5
> **Acceptance criteria**:
>
> - [ ] Admin menu: update permissions, remove/withdraw
> - [ ] Normal menu: view permissions, leave project
> - [ ] Group menu: members by category with drill-down
> - [ ] All permission update actions dispatch correctly

---

## Feature 9: Settings & Polish

### Epic 9.1 — Project Settings

> **Story 9.1.1 — Migrate `Settings` button and `SettingsModal`**
> **Files**: `kanban-board-fe/src/components/dashboard/navbar/settings/Settings.tsx`, `SettingsModal.tsx`
> **Depends on**: 6.1.2
> **Acceptance criteria**:
>
> - [ ] Gear icon opens dialog
> - [ ] Theme color, background, delete project sections
> - [ ] Delete only visible for project creator

> **Story 9.1.2 — Migrate settings components: `ColorSelect`, `Background`, `BackgroundSelect`, `ImageUpload`, `DeleteProject`, `Header`**
> **Files**: `kanban-board-fe/src/components/dashboard/navbar/settings/settingsComponents/ColorSelect.tsx`, `Background.tsx`, `DeleteProject.tsx`, `Header.tsx`, `background/BackgroundSelect.tsx`, `background/ImageUpload.tsx`
> **Depends on**: 9.1.1, 2.2.4, 2.2.5
> **Package changes**: `uuid` v8 → v13
> **Acceptance criteria**:
>
> - [ ] 8 theme colors with scale hover effect
> - [ ] 5 gradient presets + image upload
> - [ ] File validation (jpg/jpeg/png/gif)
> - [ ] Delete project with confirmation dialog
> - [ ] `uuid` v13 for upload keys

---

### Epic 9.2 — Archived Tasks

> **Story 9.2.1 — Migrate `ArchivedTasks`, `ArchivedMenu`, `ArchivedActions`, `TransferMenu`**
> **Files**: `kanban-board-fe/src/components/dashboard/navbar/archivedTasks/ArchivedTasks.tsx`, `ArchivedMenu.tsx`, `ArchivedActions.tsx`, `TransferMenu.tsx`
> **Depends on**: 6.1.2, 6.3.1, 2.2.5
> **Acceptance criteria**:
>
> - [ ] Trash icon opens popover
> - [ ] Archived tasks list with transfer/delete actions
> - [ ] Transfer to list dropdown
> - [ ] Socket updates on changes

---

### Epic 9.3 — Remaining Pages

> **Story 9.3.1 — Migrate `NotFoundPage`**
> **Files**: `kanban-board-fe/src/components/pages/NotFoundPage.tsx`
> **Depends on**: 3.1.2
> **Acceptance criteria**:
>
> - [ ] 404 page with link to `/boards`
> - [ ] Styled identically

> **Story 9.3.2 — Migrate `ProjectJoinPage`**
> **Files**: `kanban-board-fe/src/components/pages/ProjectJoinPage.tsx`
> **Depends on**: 2.3.1, 3.1.2
> **Acceptance criteria**:
>
> - [ ] Emits `project-join` socket event with URL token
> - [ ] Redirects to project on success
> - [ ] Uses router v7 `useParams` + `useNavigate`

---

## Dependency Graph (Execution Order)

```
Phase 1 ─ Foundation (Feature 1)
  ├── 1.1.1 Env config
  ├── 1.1.2 HTML + public assets
  ├── 1.1.3 Global CSS
  ├── 1.2.1 Domain types
  ├── 1.3.1 Theme
  ├── 1.3.2 Color constants
  ├── 1.3.4 Images/assets
  └── 1.2.2 API types ──→ 1.2.3 Redux state types ──→ 1.3.3 Util functions

Phase 2 ─ State Layer (Feature 2)
  ├── 2.1.1 Redux store ──→ 2.1.2 Typed hooks
  ├── 2.1.3 User slice ──┐
  ├── 2.1.4 Project slice ├──→ 2.2.4 User thunks ──→ 2.2.5 Project thunks
  ├── 2.1.5 Socket slice  │
  ├── 2.2.1 API client ───┘
  ├── 2.2.2 User fake API
  ├── 2.2.3 Project fake API
  └── 2.3.1 Socket service

Phase 3 ─ Layout Shell (Feature 3)
  ├── 3.1.1 main.tsx entry
  ├── 3.1.2 App.tsx routing
  ├── 3.2.1 Layout ──→ 3.2.2 VerticalNav
  ├── 3.3.1 NavItem/NavLinks ──→ 3.3.2 UserNav ──→ 3.3.5 Notifications
  ├── 3.3.3 NewProjectModal
  └── 3.3.4 ProjectSelect

Phase 4 ─ Auth Pages (Feature 4)
  ├── 4.1.1 ParticlesBackground
  ├── 4.1.2 AuthFormPanel
  ├── 4.1.3 Helmet + Loader
  └── 4.2.1–4.2.4 Home, Login, Register, Confirm

Phase 5 ─ Boards (Feature 5)
  └── 5.1.1–5.1.3 Boards page, BoardItem, NewProjectBoard

Phase 6 ─ Dashboard Core (Feature 6)
  ├── 6.1.1 Project page ──→ 6.1.2 Board ──→ 6.1.3 Navbar
  ├── 6.2.1 Shared components ──→ 6.2.2 Lists ──→ 6.2.3 ListItem ──→ 6.2.4 TitleUpdate, 6.2.5 ListMore
  └── 6.3.1 Task card ──→ 6.3.2 Task sub-icons

Phase 7 ─ Task System (Feature 7)
  ├── 7.1.1 TaskModal ──→ 7.1.2 ModalContainer ──→ 7.1.3 Headers
  ├── 7.2.1 Description ──→ 7.2.2 Deadline ──→ 7.2.3 Labels ──→ 7.2.4 SideContent
  ├── 7.3.1 Label management
  ├── 7.4.1 ToDoList creation ──→ 7.4.2 ToDoList display
  ├── 7.5.1 Task users
  └── 7.6.1 Comments

Phase 8 ─ Collaboration (Feature 8)
  ├── 8.1.1 Chat ──→ 8.1.2 Messages
  ├── 8.2.1 Invite Users ──→ 8.2.2 InviteLink
  └── 8.3.1 Users ──→ 8.3.2 User menus

Phase 9 ─ Settings & Polish (Feature 9)
  ├── 9.1.1 Settings ──→ 9.1.2 Settings components
  ├── 9.2.1 Archived tasks
  └── 9.3.1 NotFoundPage, 9.3.2 ProjectJoinPage
```

---

## Summary

| Metric             | Count                                            |
| ------------------ | ------------------------------------------------ |
| Features           | 9                                                |
| Epics              | 22                                               |
| User Stories       | 48                                               |
| Package migrations | 17 distinct library changes                      |
| Files to create    | ~80 TypeScript source files                      |
| Estimated phases   | 9 sequential (with parallel stories within each) |

Each story is independently implementable by the @FE agent, with clear file targets, acceptance criteria, and dependency markers. Phases 1-2 are the critical path — everything else builds on them.
