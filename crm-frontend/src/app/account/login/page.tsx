'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useCustomer } from '@/lib/context/CustomerContext';
import { useToast } from '@/lib/context/ToastContext';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

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
      addToast('Welcome back to LUXE!', 'success');
      router.push('/account');
    } catch (err: any) {
      addToast(err.message || 'Invalid email or password', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-8) 0',
      }}
    >
      <div
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: '440px',
          padding: 'var(--space-10) var(--space-8)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-6)',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <span
            className="text-gradient"
            style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--font-weight-bold)', fontFamily: 'var(--font-heading)' }}
          >
            LUXE
          </span>
          <h2 style={{ fontSize: 'var(--text-xl)', marginTop: 'var(--space-4)' }}>Sign In to Your Account</h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-xs)', marginTop: 'var(--space-1)' }}>
            Enter your details to access your account dashboard.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <Input
            type="email"
            label="Email Address"
            placeholder="name@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            leftIcon={<Mail size={16} />}
            required
          />

          <Input
            type={showPassword ? 'text' : 'password'}
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChange={e => setPassword(e.target.value)}
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

          <button
            type="button"
            style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--color-accent-violet)',
              alignSelf: 'flex-end',
              cursor: 'pointer',
              background: 'transparent',
              border: 'none',
            }}
          >
            Forgot Password?
          </button>

          <Button type="submit" isLoading={isSubmitting} className="btn-primary" style={{ width: '100%', marginTop: 'var(--space-2)' }}>
            Sign In
          </Button>
        </form>

        <div style={{ textAlign: 'center', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
          Don&rsquo;t have an account?{' '}
          <Link href="/account/register" style={{ color: 'var(--color-accent-violet)', fontWeight: 'var(--font-weight-semibold)' }}>
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}
