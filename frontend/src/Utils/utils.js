import { toast } from 'react-toastify';

export const handleSuccess = (msg) => {
    toast.dismiss();  // Dismiss any previous toasts
    toast.success(msg, {
        position: 'top-right',
        toastId: 'success-toast'
    });
};

export const handleError = (msg) => {
    toast.dismiss();  // Dismiss any previous toasts
    toast.error(msg, {
        position: 'top-right',
         toastId: 'error-toast'
    });
};
