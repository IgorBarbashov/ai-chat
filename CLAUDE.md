# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start Vite dev server
npm run build      # TypeScript type-check + production build
npm run lint       # ESLint check
npm run preview    # Preview production build
```

No test framework is configured yet.

## Tech Stack

- React 19 + TypeScript 5, built with Vite 8
- Mantine 8 for UI components and theming
- react-markdown for message rendering
- Path aliases: `@components`, `@entities`, `@mocks`

## Architecture

The app is a ChatGPT-style interface (targeting GigaChat API). The UI is complete; API integration is not yet implemented.

**Component structure** lives in `src/components/`, organized by feature:

- `layout/AppLayout` — root shell (Mantine AppShell), manages sidebar open/close state
- `sidebar/` — chat list with search, `ChatItem`/`ChatList`/`SearchInput` sub-components
- `chat/ChatWindow` — main chat area, uses `useChatMessages` hook to load messages by `activeChatId`
- `chat/MessageList` — renders message list with loading state
- `chat/Message` — renders a single message with markdown and a copy button
- `chat/InputArea` — message input, uses `useInputArea` hook; send logic is a placeholder (`console.log`)

**Data models** are in `src/entities/chat/`. Mock data is in `src/mocks/chats.ts`.

**Data flow**: `AppLayout` holds `activeChatId` state and passes it to both the sidebar (for selection) and `ChatWindow` (for loading messages). `useChatMessages` currently returns mock data synchronously.

## Component Conventions

From `docs/rules.md`:

- File naming: `ComponentName.tsx`, `componentName.models.ts`, `componentName.module.css`
- Custom hooks: `useHookName.ts` (one file each, or grouped in a `hooks/` subfolder with `index.ts`)
- Each component folder exports a public API via `index.ts`
- Use `@components` / `@entities` / `@mocks` aliases for cross-component imports; use relative imports within the same component folder

## What's Not Implemented Yet

- GigaChat API calls (OAuth + chat completions) — see `docs/product-spec.md` for API details
- SSE streaming for responses
- `localStorage` persistence for chat history
- File attachment handling (placeholder in `useInputArea`)

## Working Rules

- **Plan first**: for any non-trivial feature, propose a plan and wait for approval before coding.
- **No new dependencies** without explicit justification — exhaust Mantine and existing packages first.
- **Before closing a task**: run `npm run lint` and `npm run build`; fix all errors before reporting done.
- **Follow existing architecture**: component folder structure, file naming, path aliases, and hook patterns as defined in `docs/rules.md`.

## Project Docs

- `docs/product-spec.md` — original assignment (GigaChat API details, feature requirements)
- `docs/rules.md` — component conventions and file naming rules
- `docs/functional-spec.md` — functional requirements
- `docs/ui-spec.md` — UI/UX specification
- `docs/architecture.md` — architecture decisions and data flow
- `docs/roadmap.md` — implementation phases and status
- `docs/tasks/` — per-task notes
