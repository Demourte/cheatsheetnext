"use client";

import { Toaster, toast } from 'react-hot-toast';
import { createContext, useContext } from 'react';

// Define the toast context type
type ToastContextType = {
  showToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
};

// Create the context
const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Create a provider component
export function ToastProvider({ children }: { children: React.ReactNode }) {
  // Function to show toast with different styles based on type
  const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    switch (type) {
      case 'success':
        toast.success(message);
        break;
      case 'error':
        toast.error(message);
        break;
      case 'warning':
        toast(message, {
          icon: '⚠️',
          style: {
            backgroundColor: '#fff7cd',
            color: '#7a4f01',
          },
        });
        break;
      case 'info':
      default:
        toast(message);
        break;
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toaster 
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: '8px',
            padding: '12px 16px',
          },
          success: {
            style: {
              backgroundColor: '#e8f5e9',
              color: '#1b5e20',
            },
          },
          error: {
            style: {
              backgroundColor: '#ffebee',
              color: '#c62828',
            },
          },
        }}
      />
    </ToastContext.Provider>
  );
}

// Create a hook to use the toast context
export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
