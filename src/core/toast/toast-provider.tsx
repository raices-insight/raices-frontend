import React, {
  createContext,
  useCallback,
  useContext,
  useState,
  type PropsWithChildren,
} from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { type ToastItem, type ToastOptions } from './types';
import { ToastRenderer } from './toast-renderer';

// --- Context ------------------------------------------------------------------

interface ToastContextValue {
  show: (options: ToastOptions) => void;
  toasts: ToastItem[];
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

// --- Inner component (reads insets inside the provider tree) ------------------

let _nextId = 0;

function ToastProviderInner({ children }: PropsWithChildren) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  // Read insets here, where SafeAreaProvider is guaranteed to be an ancestor
  const { top: topInset } = useSafeAreaInsets();

  const show = useCallback((options: ToastOptions) => {
    const item: ToastItem = {
      id: String(++_nextId),
      message: options.message,
      variant: options.variant ?? 'info',
      duration: options.duration ?? 3500,
    };
    setToasts((prev) => [...prev, item]);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ show, toasts, dismiss }}>
      {children}
    </ToastContext.Provider>
  );
}

// --- Public Provider ----------------------------------------------------------

export function ToastProvider({ children }: PropsWithChildren) {
  return <ToastProviderInner>{children}</ToastProviderInner>;
}

// --- Internal hook (used by useToast) ----------------------------------------

export function useToastContext(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a <ToastProvider>.');
  }
  return ctx;
}
