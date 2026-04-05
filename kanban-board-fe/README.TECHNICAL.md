# Kanban Board FE — Technical Documentation

> **Audience:** Developers working on or extending this codebase.
> This document covers architecture, tech stack, build platform, highlight implementations, and the full request-to-storage data flow.

---

## Table of Contents

- [1. Architecture Overview](#1-architecture-overview)
- [2. Project Structure](#2-project-structure)
  - [2.1 Directory Map](#21-directory-map)
  - [2.2 Layer Responsibility](#22-layer-responsibility)
- [3. Tech Stack &amp; Dependencies](#3-tech-stack--dependencies)
  - [3.1 Core Platform](#31-core-platform)
  - [3.2 UI Layer](#32-ui-layer)
  - [3.3 State &amp; Data](#33-state--data)
  - [3.4 Dev Tooling](#34-dev-tooling)
- [4. Platform — Build &amp; Configuration](#4-platform--build--configuration)
  - [4.1 Build Pipeline (Vite)](#41-build-pipeline-vite)
  - [4.2 TypeScript Configuration](#42-typescript-configuration)
  - [4.3 Environment Variables](#43-environment-variables)
  - [4.4 Backend Mode Toggle (Fake / Real)](#44-backend-mode-toggle-fake--real)
  - [4.5 Running the App](#45-running-the-app)
- [5. Highlight Implementations](#5-highlight-implementations)
  - [5.1 Drag &amp; Drop (Lists &amp; Tasks)](#51-drag--drop-lists--tasks)
  - [5.2 Real-Time Sync (Socket.IO)](#52-real-time-sync-socketio)
  - [5.3 Particles Animated Background](#53-particles-animated-background)
  - [5.4 Rich Text Editor (CKEditor 5)](#54-rich-text-editor-ckeditor-5)
  - [5.5 Dynamic Theming per Project](#55-dynamic-theming-per-project)
  - [5.6 Optimistic Updates](#56-optimistic-updates)
- [6. Data Flow — Request to Storage](#6-data-flow--request-to-storage)
  - [6.1 Overview Diagram](#61-overview-diagram)
  - [6.2 HTTP Request Flow](#62-http-request-flow)
  - [6.3 Socket Event Flow](#63-socket-event-flow)
  - [6.4 Redux Store Architecture](#64-redux-store-architecture)
  - [6.5 Detailed Walkthrough: Creating a Task](#65-detailed-walkthrough-creating-a-task)
  - [6.6 Detailed Walkthrough: Drag &amp; Drop Task Move](#66-detailed-walkthrough-drag--drop-task-move)
  - [6.7 Detailed Walkthrough: Login](#67-detailed-walkthrough-login)

---

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         Browser (SPA)                           │
│                                                                 │
│  ┌───────────┐    ┌────────────┐    ┌────────────────────────┐  │
│  │ React 19  │◄──►│ Redux (RTK)│◄──►│ Action Creators /      │  │
│  │ Components │    │ Store      │    │ Thunks                 │  │
│  └───────────┘    └────────────┘    └─────────┬──────────────┘  │
│                                                │                │
│                        ┌───────────────────────┼────────┐       │
│                        │                       │        │       │
│                   ┌────▼────┐           ┌──────▼─────┐  │       │
│                   │  Axios  │           │ Socket.IO  │  │       │
│                   │ (HTTP)  │           │ (WebSocket)│  │       │
│                   └────┬────┘           └──────┬─────┘  │       │
│                        │                       │        │       │
│                   ┌────▼───────────────────────▼────┐   │       │
│                   │   Fake API layer (mock data)    │   │       │
│                   │   OR                            │   │       │
│                   │   Real Backend (Express + Mongo) │   │       │
│                   └─────────────────────────────────┘   │       │
│                                                         │       │
└─────────────────────────────────────────────────────────────────┘
```

**Key architectural decisions:**

| Decision | Rationale |
|---|---|
| Tech stacks | React, Typescript - Hello Pangea DnD, Material UI, Tailwind CSS - Axios, Socket.io |
| Kanban board application | Single-page, responsive, partial reloading, drag-and-drop experience for Kanban board features |
| Redux Toolkit for global state | Complex shared state across deep component trees (project data, user info, socket) |
| Dual-channel communication (HTTP + WebSocket) | HTTP for CRUD; WebSocket for real-time collaboration broadcasts |
| Fake-mode toggle | Develop and demo the frontend independently of the backend |
| Optimistic updates | Immediate UI feedback; server reconciliation via socket broadcasts |

---

## 2. Project Structure

### 2.1 Directory Map

```
kanban-board-fe/
├── index.html                     # Vite entry HTML
├── vite.config.ts                 # Vite + Tailwind plugin config
├── tsconfig.app.json              # App-specific TS config (strict mode)
├── package.json                   # Dependencies & scripts
├── .env / .env.example            # Environment variables
│
├── public/                        # Static assets served as-is
│
└── src/
    ├── main.tsx                   # ReactDOM entry — Provider, HelmetProvider, StrictMode
    ├── App.tsx                    # Router, global socket listeners, auth guard
    ├── index.css                  # Global CSS + Tailwind import
    │
    ├── config/
    │   └── env.ts                 # VITE_BACKEND_MODE & VITE_API_URL helpers
    │
    ├── types/
    │   ├── models.ts              # Domain models: User, Project, Task, List, Label, etc.
    │   ├── store.ts               # Redux slice state interfaces + AppThunk/AppDispatch
    │   └── api.ts                 # API request/response shapes
    │
    ├── services/
    │   ├── apiClient.ts           # Axios instance + auth interceptor + error extractor
    │   ├── socket.ts              # Socket.IO connect/disconnect + fake stub
    │   └── fake/
    │       ├── userFakeApi.ts     # Mock implementations for user endpoints
    │       └── projectFakeApi.ts  # Mock implementations for project endpoints
    │
    ├── redux/
    │   ├── store.ts               # configureStore — all reducers + preloaded state
    │   ├── hooks.ts               # useAppDispatch & useAppSelector (typed)
    │   ├── slices/
    │   │   ├── userSlice.ts       # 6 slices: login, register, emailConfirm, emailResend, pictureUpdate, bgUpdate
    │   │   ├── projectSlice.ts    # 8 slices: create, setCurrent, getData, taskMove, findUsers, setTask, toDoVisibility, messages
    │   │   └── socketSlice.ts     # 1 slice: socket connection instance
    │   └── actions/
    │       ├── userActions.ts     # Thunks: login, register, logout, getUserData, notifications, profile picture, theme, bg
    │       └── projectActions.ts  # Thunks: CRUD project/list/task, DnD move, archive, transfer, invite, chat
    │
    ├── util/
    │   ├── theme.ts               # Default MUI theme (primary: cyan, secondary: deep orange)
    │   ├── colorsConstants.ts     # Label colors, theme palette, gradient backgrounds
    │   └── utilFunctions.ts       # Shared helpers (getTaskIndexes)
    │
    ├── images/                    # Static images (backgrounds, SVGs)
    │
    └── components/
        ├── AuthFormPanel.tsx       # Shared login/register form container
        ├── Helmet.tsx              # Page <title> wrapper (react-helmet-async)
        ├── Loader.tsx              # Loading spinner
        ├── ParticlesBackground.tsx # tsParticles animated background
        │
        ├── pages/                 # Route-level page components
        │   ├── Home.tsx           # Landing page
        │   ├── Login.tsx          # Sign-in form
        │   ├── Register.tsx       # Sign-up form
        │   ├── Confirm.tsx        # Email confirmation
        │   ├── Boards.tsx         # Project gallery (all boards)
        │   ├── Project.tsx        # Project dashboard (board + modals)
        │   ├── ProjectJoinPage.tsx# Invite link handler
        │   └── NotFoundPage.tsx   # 404
        │
        ├── layout/                # App shell
        │   ├── Layout.tsx         # Flex container: VerticalNav + content
        │   ├── VerticalNav.tsx    # Collapsible sidebar (responsive)
        │   └── navComponents/     # NavLinks, NavItem, ProjectItems, UserModal, notifications, etc.
        │
        ├── boards/                # Board card components for the gallery
        │   ├── BoardItem.tsx      # Single project card
        │   ├── NewProjectBoard.tsx# "Create project" card
        │   └── LazyImage.ts       # Lazy image loading utility
        │
        └── dashboard/             # Inside a project
            ├── Board.tsx          # Socket event hub + Navbar + Lists
            ├── navbar/            # Top navbar: title, settings, chat, invite, archive, users
            ├── lists/
            │   ├── Lists.tsx      # DragDropContext + Droppable board
            │   ├── ListItem.tsx   # Single list column (Draggable + Droppable)
            │   ├── TitleUpdate.tsx # Inline list title editing
            │   ├── listMore/      # List context menu (delete, archive all, transfer)
            │   └── tasks/
            │       ├── Task.tsx   # Single task card (Draggable)
            │       └── taskComponents/ # Labels, due date, assignees on card
            ├── shared/            # Reusable dashboard widgets
            │   ├── AddInput.tsx   # Inline "add" input (list / task)
            │   ├── DeleteMenu.tsx # Confirmation popover
            │   ├── LabelItem.tsx  # Colored label chip
            │   └── MenuHeader.tsx # Consistent menu header with close
            └── taskModal/         # Full task detail modal
                ├── TaskModal.tsx  # Modal wrapper + route integration
                ├── ModalContainer.tsx # Modal content layout
                └── modalComponents/   # Description, labels, dates, checklists, comments, etc.
```

### 2.2 Layer Responsibility

| Layer | Location | Responsibility |
|---|---|---|
| **Entry** | `main.tsx`, `App.tsx` | Bootstrap providers (Redux, Helmet, Router), define routes, global socket listeners |
| **Pages** | `components/pages/` | Route-level containers — compose layout with feature components |
| **Features** | `components/dashboard/`, `components/boards/` | Domain-specific UI (board, lists, tasks, modals, chat) |
| **Layout** | `components/layout/` | App shell (sidebar navigation, responsive behavior) |
| **Shared UI** | `components/shared/`, `components/Loader.tsx`, etc. | Reusable presentational components |
| **State** | `redux/slices/` | State shape definitions + synchronous reducers |
| **Side Effects** | `redux/actions/` | Async thunks — orchestrate API calls, socket emits, and dispatch sequences |
| **Services** | `services/` | External I/O abstraction (HTTP client, socket connection, mock data) |
| **Types** | `types/` | TypeScript interfaces for domain models, store state, and API contracts |
| **Config** | `config/`, `util/` | Environment helpers, MUI theme, color constants |

---

## 3. Tech Stack & Dependencies

### 3.1 Core Platform

| Package | Version | Purpose |
|---|---|---|
| **React** | 19 | UI rendering, hooks-based components |
| **TypeScript** | 5.9 | Static typing across the entire codebase |
| **Vite** | 8 | Dev server (HMR) + production build (Rollup-based) |
| **react-router-dom** | 7 | Client-side routing (`Routes`/`Route`/`Navigate`/`useNavigate`/`useParams`) |
| **react-helmet-async** | 3 | Declarative `<head>` management (page titles) |

### 3.2 UI Layer

| Package | Version | Purpose |
|---|---|---|
| **@mui/material** | 7 | Component library (Buttons, Dialogs, Menus, Popovers, etc.) |
| **@mui/icons-material** | 7 | Material Design icon set |
| **@mui/lab** | 7-beta | Experimental MUI components (TabContext, etc.) |
| **@mui/x-date-pickers** | 8 | Date/time picker components (with dayjs adapter) |
| **@emotion/react + @emotion/styled** | 11 | CSS-in-JS runtime for MUI's `styled()` and `sx` prop |
| **tailwindcss** | 4 | Utility CSS (layout helpers); integrated via `@tailwindcss/vite` plugin |
| **@hello-pangea/dnd** | 18 | Drag & drop for lists and task cards |
| **@tsparticles/react + @tsparticles/slim** | 3 | Animated particle background on auth/home pages |
| **ckeditor5 + @ckeditor/ckeditor5-react** | 48 / 11 | Rich-text WYSIWYG editor for task descriptions |
| **react-scroll** | 1.9 | Smooth scroll navigation (landing page) |
| **dayjs** | 1.11 | Lightweight date manipulation (date pickers) |
| **date-fns** | 4 | Date formatting utilities |

### 3.3 State & Data

| Package | Version | Purpose |
|---|---|---|
| **@reduxjs/toolkit** | 2 | `configureStore`, `createSlice`, typed dispatch/selector |
| **react-redux** | 9 | React bindings for Redux (Provider, hooks) |
| **axios** | 1.14 | HTTP client with interceptors (auth token injection) |
| **socket.io-client** | 4 | WebSocket client for real-time event pub/sub |
| **lodash** | 4 | Deep clone (`_.cloneDeep`) in reducers for immutable state updates |
| **uuid** | 13 | Generate unique IDs for optimistic entities in fake mode |

### 3.4 Dev Tooling

| Package | Purpose |
|---|---|
| **@vitejs/plugin-react** | Vite React plugin (Oxc transforms, Fast Refresh) |
| **@tailwindcss/vite** | Tailwind CSS JIT via Vite plugin |
| **eslint + typescript-eslint + react-hooks + react-refresh** | Linting with React-specific rules |
| **@types/* packages** | TypeScript type declarations for third-party libraries |

---

## 4. Platform — Build & Configuration

### 4.1 Build Pipeline (Vite)

**`vite.config.ts`**:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

| Script | Command | What It Does |
|---|---|---|
| `dev` | `vite` | Starts dev server with HMR on `localhost:5173` |
| `build` | `tsc -b && vite build` | Type-checks then bundles for production |
| `preview` | `vite preview` | Serves the production build locally |
| `lint` | `eslint .` | Runs ESLint across all files |

**How Vite processes the app:**

1. `index.html` → Vite finds `<script type="module" src="/src/main.tsx">`
2. Vite resolves all imports via ESM, applies React plugin (JSX transform), Tailwind plugin (CSS)
3. In dev: native ESM + HMR. In production: Rollup bundles into optimized chunks in `dist/`

### 4.2 TypeScript Configuration

**`tsconfig.app.json`** — strict mode enabled:

| Setting | Value | Effect |
|---|---|---|
| `target` | ES2023 | Modern JS output (top-level await, etc.) |
| `strict` | true | All strict checks (null, implicit any, etc.) |
| `jsx` | react-jsx | Automatic JSX runtime (no `import React`) |
| `moduleResolution` | bundler | Vite-compatible module resolution |
| `noUnusedLocals/Parameters` | true | Catch dead code at compile time |
| `verbatimModuleSyntax` | true | `import type` required for type-only imports |

### 4.3 Environment Variables

**`.env`** (and `.env.example`):

```
VITE_BACKEND_MODE=0        # 0 = fake API, 1 = real backend
VITE_API_URL=http://localhost:5000
```

Accessed via `import.meta.env.VITE_*` (Vite convention, NOT `process.env`).

Centralized in `src/config/env.ts`:

```typescript
export const BACKEND_MODE = Number(import.meta.env.VITE_BACKEND_MODE ?? '0') as 0 | 1;
export const API_URL = (import.meta.env.VITE_API_URL as string) ?? 'http://localhost:5000';
export const isFakeMode = (): boolean => BACKEND_MODE === 0;
```

### 4.4 Backend Mode Toggle (Fake / Real)

Every thunk checks `isFakeMode()` to decide between:

```
                          isFakeMode()?
                          ┌─── YES ──► fake API function (returns mock data)
action thunk ─────────────┤
                          └─── NO ───► axios call to real backend
```

**Fake mode infrastructure:**

| File | Coverage |
|---|---|
| `services/fake/userFakeApi.ts` | Login, register, confirm, notifications, profile picture, themes |
| `services/fake/projectFakeApi.ts` | Create project, get project data, find users, get task |
| `services/socket.ts` → `createFakeSocket()` | No-op socket stub (all methods return self) |

Fake functions return data matching real API response shapes (`types/api.ts`) after a small simulated delay.

### 4.5 Running the App

```bash
# Install dependencies
npm install

# Run in fake mode (no backend needed)
cp .env.example .env          # VITE_BACKEND_MODE=0
npm run dev

# Run with real backend
# Edit .env: VITE_BACKEND_MODE=1, VITE_API_URL=http://localhost:5000
npm run dev

# Production build
npm run build                  # Outputs to dist/
npm run preview                # Serve dist/ locally
```

---

## 5. Highlight Implementations

### 5.1 Drag & Drop (Lists & Tasks)

**Library:** `@hello-pangea/dnd` (React 19-compatible fork of `react-beautiful-dnd`)

**Architecture:**

```
Lists.tsx
├── <DragDropContext onDragEnd={handler}>
│   └── <Droppable droppableId="board" type="LIST" direction="horizontal">
│       └── {lists.map(list => <ListItem />)}       ← each is <Draggable>
│           └── <Droppable droppableId={index} type="TASK">
│               └── {list.tasks.map(task => <Task />)} ← each is <Draggable>
```

**How `onDragEnd` works (in `Lists.tsx`):**

1. Determine `type` — `'LIST'` or `'TASK'`
2. **List reorder:** Dispatch `projectListMove(sourceIndex, destIndex)` → uses `structuredClone` to reorder in-memory, then emits `'list-move'` socket event
3. **Task move (same list):** Single dispatch of `projectTaskMove` with both `removedIndex` and `addedIndex`
4. **Task move (cross-list):** Two-phase dispatch — first with `removedIndex` only (stores in `projectTaskMove` slice), then with `addedIndex` only (completes the move and emits socket)

**Why two-phase?** The `@hello-pangea/dnd` library fires separate `onDragEnd` callbacks for source and destination when crossing droppable boundaries. The `projectTaskMove` Redux slice acts as a staging area, holding partial move state until both halves arrive.

### 5.2 Real-Time Sync (Socket.IO)

**Connection lifecycle:**

```
Login/getUserData
  └── connectSocket(token) → io(API_URL, { auth: { authorization: Bearer <token> } })
       └── socket.on('connect')
            ├── dispatch(socketConnectSuccess(socket))     ← store socket in Redux
            └── socket.emit('join-notifications', { room: userId })

Navigate to /project/:id
  └── getProjectData(projectId)
       ├── socket.emit('disconnect-board', { room: prevProjectId })
       └── socket.emit('join-board', { room: projectId })

Board.tsx mounts
  └── useEffect registers ~15 socket listeners:
       'new-task', 'lists-update', 'list-added', 'list-title-updated',
       'project-title-updated', 'project-join-link-updated',
       'project-users-updated', 'task-archived', 'task-updated',
       'tasks-updated', 'labels-updated', 'task-deleted', 'new-message'
  └── Each listener dispatches Redux actions to update local state

Logout
  └── socket.disconnect() → dispatch(socketConnectReset())
```

**Socket event patterns:**

| Pattern | Example | Description |
|---|---|---|
| **Emit → Broadcast → Listen** | `emit('add-task')` → server broadcasts `'new-task'` to room | Standard mutating action |
| **Notification push** | Server emits `'notifications-updated'` → client re-fetches | Notification badge update |
| **User-level broadcast** | `'user-updated'`, `'auth-error'`, `'user-removed-from-project'` | Global user state changes |

**Fake mode socket:** `createFakeSocket()` returns a no-op stub where every method returns `self`, so all `socket.emit(...)` and `socket.on(...)` calls are harmless no-ops.

### 5.3 Particles Animated Background

**Library:** `@tsparticles/react` + `@tsparticles/slim`

**Implementation (`ParticlesBackground.tsx`):**

1. On mount, `initParticlesEngine(loadSlim)` loads the slim particle engine (smaller bundle than full)
2. Once initialized (`init` state = true), renders `<Particles>` with configuration:
   - 200 particles, upward drift, random sizes with animation
   - Dark background (`rgb(35, 39, 65)`)
   - No links between particles, no interactivity
3. Accepts `disableMove` prop — when `true`, particles are static (used on certain pages)
4. Uses `useMemo` to prevent options object recreation on re-renders

**Where used:** Home, Login, Register, Confirm, and Boards pages — layered behind content at `z-index: -1` via `fullScreen.enable: true`.

### 5.4 Rich Text Editor (CKEditor 5)

**Library:** `ckeditor5` v48 + `@ckeditor/ckeditor5-react` v11

Used for task description editing in the task modal. The `@ckeditor/ckeditor5-react` package provides the `<CKEditor>` component that wraps the CKEditor 5 engine. Content is stored as HTML in the task's `description` field and persisted to the backend via socket events.

### 5.5 Dynamic Theming per Project

Each project can have a custom color theme. The `Project.tsx` component creates a **dynamic MUI theme** at render time:

```typescript
const mainColor = userInfo?.projectsThemes?.[projectId]?.mainColor ?? '#00bcd4';
const theme = createTheme({
  palette: { primary: { main: mainColor }, secondary: { main: '#ff3d00' } },
});
// Wrap Board in <ThemeProvider theme={theme}>
```

**Storage:** Themes are stored per-project in `userInfo.projectsThemes[projectId]` and synced to the backend via `updateColorTheme()`.

**Backgrounds:** Each project also supports custom backgrounds (gradient colors or uploaded images) stored in `project.background`.

### 5.6 Optimistic Updates

Many actions update UI immediately without waiting for server confirmation:

| Action | Optimistic Update | Server Reconciliation |
|---|---|---|
| Add task (fake mode) | `projectDataAddTask` dispatched immediately with UUID | N/A (fake mode is fully client-side) |
| Move task | `projectDataMoveTask` updates lists immediately | Socket broadcast confirms to other clients |
| Archive task | Splice from list, push to `archivedTasks` | Socket `'task-archive'` broadcast |
| Reorder list | Splice + insert in `lists` array | Socket `'list-move'` broadcast |
| Delete notifications | Splice from array, then API call | Async `apiClient.delete()` |

**Pattern:** Clone state → mutate clone → dispatch to Redux → emit socket (or HTTP) for persistence.

---

## 6. Data Flow — Request to Storage

### 6.1 Overview Diagram

```
  User Interaction (click, drag, type)
          │
          ▼
  React Component (event handler)
          │
          ▼
  dispatch(actionThunk(...args))            ← redux/actions/*.ts
          │
          ├─── dispatch(sliceAction())      ← loading/optimistic update
          │
          ├─── isFakeMode()?
          │    ├─ YES → fakeApi function    ← services/fake/*.ts
          │    └─ NO  → apiClient.post/get  ← services/apiClient.ts
          │            or socket.emit()     ← services/socket.ts
          │
          ▼
  dispatch(successAction(data))             ← updates Redux store
          │
          ▼
  Redux Store updates
          │
          ▼
  useAppSelector re-renders Components     ← UI reflects new state
```

### 6.2 HTTP Request Flow

```
Component
  └── dispatch(thunk)
       └── apiClient.post('/api/endpoint', payload)
            │
            ├── Interceptor: injects Authorization: Bearer <token>
            │   (reads from localStorage → JSON.parse → .token)
            │
            └── axios sends HTTP request
                 │
                 ├── Success: dispatch(successAction(response.data))
                 └── Error:   dispatch(failAction(extractErrorMessage(error)))
                              ↑ extracts error.response.data.message or error.message
```

**`apiClient.ts` key features:**

- Base URL from `config/env.ts` → `import.meta.env.VITE_API_URL`
- Auto-auth via request interceptor (reads token from `localStorage`)
- `extractErrorMessage()` — graceful error message extraction from Axios errors
- `getAuthConfig()` — manual config builder for cases needing custom headers (e.g., multipart form)

### 6.3 Socket Event Flow

**Outbound (client → server):**

```
Action thunk
  └── getState().socketConnection.socket
       └── socket.emit('event-name', { projectId, ...payload }, callback?)
```

**Inbound (server → client):**

```
Board.tsx useEffect
  └── socket.on('event-name', (data) => {
       dispatch(sliceAction(data))      ← updates Redux store
  })

App.tsx useEffect (global)
  └── socket.on('notifications-updated', () => dispatch(getUpdatedNotifications()))
  └── socket.on('user-updated', (data) => dispatch(userDataUpdate(data)))
  └── socket.on('auth-error', () => dispatch(logout()))
  └── socket.on('user-removed-from-project', (data) => dispatch(userRemoved(data)))
```

**Complete socket event catalog:**

| Event (outbound) | Event (inbound) | Slice Action Dispatched |
|---|---|---|
| `join-board` | — | — (room join) |
| `disconnect-board` | — | — (room leave) |
| `add-task` | `new-task` | `projectDataAddTask` |
| `add-list` | `list-added` | `projectDataAddList` |
| `task-move` | `lists-update` | `projectDataUpdateLists` |
| `list-move` | `lists-update` | `projectDataUpdateLists` |
| `task-archive` | `task-archived` | `projectDataTaskArchived` |
| `task-delete` | `task-deleted` | (projectSetTaskSuccess with `deleted: true`) |
| `task-transfer` | `lists-update` | `projectDataUpdateLists` |
| — | `task-updated` | `projectDataUpdateLists` + `projectSetTaskSuccess` |
| — | `labels-updated` | `projectDataUpdateLabels` |
| — | `project-title-updated` | `projectDataTitleUpdate` |
| — | `project-join-link-updated` | `projectDataJoinLinkUpdate` |
| — | `project-users-updated` | `projectDataUsersUpdate` |
| — | `new-message` | `projectSetNewMessage` + `projectUpdateMessages` |
| `join-notifications` | `notifications-updated` | `getUpdatedNotifications()` thunk |
| — | `user-updated` | `userDataUpdate` |
| — | `auth-error` | `logout()` thunk |
| — | `user-removed-from-project` | `userRemoved` |

### 6.4 Redux Store Architecture

**15 slices** managed by `configureStore`:

```
RootState
├── userLogin            → { loading, userInfo, notifications, error }
├── userRegister         → { loading, success, error }
├── userEmailConfirm     → { loading, success, error }
├── userEmailResend      → { loading, success, error }
├── userPictureUpdate    → { loading, success, error }
├── userProjectBgUpdate  → { loading, success, error }
├── projectCreate        → { loading, project, error }
├── projectSetCurrent    → { project (summary) }
├── projectGetData       → { loading, project, lists, labels, error }
├── projectTaskMove      → { added, removed }              ← DnD staging
├── projectFindUsers     → { loading, users, error }
├── projectSetTask       → { loading, task, error }         ← currently opened task
├── projectToDoVisibility→ { listIds }                      ← collapsed checklist IDs
├── projectMessages      → { messages, newMessage }
└── socketConnection     → { socket }                       ← Socket.IO instance
```

**Preloaded state:**

```typescript
preloadedState: {
  userLogin: {
    userInfo: JSON.parse(localStorage.getItem('userInfo')),   // { token } or null
    loading: !!storedToken,                                    // auto-login if token exists
  },
  projectToDoVisibility: {
    listIds: JSON.parse(localStorage.getItem('toDoListIds')), // remember collapsed checklists
  },
},
```

**Middleware customization:**

```typescript
middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware({
    serializableCheck: {
      ignoredPaths: ['socketConnection.socket'],     // Socket is non-serializable
      ignoredActions: ['socketConnection/setSocket'],
    },
  }),
```

**Cross-slice communication:** The `projectDataTitleUpdate` action (created via `createAction`) is listened to by both `userLoginSlice` (updates project title in `userInfo.projectsCreated/Joined`) and `projectSetCurrentSlice` (updates current project title), using `extraReducers`.

### 6.5 Detailed Walkthrough: Creating a Task

```
1. User types title in <AddInput> → clicks "Add"
         │
2. Component calls:
   dispatch(projectTaskAdd(projectId, listId, title, callback))
         │
3. projectTaskAdd thunk (projectActions.ts):
   ├── Gets socket + userInfo from getState()
   │
   ├── isFakeMode()?
   │   ├── YES:
   │   │   ├── Create optimistic Task object with uuid()
   │   │   ├── dispatch(projectDataAddTask({ listId, task }))
   │   │   └── callback()                               ← clears input
   │   │
   │   └── NO:
   │       └── socket.emit('add-task', { projectId, listId, title }, callback)
   │           │
   │           ├── Server creates Task in MongoDB
   │           ├── Server broadcasts to room: io.to(projectId).emit('new-task', { listId, task })
   │           │
   │           └── Board.tsx listener:
   │               socket.on('new-task', (data) =>
   │                 dispatch(projectDataAddTask(data))
   │               )
   │
4. projectDataAddTask reducer (projectSlice.ts):
   ├── _.cloneDeep(state)
   ├── Find list by listId
   ├── list.tasks.push(task)
   └── Return new state
         │
5. useAppSelector re-renders ListItem → new Task card appears
```

### 6.6 Detailed Walkthrough: Drag & Drop Task Move

```
1. User drags task card from List A to List B
         │
2. @hello-pangea/dnd fires onDragEnd(result) in Lists.tsx
   ├── type = 'TASK'
   ├── source: { droppableId: "0", index: 1 }      ← list 0, position 1
   ├── destination: { droppableId: "1", index: 0 }  ← list 1, position 0
         │
3. Cross-list detected → two dispatches:
   ├── dispatch(projectTaskMove({ removedIndex: 1, addedIndex: null }, 0, projectId, task))
   │   └── No 'added' in store yet → stores { removed: { listIndex: 0, index: 1 } }
   │
   └── dispatch(projectTaskMove({ removedIndex: null, addedIndex: 0 }, 1, projectId, task))
       └── Finds 'removed' in store → calls emitTaskMove():
           ├── dispatch(projectDataMoveTask({ added, removed, task }))
           │   └── Reducer: splice task out of list[0], splice into list[1]
           ├── socket.emit('task-move', { added, removed, taskId, projectId })
           └── dispatch(projectTaskMoveReset())
         │
4. Server receives 'task-move':
   ├── Updates MongoDB document order
   └── Broadcasts 'lists-update' with new lists to all room members
         │
5. Other clients receive 'lists-update':
   └── dispatch(projectDataUpdateLists(data.newLists))
```

### 6.7 Detailed Walkthrough: Login

```
1. User submits email + password on Login.tsx
         │
2. dispatch(login(email, password))
         │
3. login thunk (userActions.ts):
   ├── dispatch(userLoginRequest())                    ← { loading: true }
   │
   ├── isFakeMode()?
   │   ├── YES → data = await fakeLogin()             ← returns mock User + Notifications
   │   └── NO  → data = (await apiClient.post('/api/users/login', { email, password })).data
   │
   ├── socket = connectSocket(data.userInfo.token)
   │   ├── Fake: returns no-op stub
   │   └── Real: io(API_URL, { auth: { authorization: Bearer <token> } })
   │
   ├── socket.on('connect', () => {
   │     dispatch(socketConnectSuccess(socket))
   │     dispatch(userLoginSuccess(data))              ← { userInfo, notifications }
   │     socket.emit('join-notifications', { room: userId })
   │   })
   │
   ├── (Fake mode: dispatch directly since socket.on won't fire)
   │
   └── localStorage.setItem('userInfo', JSON.stringify({ token }))
         │
4. App.tsx sees userInfo populated:
   ├── PrivateRoute now allows access to /boards, /project/:id
   │
   └── App.tsx useEffect registers global socket listeners:
       ├── 'notifications-updated' → getUpdatedNotifications()
       ├── 'user-updated'          → userDataUpdate()
       ├── 'auth-error'            → logout()
       └── 'user-removed-from-project' → userRemoved()
         │
5. On next app load:
   ├── store.preloadedState reads { token } from localStorage
   ├── userLogin starts as { loading: true, userInfo: { token } }
   └── App.tsx useEffect: if userInfo has only token → dispatch(getUserData(token))
       └── Re-validates with server, re-connects socket, re-populates full userInfo
```

---
