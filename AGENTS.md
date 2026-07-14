# Cosmos App AI Instructions

## What this project is
- A small Vite-based front-end app using Solid.js and TypeScript.
- The app lives in `src/` and is built with `vite` plus `vite-plugin-solid`.
- There is also a Python backend at `backend/main.py` using FastAPI, but the frontend repo currently has no dedicated npm script for running it.

## Priority rules
- 1) Preserve TypeScript type safety and Vite build compatibility.
- 2) Do not modify `package.json` unless a reproducible build or runtime error requires it; when modifying, include a one-line justification and limit changes to added scripts or dependency versions only.
- 3) Limit changes to at most 3 files and avoid altering existing public APIs; only add code when it does not change behavior for existing functionality.
- 4) Follow Solid.js idioms.

If two rules conflict, follow the lower-numbered rule.

## Primary commands

- `npm install` — install dependencies
- `npm run dev` — start the frontend local dev server
- `npm run build` — compile TypeScript and create a production build
- `npm run preview` — preview the production build locally

## Key implementation notes

- The codebase uses Solid.js components and reactivity. For example, `src/App.tsx` uses `createSignal` and `<For>`.
- TypeScript is strict and uses `jsxImportSource: "solid-js"` in `tsconfig.json`.
- `vite.config.ts` includes `solidPlugin()` and builds to `dist`.
- The repo contains a `backend/main.py` FastAPI app, but the repo does not currently expose a Python backend launch script in `package.json`.
- The type declaration file is at `src/vite-env.d.ts` (not a nested path) for Vite environment types.

## What to avoid
- Do not assume this is a React app just because `react` and `react-dom` appear in `package.json`; the current source is Solid.js.
- Avoid introducing build tooling or frameworks that conflict with Vite + Solid.
- Do not modify `package.json` unless a reproducible build or runtime error requires it; when modifying, include a one-line justification and limit changes to added scripts or dependency versions only.

## Suggested AI behavior
- Limit changes to at most 3 files and avoid altering existing public APIs; only add code when it does not change behavior for existing functionality.
- If adding new frontend code, follow Solid.js idioms: prefer signals (`createSignal`), `<For>` for lists, avoid React hooks such as `useState` and `useEffect`, and use `jsxImportSource: 'solid-js'` as in `tsconfig.json`.
- By default, treat `backend/main.py` as an independent FastAPI service. Only modify the frontend build pipeline or add integration if the user explicitly asks for backend/frontend wiring.
- Verify the framework by checking for Solid imports (for example, `from 'solid-js'` or `import { createSignal } from 'solid-js'`) and Solid-specific files before refactoring; if evidence conflicts, report the discrepancy and ask the user.
- If asked to provide a backend run command, add an npm script `start:backend` that runs the FastAPI app via `uvicorn` and document it in `README.md`; only modify `package.json` after user confirmation.
- If a dependency upgrade is required to build, update `package.json` and include a brief changelog entry plus a reproducible build/test confirming the fix.
- If a proposed change causes a build failure, revert the change and report the full build error plus a proposed minimal fix. Do not leave the repo in a broken state.
- After changes, run `npm run build` and `npm run dev` smoke tests and report any TypeScript errors. Include exact commands and expected success criteria.
- If TypeScript errors appear after edits, run `tsc --noEmit`, capture errors, and either fix them or revert changes; report the error list and chosen resolution.

## Helpful files
- `package.json` — scripts and dependencies
- `tsconfig.json` — TypeScript settings for Solid and Vite
- `vite.config.ts` — Vite build configuration
- `src/App.tsx` — main UI component example
- `backend/main.py` — optional backend service

winget install GitHub.Copilot
