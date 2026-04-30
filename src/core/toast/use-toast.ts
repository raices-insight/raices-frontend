import { useToastContext } from './toast-provider';
import { type ToastOptions } from './types';

/**
 * Hook to trigger global toast notifications from any component.
 *
 * Usage:
 *   const toast = useToast();
 *   toast.info('Uploading audio...');
 *   toast.success('Audio sent!');
 *   toast.warning('Connection slow');
 *   toast.error('Something went wrong');
 *
 * Custom duration:
 *   toast.success('Done!', { duration: 5000 });
 */
export function useToast() {
  const { show } = useToastContext();

  return {
    info:    (message: string, opts?: Omit<ToastOptions, 'message' | 'variant'>) =>
               show({ message, variant: 'info',    ...opts }),
    success: (message: string, opts?: Omit<ToastOptions, 'message' | 'variant'>) =>
               show({ message, variant: 'success', ...opts }),
    warning: (message: string, opts?: Omit<ToastOptions, 'message' | 'variant'>) =>
               show({ message, variant: 'warning', ...opts }),
    error:   (message: string, opts?: Omit<ToastOptions, 'message' | 'variant'>) =>
               show({ message, variant: 'error',   ...opts }),
  } as const;
}
