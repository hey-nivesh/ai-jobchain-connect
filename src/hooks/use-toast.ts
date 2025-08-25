import { useCallback, useState } from 'react';

interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToastById = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const scheduleToastRemoval = useCallback((id: string, delay = 5000) => {
    setTimeout(() => removeToastById(id), delay);
  }, [removeToastById]);

  const toast = useCallback(({ title, description, variant = 'default' }: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).slice(2, 11);
    const newToast: Toast = { id, title, description, variant };
    
    setToasts(prev => [...prev, newToast]);
    
    // Auto-remove toast after 5 seconds
    scheduleToastRemoval(id);
  }, [scheduleToastRemoval]);

  const dismiss = useCallback((id: string) => {
    removeToastById(id);
  }, [removeToastById]);

  return { toast, toasts, dismiss };
};
