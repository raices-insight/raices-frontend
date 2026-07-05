import { LogBox } from 'react-native';

/**
 * Patches console.warn to suppress known, unfixable upstream library warnings
 * that would otherwise flood the dev terminal.
 *
 * Each suppressed warning is documented with the root cause so we can remove
 * the filter once the upstream library ships a fix.
 */

const SUPPRESSED_WARNINGS: readonly RegExp[] = [
  /**
   * react-native-web v0.21.x internally passes `pointerEvents` as a prop to
   * DOM elements. React 19 deprecated this in favour of `style.pointerEvents`.
   * Root: react-native-web/dist/exports/View/index.js:111
   * Fixed in: react-native-web v0.22+ (blocked by Expo 54 pinning ~0.21.0)
   */
  /props\.pointerEvents is deprecated/,
];

const _originalWarn = console.warn.bind(console);

console.warn = (...args: unknown[]) => {
  const message = typeof args[0] === 'string' ? args[0] : '';
  if (SUPPRESSED_WARNINGS.some((pattern) => pattern.test(message))) {
    return;
  }
  _originalWarn(...args);
};

// Disable all on-screen toasts during E2E testing
if (process.env.EXPO_PUBLIC_E2E_TESTING === 'true') {
  LogBox.ignoreAllLogs(true);
}
