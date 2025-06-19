import { toast, ToastOptions } from 'react-toastify';

// Default toast options that match your app's style
const defaultOptions: ToastOptions = {
  position: 'bottom-right',
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: 'dark',
};

// Success toast
export const showSuccess = (message: string, options?: ToastOptions) => {
  toast.success(message, { ...defaultOptions, ...options });
};

// Error toast
export const showError = (message: string, options?: ToastOptions) => {
  toast.error(message, { ...defaultOptions, ...options });
};

// Warning toast
export const showWarning = (message: string, options?: ToastOptions) => {
  toast.warning(message, { ...defaultOptions, ...options });
};

// Info toast
export const showInfo = (message: string, options?: ToastOptions) => {
  toast.info(message, { ...defaultOptions, ...options });
};

// Generic toast
export const showToast = (message: string, options?: ToastOptions) => {
  toast(message, { ...defaultOptions, ...options });
};

// Promise toast - useful for async operations
export const showPromiseToast = <T>(
  promise: Promise<T>,
  messages: {
    pending: string;
    success: string;
    error: string;
  },
  options?: ToastOptions,
) => {
  return toast.promise(
    promise,
    {
      pending: messages.pending,
      success: messages.success,
      error: messages.error,
    },
    { ...defaultOptions, ...options },
  );
};

// Dismiss all toasts
export const dismissAllToasts = () => {
  toast.dismiss();
};

// Dismiss specific toast by ID
export const dismissToast = (toastId: string | number) => {
  toast.dismiss(toastId);
};
