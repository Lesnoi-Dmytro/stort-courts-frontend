# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start dev server with HMR (http://localhost:5173)
- `npm run build` — production build (outputs to `build/client` and `build/server`)
- `npm run start` — serve the production build via `react-router-serve`
- `npm run typecheck` — regenerate React Router types (`react-router typegen`) then run `tsc`
- `npm run format` / `npm run format:check` — Prettier (with `prettier-plugin-tailwindcss` for class sorting)

There is no test runner or lint script configured in `package.json`.

## Architecture

This is a React Router v8 (framework mode, SSR-capable) app using Tailwind CSS v4 and Radix UI Themes, bootstrapped from the official React Router template. Node server entry is `@react-router/serve`; the Docker image runs `npm run start`.

### Routing

Routes are declared centrally in `app/routes.ts` (not file-based routing) using `@react-router/dev/routes` helpers (`index`, `layout`, `route`). Route path strings always come from `app/shared/const/paths.ts` (`Paths`), never hardcoded — add new paths there first, then reference `Paths.X` in `routes.ts` and in components/links.

Two layout branches wrap all routes:
- `routes/layouts/auth.tsx` — for `/auth/sign-in`, `/auth/sign-up`. Redirects to `DEFAULT_PATH` if a user is already authenticated.
- `routes/layouts/main.tsx` — for authenticated app pages (e.g. `/courts`), renders the header with `ThemeSwitch` and `UserMenu`.

Route modules live under `app/routes/<area>/*.tsx`; the page's own feature logic/components live under `app/features/<area>/*` (e.g. `app/features/auth/SignInForm.tsx`) and are imported into the route module.

### Auth

`AuthProvider` (`app/shared/context/auth-context.tsx`) wraps the whole app in `root.tsx` and holds `{ user, isLoading, refresh, logout }` via `useAuth()`. On mount it calls `AuthService.me()` to hydrate the current user; `AuthService.logout()` clears it. Layouts read `useAuth()` to decide redirects — this means auth state is client-side/SSR-rerendered, not loader-based.

### HTTP layer

All backend calls go through `app/services/http/`:
- `config.ts` creates a shared `axios` instance (`http`) with `baseURL = <http|https>://${VITE_API_ORIGIN}/api` (`https` when `VITE_API_SECURE=true`), `withCredentials: true` (cookie-based sessions), and a response interceptor that redirects to `Paths.SIGN_IN` on a 401 — unless the request config sets `skipAuthRedirect: true` (an augmented `AxiosRequestConfig` field), which auth endpoints themselves use to avoid redirect loops.
- `api-paths.ts` (`ApiPaths`) centralizes backend endpoint strings, mirroring the `Paths` pattern for frontend routes.
- Per-domain services (e.g. `auth/auth.service.ts`) wrap `http` calls and return typed DTOs/domain types from `app/shared/types`. Follow this pattern for new API domains: add paths to `ApiPaths`, create `services/http/<domain>/<domain>.service.ts`, export it from `services/http/index.ts`.

Read methods accept an optional `RequestOptions` (`{ signal }`, from `config.ts`) as the last argument so callers can abort with an `AbortController`.

`VITE_API_ORIGIN` (host and port, no scheme, e.g. `localhost:3000`) and `VITE_API_SECURE` (`true`/`false`) are read from `.env` and must point at the backend API.

### Forms

Forms use `react-hook-form` + `zod` via `@hookform/resolvers`. Validation schemas live in `app/schemas/` (e.g. `auth.ts`), and DTO/domain types are derived from them in `app/shared/types`. `app/shared/components/forms/FormField.tsx` is the shared field wrapper — use it instead of building raw inputs per form.

### Theming

Radix `<Theme accentColor="green">` wraps the app in `root.tsx`. Light/dark mode is handled manually (not by Radix) in `app/shared/lib/theme.ts`: `themeInitScript` is inlined into `<head>` via `dangerouslySetInnerHTML` to set the `light`/`dark` class on `<html>` before first paint (avoids flash of wrong theme), and `getStoredTheme`/`applyTheme`/`storeTheme` manage the `localStorage` value afterward (`ThemeSwitch` component). Theme preference is `light | dark | system`; `system` is represented by *absence* of the `localStorage` key.

### Path aliasing

`~/*` maps to `./app/*` (see `tsconfig.json`). Use `~/...` imports rather than deep relative paths.

### Code style

Use `async`/`await` instead of `.then()`/`.catch()` chains unless it is absolutely necessary. This applies especially to `useEffect`: effect callbacks can't be `async`, so define an `async` function (or `useCallback`) and call it from the effect, using an `AbortController` for cleanup.
