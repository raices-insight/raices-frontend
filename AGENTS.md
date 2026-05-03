# Frontend Agent Standards (Raíces Project)

This file serves as the definitive guide for any AI assistant or developer working on the `raices-frontend` codebase. You must adhere to these rules strictly to maintain architectural cohesion.

## 1. Feature-Driven Architecture
- All domain-specific code belongs in `src/features/<feature-name>`.
- Internal structure of a feature:
  - `api/`: API clients, Zod schemas, and hooks that fetch/mutate data.
  - `components/`: UI components specific to the feature.
  - `hooks/`: Custom React hooks specific to the feature logic (e.g., `useDashboardSocket`).
- Avoid putting feature-specific logic in `src/core`. Core is reserved for strictly global utilities (like `api/client.ts`, `logger.ts`, `ui/button.tsx`).

## 2. Styling (NativeWind v5 & Global CSS)
- **CSS Variables:** All colors, fonts, and global variables must be defined in `src/global.css` using the `--color-raices-*` prefix.
- **Tailwind Classes:** Use NativeWind classes exclusively. Do not use `StyleSheet.create` unless absolutely necessary (e.g., for complex reanimated styles).
- **Responsive Design:** Avoid hardcoding widths and heights (e.g., `w-[300px]`, `h-[800px]`). Build fluid layouts using `flex-1`, `w-full`, `justify-*`, and margins/paddings (`p-4`, `gap-2`).
- **Typography:** Always use the `<Text>` component exported from `@/core/ui/tw`. Use `font-headline` and `font-body` classes for consistency.

## 3. Data Validation (Zod)
- **Always Validate External Data:** Any data coming from the backend (REST or WebSockets) MUST be validated using Zod schemas.
- **Strict Mode:** Use `.strict()` on all object schemas to reject unexpected fields and prevent API drift.
- **Safe Parsing:** Use `.safeParse()` instead of `.parse()` to handle validation errors gracefully without crashing the app.

## 4. Error Handling & Traceability
- **DO NOT** use `console.log` or `console.error` directly.
- **Logger:** Use the exported `logger` from `@/core/logger` for system logs, debugging, and tracing (`logger.info`, `logger.error`).
- **Toast:** Use the `useToast` hook from `@/core/toast/use-toast` to provide visible feedback to the user (`toast.error('message')`, `toast.success('message')`).
- **Pattern:** When an operation fails, log the technical details using `logger.error`, and show a user-friendly message using `toast.error`.

## 5. UI Extensibility
- Views should allow natural vertical scrolling (`ScrollView`). Do not enforce rigid `flex-1` boundaries on screens that might need to render dynamic content below the fold.

## 6. API & Network Management
- **Axios Client:** Always use the global `apiClient` exported from `@/core/api/client` for REST requests. This ensures that global configurations like `baseURL`, `timeout` (default 20s), and future interceptors are applied.
- **DO NOT** use native `fetch` or create ad-hoc axios instances for standard domain requests.
- **Cancellations:** Use `AbortController` (passed via the `signal` option in axios) for any request inside a `useEffect` to ensure cleanup and avoid memory leaks.
- **Timeouts:** Global timeout is set to 20 seconds. If a specific request needs more time (e.g., file upload), override the `timeout` property in the individual request config.
