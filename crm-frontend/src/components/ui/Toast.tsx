'use client';

import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { useToast } from '@/lib/context/ToastContext';

const ICON_MAP = {
  success: { icon: CheckCircle, color: '#16A34A' },
  error: { icon: AlertCircle, color: '#E8382F' },
  info: { icon: Info, color: '#3B82F6' },
};

export function Toast() {
  const { toasts, removeToast } = useToast();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  const container = (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 500,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        pointerEvents: 'none',
        maxWidth: '380px',
        width: 'calc(100% - 48px)',
      }}
    >
      <AnimatePresence>
        {toasts.map(toast => {
          const config = ICON_MAP[toast.type];
          const Icon = config.icon;
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: '14px 16px',
                borderRadius: '8px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                borderLeft: `4px solid ${config.color}`,
                pointerEvents: 'auto',
                background: '#fff',
                border: '1px solid #E5E7EB',
              }}
            >
              <div style={{ flexShrink: 0, marginTop: '1px' }}>
                <Icon size={18} color={config.color} />
              </div>
              <div
                style={{
                  flexGrow: 1,
                  fontSize: '13px',
                  fontWeight: 500,
                  lineHeight: 1.4,
                  color: '#1F2937',
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
                  color: '#9CA3AF',
                  opacity: 0.7,
                  transition: 'opacity 150ms ease',
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '0.7')}
              >
                <X size={14} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );

  return createPortal(container, document.body);
}

export default Toast;
