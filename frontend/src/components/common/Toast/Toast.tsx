// src/components/common/Toast.tsx

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  id?: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
  onClose: (id: string) => void;
}

const toastStyles: Record<ToastType, { bg: string; icon: string; border: string }> = {
  success: {
    bg: 'bg-green-50',
    icon: 'text-green-500',
    border: 'border-green-500',
  },
  error: {
    bg: 'bg-red-50',
    icon: 'text-red-500',
    border: 'border-red-500',
  },
  warning: {
    bg: 'bg-yellow-50',
    icon: 'text-yellow-500',
    border: 'border-yellow-500',
  },
  info: {
    bg: 'bg-blue-50',
    icon: 'text-blue-500',
    border: 'border-blue-500',
  },
};

const icons: Record<ToastType, string> = {
  success: '✅',
  error: '❌',
  warning: '⚠️',
  info: 'ℹ️',
};

export const Toast: React.FC<ToastProps> = ({
  id = '',
  type,
  title,
  message,
  duration = 5000,
  onClose,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, id, onClose]);

  const style = toastStyles[type];

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className={`${style.bg} border-l-4 ${style.border} rounded-lg shadow-lg p-4 max-w-md w-full`}
    >
      <div className="flex items-start gap-3">
        <span className={`text-2xl ${style.icon}`}>{icons[type]}</span>
        <div className="flex-1 min-w-0">
          {title && <p className="font-semibold text-[#0F172A]">{title}</p>}
          <p className="text-sm text-[#475569]">{message}</p>
        </div>
        <button
          onClick={() => onClose(id)}
          className="flex-shrink-0 p-1 rounded-lg hover:bg-[#F8F2EC] transition-colors text-[#94A3B8] hover:text-[#475569]"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </motion.div>
  );
};

export const ToastContainer: React.FC<{
  toasts: (ToastProps & { id: string })[];
  onRemove: (id: string) => void;
}> = ({ toasts, onRemove }) => {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3 max-w-md w-full">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            id={toast.id}
            type={toast.type}
            title={toast.title}
            message={toast.message}
            duration={toast.duration}
            onClose={onRemove}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Toast;