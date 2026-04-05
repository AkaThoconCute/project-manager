# Project Manager — Features Guide

**Project Manager** is a collaborative Kanban-style project management application that helps teams organize work, track progress, and communicate — all in real time. This document walks you through every feature, from login to advanced collaboration.

---

## Table of Contents

- [Feature Overview](#feature-overview)
- [Getting Started](#getting-started)
  - [Home Page](#home-page)
  - [Registration](#registration)
  - [Email Confirmation](#email-confirmation)
  - [Login](#login)
- [Projects &amp; Boards](#projects--boards)
  - [Viewing Your Projects](#viewing-your-projects)
  - [Creating a New Project](#creating-a-new-project)
  - [Opening a Project](#opening-a-project)
- [Board &amp; Lists](#board--lists)
  - [Board Overview](#board-overview)
  - [Creating Lists](#creating-lists)
  - [Renaming Lists](#renaming-lists)
  - [Reordering Lists](#reordering-lists)
  - [List Actions Menu](#list-actions-menu)
- [Tasks](#tasks)
  - [Creating Tasks](#creating-tasks)
  - [Viewing &amp; Editing a Task](#viewing--editing-a-task)
  - [Moving Tasks Between Lists](#moving-tasks-between-lists)
  - [Task Labels](#task-labels)
  - [Task Description](#task-description)
  - [Deadlines](#deadlines)
  - [To-Do Lists (Checklists)](#to-do-lists-checklists)
  - [Comments](#comments)
  - [Watching a Task](#watching-a-task)
  - [Copying a Task](#copying-a-task)
  - [Archiving &amp; Deleting Tasks](#archiving--deleting-tasks)
- [Collaboration](#collaboration)
  - [Inviting Users](#inviting-users)
  - [Shareable Join Link](#shareable-join-link)
  - [Team Members &amp; Roles](#team-members--roles)
  - [Group Chat](#group-chat)
  - [Notifications](#notifications)
- [Personalization &amp; Settings](#personalization--settings)
  - [Profile Picture](#profile-picture)
  - [Project Theme Color](#project-theme-color)
  - [Project Background](#project-background)
  - [Deleting a Project](#deleting-a-project)
- [Additional Pages](#additional-pages)
  - [Joining via Invite Link](#joining-via-invite-link)
  - [404 — Page Not Found](#404--page-not-found)

---

## Feature Overview

### Highlight Features

These are the core capabilities that define the Project Manager experience:

| Feature                           | Description                                                                               |
| --------------------------------- | ----------------------------------------------------------------------------------------- |
| **Kanban Board**                  | Organize work into customizable lists and task cards, viewed as a horizontal board        |
| **Drag &amp; Drop**               | Rearrange lists and tasks instantly by dragging them to new positions or different lists  |
| **Real-Time Collaboration**       | All changes sync live across every team member's screen — no refresh needed               |
| **Group Chat**                    | Built-in messaging for each project so your team can discuss work without leaving the app |
| **Task Details &amp; Checklists** | Rich task cards with descriptions, to-do lists, deadlines, labels, and comments           |
| **Notifications**                 | Stay informed when tasks are assigned, commented on, or updated                           |
| **Role-Based Permissions**        | Control who can view, edit, or administer each project                                    |
| **Invite &amp; Join Links**       | Add team members by search or share a one-click join link                                 |

### Supporting Features

These complement the highlights and round out the day-to-day workflow:

| Feature                                   | Description                                                                           |
| ----------------------------------------- | ------------------------------------------------------------------------------------- |
| **Email Registration &amp; Confirmation** | Secure sign-up with email verification                                                |
| **Project Backgrounds &amp; Themes**      | Personalize each project with gradient backgrounds, uploaded images, and color themes |
| **Profile Picture**                       | Upload and manage your avatar                                                         |
| **Archived Tasks**                        | Remove tasks from active view without losing them — restore any time                  |
| **Task Copy &amp; Transfer**              | Duplicate tasks or move them between lists with a few clicks                          |
| **Task Watch**                            | Subscribe to individual tasks for personal change notifications                       |
| **Inline Editing**                        | Rename lists, task titles, and project names directly on the board                    |
| **Rich Text Description**                 | Format task descriptions with bold, italic, headings, links, lists, tables, and more  |
| **Multiple Projects**                     | Create and join unlimited projects, each with its own board and team                  |
| **Responsive Design**                     | Usable on desktop and mobile devices with adaptive navigation                         |

---

## Getting Started

### Home Page

When you first visit the app, you'll see a welcoming landing page with a dynamic animated background.

- **New users** — Click **Get Started** to create an account, or click **Sign In** if you already have one.
- **Returning users** — If you're already logged in, the page greets you with _"Welcome back!"_ and a **Boards** button that takes you straight to your projects.

### Registration

1. Click **Get Started** (or **Register** in the navigation bar).
2. Fill in your **Username**, **Email**, and **Password**.
   - Use the eye icon to toggle password visibility.
   - Re-enter the password in the **Confirm Password** field.
3. Click **Sign Up**.
4. An email confirmation code will be sent to your address.

> Already have an account? Click **Sign In** at the bottom of the form.

### Email Confirmation

After registering, check your inbox for a confirmation email.

- Click the link in the email — you'll be taken to a confirmation page that processes automatically.
- On success, you'll see: _"Your registration is complete. Log in with your account details and start a new project!"_
- If something goes wrong, click **Resend Email** and check your inbox again (allow a few minutes).

### Login

1. Enter your **Email** and **Password**.
2. Click **Sign In**.
3. You'll be redirected to your projects dashboard.

> Forgot your password? Use the **Forgot Password** link on the login page.

---

## Projects &amp; Boards

### Viewing Your Projects

After signing in, the **Boards** page shows all your projects organized into two sections:

- **Created Projects** — Projects you own and administer.
- **Joined Projects** — Projects other people invited you to.

Each project appears as a card with its title and custom background. Cards are displayed in a responsive grid that adjusts to your screen size.

### Creating a New Project

1. On the Boards page, click the **Create new project** card — or use the **New Project** button in the sidebar.
2. Enter a project title in the dialog that appears.
3. Click **Create**.
4. You'll be taken directly into your new project's board.

### Opening a Project

Click any project card to open its board. You can also switch projects from the sidebar's project list without going back to the Boards page.

---

## Board &amp; Lists

### Board Overview

Each project has one board — a horizontally scrollable workspace where your work is organized into **lists** (columns). Each list contains **task cards** stacked vertically.

The toolbar at the top of the board provides quick access to:

- **Project title** (click to rename, if you're an admin)
- **Group Chat**
- **Archived Tasks**
- **Settings** (project creator only)
- **Team Members**
- **Invite Users**

### Creating Lists

Scroll to the right end of the board and use the **Add new list** input:

1. Click the input area.
2. Type a name for your list (e.g., _"To Do"_, _"In Progress"_, _"Done"_).
3. Press **Enter** or click the **+** button.
4. The new list appears immediately.

### Renaming Lists

Click any list's title to enter edit mode. Type the new name and press **Enter** to save, or **Escape** to cancel. The change syncs to all team members in real time.

### Reordering Lists

Drag a list by its header and drop it at a new position on the board. All team members see the updated order instantly.

### List Actions Menu

Click the **⋯** (three-dot) icon on any list header to open the actions menu:

| Action                 | What It Does                                                    |
| ---------------------- | --------------------------------------------------------------- |
| **Add Task**           | Focuses the task input at the bottom of the list                |
| **Archive All Tasks**  | Moves every task in the list to the archive (with confirmation) |
| **Transfer All Tasks** | Moves every task to a different list you choose                 |
| **Delete List**        | Permanently removes the list and its tasks (with confirmation)  |

---

## Tasks

### Creating Tasks

At the bottom of any list, click **Add new task**:

1. Type the task title.
2. Press **Enter** or click the **+** button.
3. The card appears at the bottom of the list.

### Viewing &amp; Editing a Task

Click any task card to open its **Task Detail Modal** — a large panel with everything about that task:

| Section            | Details                                              |
| ------------------ | ---------------------------------------------------- |
| **Title**          | Click to edit. Shows creation date and author below. |
| **Labels**         | Colored tags for categorization                      |
| **Assigned Users** | Team members working on this task                    |
| **Description**    | Rich text area for detailed notes                    |
| **Deadline**       | Date picker for due dates                            |
| **To-Do Lists**    | One or more checklists with progress tracking        |
| **Comments**       | Threaded discussion attached to the task             |

A **side panel** on the right provides quick-action buttons (see sections below).

Press **Escape** or click the **✕** button to close.

### Moving Tasks Between Lists

You have two ways to move tasks:

- **Drag &amp; Drop** — Drag a task card from one list and drop it into another. You can also reorder tasks within the same list.
- **Transfer action** — In the task detail modal, click **Transfer** on the side panel, then choose the destination list.

### Task Labels

Labels are colored tags that help you categorize and visually distinguish tasks at a glance.

Available label colors:
🔴 Red · 🟢 Green · 🩵 Cyan · 🔵 Blue · 🟡 Yellow · 🟣 Purple · 🟤 Brown · ⚪ White · ⚫ Black

Labels appear as small colored pills on the task card in the board view and as larger badges inside the task detail modal.

### Task Description

The description area uses a **rich text editor** that supports:

- **Bold**, _Italic_ formatting
- Headings (H1–H3)
- Block quotes
- Links
- Ordered and unordered lists
- Text alignment (left, center, right)
- Tables
- Undo/Redo

Click the description area to start editing. Changes are saved automatically when you click away.

### Deadlines

Set a deadline by clicking the **Deadline** button or the calendar field in the task detail modal.

- Pick a date from the date picker.
- If the deadline is **less than 24 hours away**, the date field turns orange as a visual warning.
- Clear the deadline any time with the clear button.

### To-Do Lists (Checklists)

Each task can have one or more to-do lists (checklists) for tracking sub-steps.

**Creating a checklist:**

1. In the task detail modal side panel, click **To-Do List**.
2. A new checklist appears with an editable title.

**Using checklists:**

- Add items using the input at the bottom of the checklist.
- Check/uncheck items to mark them complete.
- A **progress bar** shows how many items are done (e.g., _"3 of 5 tasks completed"_).
- Click an item's text to edit it inline.
- Hover over an item and click the delete icon to remove it.
- Click **⋯** on the checklist header to rename, collapse, or delete the entire checklist.

### Comments

The comments section at the bottom of the task detail modal lets your team discuss the task.

- Type a comment and press **Enter** or click the send button.
- Each comment shows the author's avatar, username, timestamp, and the message.
- Edit your own comments by clicking **Edit** — an inline editor appears with the current text.
- Delete your own comments via the **Delete** button (with confirmation).
- Edited comments display an _(edited)_ indicator.

### Watching a Task

Click **Watch** in the task's side panel to subscribe to that task. When you're watching:

- You'll receive notifications for any changes to the task.
- The Watch button appears highlighted to indicate it's active.
- Click again to stop watching.

### Copying a Task

Click **Copy** in the task's side panel to duplicate the task:

1. A menu appears listing all available lists.
2. Select the destination list.
3. A copy of the task (with its details) is created in that list.

### Archiving &amp; Deleting Tasks

**Archiving** removes a task from the active board without deleting it:

- Click **Archive** in the task's side panel.
- The task moves to the project's archive.
- Archived tasks show a striped banner reading _"This task is archived"_.

**Restoring** an archived task:

- Open the archived tasks panel (trash icon in the toolbar).
- Find the task and click **Restore**.
- Choose which list to restore it to.

**Permanently deleting** a task:

- You can only delete tasks that have been archived first.
- Open the archived task and click **Delete** — a confirmation dialog appears.
- This action **cannot be undone**.

Quick-delete is also available: hover over a task card on the board and click the delete icon that appears on the right side.

---

## Collaboration

### Inviting Users

Click the **Invite** icon (person with a plus sign) in the project toolbar:

1. Search for users by **username** or **email**.
2. Select a user from the results.
3. They'll be added to the project and receive a notification.

### Shareable Join Link

Instead of searching for individuals, you can share a link:

1. Open the invite menu.
2. Copy the **Join Link**.
3. Share it via email, messaging app, or any channel.
4. Anyone with the link can join your project instantly.
5. As the project creator, you can **activate or deactivate** the link at any time.

### Team Members &amp; Roles

Click the team avatars in the toolbar to view and manage project members.

**Permission levels:**

| Role       | What They Can Do                                                                      |
| ---------- | ------------------------------------------------------------------------------------- |
| **Viewer** | View the board, tasks, and chat — but cannot make changes                             |
| **Member** | Create, edit, move, and archive tasks; participate in chat                            |
| **Admin**  | Everything a Member can do, plus: rename the project, manage members, change settings |

The project **creator** has full control and can:

- Change any member's role
- Remove members from the project
- Access project settings
- Delete the project

### Group Chat

Each project has a built-in group chat for team communication.

- Click the **Chat** icon in the toolbar to open the chat panel.
- The chat appears as a floating window in the bottom-right corner (full screen on mobile).
- Type a message and press **Enter** to send.
- All project members see messages in real time.
- A red dot on the chat icon indicates new unread messages.

### Notifications

The **bell icon** in the sidebar shows your notification count.

**You'll be notified when:**

- You're **assigned** to a task
- Someone **comments** on a task you're watching
- You're **invited** to a project
- A task you're watching is **updated**

**Managing notifications:**

- Click the bell to open the notification panel.
- Each notification shows who did what, in which project, and when.
- Click a notification to navigate to the related task or project.
- Mark all as read, or dismiss individual notifications.
- Notifications are marked as seen automatically when you open the panel.

---

## Personalization &amp; Settings

### Profile Picture

1. In the sidebar, click your avatar.
2. Click the **upload** button on the avatar.
3. Select an image from your device.
4. Your new profile picture is visible to all team members across all projects.

### Project Theme Color

_(Project creator only)_

1. Click the **Settings** (gear) icon in the project toolbar.
2. In the **Color Theme** section, choose from 8 preset colors:
   - Cyan · Black · Green · Dark Teal · Deep Blue · Teal · Dark Red · Purple
3. The theme color applies to interactive elements throughout the project.

### Project Background

_(Project creator only)_

In project settings, customize the board background:

- **Gradient presets** — Choose from 5 built-in gradient options:
  - Blue to Cyan
  - Pastel Pink to Coral
  - Black to Dark Blue
  - Cyan to Purple
  - Dark Background
- **Custom image** — Upload your own background image.

The background is visible to all project members and appears behind the project card on the Boards page.

### Deleting a Project

_(Project creator only)_

1. Open project **Settings**.
2. Scroll to the **Delete Project** section.
3. Click the red **Delete** button.
4. Confirm in the dialog that appears.

> ⚠️ **Warning:** Deleting a project removes it for all members and **cannot be undone**.

---

## Additional Pages

### Joining via Invite Link

When you click an invite link shared by a project creator:

1. The app automatically processes your membership.
2. You're assigned a default background theme.
3. You're redirected to the project's board, ready to work.

> You must be logged in. If not, you'll be prompted to log in first.

### 404 — Page Not Found

If you navigate to a page that doesn't exist, you'll see a friendly **404** message with a button to return to your projects.

---

_This document covers all features available in the Project Manager application. For technical documentation, see the [README](README.md)._
