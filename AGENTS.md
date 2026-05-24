# Frontend Assistant Module Guidelines

This document establishes the UI patterns, design system, and coding standards for components interacting with the Assistant and audio subsystems in the `raices-frontend`.

## 🎨 Design System & Colors

When building audio recording or assistant-related interfaces, strictly adhere to the following color scheme and Tailwind classes:

*   **Primary Green (Active/Idle state):** `#325F3F` (`bg-raices-primary` or custom `#325F3F` for recording button).
*   **Secondary Green (Accent/Labels):** `#53815F` (`text-raices-secondary`, `bg-raices-secondary/10`).
*   **Recording Active Red (Stop state):** `#C0392B` (`bg-raices-error` or custom `#C0392B`).
*   **Card Backgrounds:** `bg-raices-surface` (with `rounded-3xl` and `shadow-sm`).
*   **Typography Colors:** `text-raices-text` (primary), `text-raices-text-muted` (secondary description).

## 🔤 Typography & Fonts

*   **Headlines & Action Labels:** Use `font-headline font-bold`.
*   **Body & Descriptive Text:** Use `font-body` (optionally `text-sm` or `italic`).

## 🔘 Buttons & Interactions (Vercel React Native Skills)

*   **No TouchableOpacity:** Always use `Pressable` (from `@/core/ui/tw` or `react-native`) for touch feedback to ensure performance and native feel.
*   **Icons:** Use `IconSymbol` for consistent SF Symbols / Material icons representation (e.g. `mic.fill`, `stop.fill`, `checkmark`, `play.fill`, `calendar`).
*   **Activity Feedback:** Show `<ActivityIndicator color="#FFFFFF" size="large" />` inside buttons when operations (uploading/saving) are in progress.
*   **Cooldowns:** Implement a 1-second cooldown when starting recording to prevent UI jitter or race conditions.

## 🌀 Animations (Reanimated)

Animations must only touch GPU-accelerated properties (`transform` and `opacity`):

```typescript
const pulseScale = useSharedValue(1);
const pulseOpacity = useSharedValue(0);

// Inside useEffect when recording is active:
pulseScale.value = withRepeat(
  withSequence(
    withTiming(1.22, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
    withTiming(1,    { duration: 1000, easing: Easing.inOut(Easing.ease) })
  ),
  -1, true
);
```

Ensure `cancelAnimation(pulseScale)` and `cancelAnimation(pulseOpacity)` are called in the cleanup function of `useEffect` to prevent memory leaks.

## 🪵 Logging & Toast

*   **Logging:** Use `logger.info` and `logger.error` from `@/core/logger` for state transition tracking (e.g. `Recording started`, `Uploading audio`).
*   **Toasts:** Use `useToast` hook for user notifications:
    *   `toast.success("¡Respuesta enviada con éxito!")`
    *   `toast.error("No se pudo iniciar la grabación.")`
