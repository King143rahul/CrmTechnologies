'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'full';
}

export function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!mounted) return null;

  const sizeWidths = {
    sm: '400px',
    md: '600px',
    lg: '800px',
    full: '100%',
  };

  const modalElement = (
    <AnimatePresence>
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 300,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
            }}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            style={{
              position: 'relative',
              width: size === 'full' ? '100%' : '90%',
              maxWidth: sizeWidths[size],
              maxHeight: size === 'full' ? '100%' : '90vh',
              height: size === 'full' ? '100%' : 'auto',
              borderRadius: size === 'full' ? 0 : 'var(--radius-xl)',
              boxShadow: 'var(--shadow-lg)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              zIndex: 10,
            }}
            className="glass"
          >
            {/* Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 'var(--space-4) var(--space-6)',
                borderBottom: '1px solid var(--color-border)',
              }}
            >
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-bold)' }}>{title}</h3>
              <button
                onClick={onClose}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '32px',
                  height: '32px',
                  borderRadius: 'var(--radius-full)',
                  cursor: 'pointer',
                  color: 'var(--color-text-secondary)',
                  transition: 'background-color var(--transition-fast), color var(--transition-fast)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.color = 'var(--color-text-primary)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--color-text-secondary)';
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div
              style={{
                padding: 'var(--space-6)',
                overflowY: 'auto',
                flexGrow: 1,
              }}
            >
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalElement, document.body);
}

export default Modal;
