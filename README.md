# AstraOS

AstraOS is a futuristic browser-based Web OS built with React, TypeScript, Tailwind CSS, and Framer Motion. It runs entirely in the browser as a local-first operating system simulation with draggable windows, workspaces, personalization, built-in apps, widgets, PWA caching, and persistent settings.

## Features

- Animated boot screen, lock screen, desktop, taskbar/dock, launcher, command palette, notification center, widgets, and right-click menu.
- Draggable and resizable glass windows with multi-window support, snap layouts, minimize/restore, z-ordering, and workspace switching.
- Built-in apps: Browser, Assistant, File Manager, Terminal, Calculator, Notes, Music, Weather, Clock, Calendar, Settings, Store, Gallery, Video, and Games.
- Local persistence under `astraos.v1` for settings, windows, notes, calendar events, files, notifications, wallpapers, widgets, and personalization choices.
- Original wallpapers and installable PWA metadata with a simple service worker app shell cache.
- Keyboard shortcuts: `Ctrl+K` opens command search, `Ctrl+Space` opens the launcher, `Ctrl+Alt+Left/Right` switches workspaces, and `Alt+1..5` opens pinned apps.

## Getting Started

```bash
npm install
npm run dev
```

Open the local Vite URL shown in the terminal.

## Firebase Authentication

The app uses Firebase v9+ modular SDK for email/password auth, Google sign-in, persisted sessions, and Firestore profile documents.

Create a `.env` file from `.env.example` and fill in the web app values for the existing Firebase project `astra-os-5e622`:

```bash
cp .env.example .env
```

Enable these providers in Firebase Authentication:

- Email/Password
- Google

Registration writes a profile document to `users/{uid}` with `uid`, `displayName`, `email`, and `createdAt`.

## Production

```bash
npm run build
npm run preview
```

The project is Vercel-ready. Import the repository in Vercel and use the default Vite settings:

- Build command: `npm run build`
- Output directory: `dist`
- Install command: `npm install`

## Scripts

- `npm run dev` starts the development server.
- `npm run build` type-checks and builds the app.
- `npm run test` runs focused Vitest coverage for calculator logic, storage defaults, command routing, and reducer behavior.
- `npm run lint` runs ESLint.

## Structure

```txt
public/
  manifest.webmanifest
  sw.js
  icons/
  wallpapers/
src/
  apps/                 Built-in app modules
  components/shell/     Desktop, taskbar, launcher, overlays
  components/windowing/ Window frame, manager, snap overlay
  components/widgets/   Floating system widgets
  components/ui/        Shared glass controls and icons
  data/                 App definitions, wallpapers, mock content
  hooks/                Pointer, shortcuts, parallax helpers
  lib/                  Storage, commands, calculator, sound
  state/                OS reducer and provider
  styles/               Tailwind and custom visual system
  types/                Shared OS interfaces
```

## Notes

All AI, weather, app store, browser, file system, and media features are local simulations by design. The app does not require an external backend and keeps user preferences in the browser.
