interface ToastMessage {
  title: string;
  description?: string;
}

export const showToast = {
  success: ({ title, description }: ToastMessage) => ({
    title,
    description,
    variant: 'success',
  }),
  
  error: ({ title, description }: ToastMessage) => ({
    title,
    description: description || 'Une erreur est survenue',
    variant: 'destructive',
  }),

  warning: ({ title, description }: ToastMessage) => ({
    title,
    description,
    variant: 'warning',
  }),

  info: ({ title, description }: ToastMessage) => ({
    title,
    description,
    variant: 'default',
  }),
};
