'use client';

import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { useToast } from '@/lib/context/ToastContext';

export function Toast() {
  const { toasts, removeToast } = useToast();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  const icons = {
    success: <CheckCircle size={18} color="var(--color-success)" />,
    error: <AlertCircle size={18} color="var(--color-error)" />,
    info: <Info size={18} color="var(--color-accent-cyan)" />,
  };

  const borderColors = {
    success: 'var(--color-success)',
    error: 'var(--color-error)',
    info: 'var(--color-accent-cyan)',
  };

  const toastContainer = (
    <div
      style={{
        position: 'fixed',
        bottom: 'var(--space-6)',
        right: 'var(--space-6)',
        zIndex: 400, // var(--z-toast)
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-3)',
        pointerEvents: 'none',
        maxWidth: '380px',
        width: 'calc(100% - var(--space-12))',
      }}
    >
      <AnimatePresence>
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 'var(--space-3)',
              padding: 'var(--space-4)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-md)',
              borderLeft: `4px solid ${borderColors[toast.type]}`,
              pointerEvents: 'auto',
            }}
            className="glass"
          >
            <div style={{ flexShrink: 0, marginTop: '2px' }}>{icons[toast.type]}</div>
            <div
              style={{
                flexGrow: 1,
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-medium)',
                lineHeight: 1.4,
                color: 'var(--color-text-primary)',
              }}
            >
              {toast.message}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              style={{
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '20px',
                height: '20px',
                cursor: 'pointer',
                color: 'var(--color-text-secondary)',
                opacity: 0.7,
                transition: 'opacity var(--transition-fast)',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '0.7')}
            >
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );

  return createPortal(toastContainer, document.body);
}

export default Toast;
