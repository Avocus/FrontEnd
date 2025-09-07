declare module 'sonner' {
    interface ToastOptions {
        title?: string;
        description?: string;
        duration?: number;
        variant?: 'default' | 'success' | 'error' | 'warning' | 'info';
    }

    interface Toast {
        (message: string, options?: ToastOptions): void;
        success(message: string, options?: ToastOptions): void;
        error(message: string, options?: ToastOptions): void;
        warning(message: string, options?: ToastOptions): void;
        info(message: string, options?: ToastOptions): void;
    }

    interface ToasterProps {
        richColors?: boolean;
        position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center';
    }

    export function Toaster(props?: ToasterProps): JSX.Element;
    const toast: Toast;
    export default toast;
} 