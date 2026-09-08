import React from 'react';
import { useToast } from '../../context/ToastContext';
import { X, CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import './Toast.css';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast-card toast-${toast.type || 'info'} slide-in-up`}>
          <div className="toast-icon">
            {toast.type === 'success' && <CheckCircle2 size={18} />}
            {toast.type === 'alert' && <AlertTriangle size={18} />}
            {toast.type === 'info' && <Info size={18} />}
          </div>
          <div className="toast-content">
            <p className="toast-title">{toast.title}</p>
            {toast.description && <p className="toast-desc">{toast.description}</p>}
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="toast-close"
            aria-label="Dismiss notification"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};
