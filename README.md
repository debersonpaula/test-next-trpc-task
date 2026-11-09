# Task Manager (Next.js + tRPC)

## Overview

A simple task management app built with Next.js (Pages Router) and tRPC. Tasks are kept **in memory** on the server (no database), so restarting the server clears all data.

**Features**
- CRUD for tasks (`id`, `titulo`, `descricao`, `dataCriacao`) exposed through tRPC at `/api/trpc`.
- Validation with `zod`: the title is required; updating or deleting a nonexistent task returns a `NOT_FOUND` error.
- Task list rendered with SSR (first page), plus infinite scroll for the following pages.
- Delete directly from the list, with success/error feedback.
- Create/edit form with client-side validation and loading/error states.

**Structure**
- `src/server/` – tRPC setup, in-memory store and the `task` router.
- `src/pages/api/trpc/[trpc].ts` – tRPC HTTP endpoint.
- `src/pages/index.tsx` – task list (SSR + infinite scroll).
- `src/pages/tarefas/nova.tsx` and `src/pages/tarefas/[id].tsx` – create and edit pages.
- `src/components/TaskForm.tsx` – shared form.
- `src/utils/trpc.ts` – typed client and error-message helper.

## Running locally

**Prerequisites:** Node.js 20+ and Yarn 1.x.

```bash
# install dependencies
yarn install

# start the dev server
yarn dev
```

Open http://localhost:3000.

**Other scripts**

```bash
yarn build   # production build
yarn start   # run the production build
yarn lint    # lint the code
```
