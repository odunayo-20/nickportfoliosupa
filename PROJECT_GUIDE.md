# Project Guide: Architect Portfolio Manager

This document provides an overview of how to work with this project, its architecture, and best practices for adding new features.

---

## 🏗️ Project Architecture

This is a modern **Next.js 15** application using the **App Router**, integrated with **Supabase** for a full-stack experience.

### 📁 Directory Structure

- **`app/`**: The core of the application.
  - **`(main)/`**: Contains all public-facing pages (Home, Blog, Project display). Uses a shared layout for consistent navigation.
  - **`admin/`**: The administrative dashboard. Highly optimized for mobile and desktop management.
  - **`api/`**: Serverless functions for tasks like visitor tracking and webhooks.
  - **`auth/`**: Login and authentication flows.
- **`actions/`**: **Server Actions**. This is where most database logic lives. Always use these instead of calling Supabase directly from components when possible.
- **`components/`**:
  - **`ui/`**: Base components (Shadcn/UI).
  - **`admin/`**: Specialized components for the dashboard.
- **`lib/`**:
  - `supabaseClient.ts`: Client-side access.
  - `server.ts`: Server-side access (respects RLS/Cookies).
  - `admin.ts`: Service-role access (bypasses RLS for admin tasks).
- **`supabase/migrations/`**: SQL files that define your database schema.

---

## 🛠️ How to Work with the Project

### 1. Adding a New Database Table
1.  Create a new `.sql` file in `supabase/migrations/`.
2.  Define your `CREATE TABLE` and **RLS Policies**.
3.  Apply the SQL in the Supabase SQL Editor.
4.  Create a new file in `actions/` to handle CRUD operations for this table.

### 2. Modifying the Admin Dashboard
The Admin Dashboard uses a **premium design system** characterized by:
- `rounded-[2rem]` or `rounded-[2.5rem]` cards.
- Indigo/Slate color palette.
- **Mobile-first styling**: Use `p-4 sm:p-8` and `grid-cols-1 lg:grid-cols-2`.
- **Reachability**: Always include `pb-32` on main containers to ensure buttons aren't blocked by mobile browser bars.

### 3. Server vs. Client Components
- **Server Components**: Use for data fetching at the page level.
- **Client Components**: Use for interactive parts (forms, toggles, animations). Mark them with `"use client";` at the top.

### 4. Visitor Tracking
Every public page is tracked via the `VisitorTracker` component in the root layout. It hits the `/api/track-visit` endpoint. Data is visible in the **Analytics** tab of the Admin panel.

---

## 🚀 Common Commands

- **`pnpm dev`**: Start the development server.
- **`pnpm build`**: Create a production build (checks for TypeScript errors).
- **`pnpm lint`**: Run code quality checks.

---

## 🎨 Design Principles
- **Aesthetics First**: Use smooth gradients, micro-animations (`motion` / Framer Motion), and high-contrast typography (`font-black`).
- **Standardization**: Use the shared Tailwind tokens found in `app/globals.css`.
- **Consistency**: Ensure all Admin pages use the `animate-in fade-in` entry animations for a fluid feel.
