export type ToastVariant = 'info' | 'success' | 'warning' | 'error';

export interface ToastOptions {
  /** Text to display */
  message: string;
  /** Visual style (default: 'info') */
  variant?: ToastVariant;
  /** Auto-dismiss duration in ms (default: 3500) */
  duration?: number;
}

export interface ToastItem extends Required<ToastOptions> {
  id: string;
}
