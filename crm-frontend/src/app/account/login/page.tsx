'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useCustomer } from '@/lib/context/CustomerContext';
import { useToast } from '@/lib/context/ToastContext';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import styles from './LoginPage.module.css';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useCustomer();
  const { addToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      addToast('Please enter both email and password', 'error');
      return;
    }
    setIsSubmitting(true);
    try {
      await login(email, password);
      addToast('Welcome back to CRM Technology!', 'success');
      router.push('/account');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Invalid email or password';
      addToast(message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <span className={styles.brandName}>CRM Technology</span>
          <h2 className={styles.title}>Sign In to Your Account</h2>
          <p className={styles.subtitle}>
            Enter your details to access your account dashboard.
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            type="email"
            label="Email Address"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail size={16} />}
            required
          />

          <Input
            type={showPassword ? 'text' : 'password'}
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftIcon={<Lock size={16} />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--color-text-secondary)' }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
            required
          />

          <button type="button" className={styles.forgotBtn}>
            Forgot Password?
          </button>

          <Button
            type="submit"
            isLoading={isSubmitting}
            className={`btn-primary ${styles.submitBtn}`}
          >
            Sign In
          </Button>
        </form>

        <div className={styles.footer}>
          Don&rsquo;t have an account?{' '}
          <Link href="/account/register" className={styles.footerLink}>
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}
