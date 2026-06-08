'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useCustomer } from '@/lib/context/CustomerContext';
import { useToast } from '@/lib/context/ToastContext';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useCustomer();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.email || !formData.password) {
      addToast('Please fill out all required fields', 'error');
      return;
    }
    if (formData.password.length < 8) {
      addToast('Password must be at least 8 characters long', 'error');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      addToast('Passwords do not match', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await register({
        email: formData.email,
        password: formData.password,
        first_name: formData.firstName,
        last_name: formData.lastName,
      });
      addToast('Account created successfully!', 'success');
      router.push('/account');
    } catch (err: any) {
      addToast(err.message || 'Registration failed. Email might be in use.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '85vh',
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
          maxWidth: '480px',
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
          <h2 style={{ fontSize: 'var(--text-xl)', marginTop: 'var(--space-4)' }}>Create an Account</h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-xs)', marginTop: 'var(--space-1)' }}>
            Join LUXE and experience premium minimalist lifestyle essentials.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <Input
              label="First Name"
              placeholder="John"
              value={formData.firstName}
              onChange={e => setFormData({ ...formData, firstName: e.target.value })}
              leftIcon={<User size={16} />}
              required
            />
            <Input
              label="Last Name"
              placeholder="Doe"
              value={formData.lastName}
              onChange={e => setFormData({ ...formData, lastName: e.target.value })}
            />
          </div>

          <Input
            type="email"
            label="Email Address"
            placeholder="name@example.com"
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
            leftIcon={<Mail size={16} />}
            required
          />

          <Input
            type={showPassword ? 'text' : 'password'}
            label="Password (min 8 chars)"
            placeholder="Enter a secure password"
            value={formData.password}
            onChange={e => setFormData({ ...formData, password: e.target.value })}
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

          <Input
            type="password"
            label="Confirm Password"
            placeholder="Re-enter your password"
            value={formData.confirmPassword}
            onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
            leftIcon={<Lock size={16} />}
            required
          />

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-2)', marginTop: 'var(--space-1)' }}>
            <input type="checkbox" id="terms" required style={{ marginTop: '3px', cursor: 'pointer' }} />
            <label htmlFor="terms" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', cursor: 'pointer', lineHeight: 1.4 }}>
              I agree to the{' '}
              <a href="#" style={{ color: 'var(--color-accent-violet)' }}>
                Terms &amp; Conditions
              </a>{' '}
              and{' '}
              <a href="#" style={{ color: 'var(--color-accent-violet)' }}>
                Privacy Policy
              </a>
              .
            </label>
          </div>

          <Button type="submit" isLoading={isSubmitting} className="btn-primary" style={{ width: '100%', marginTop: 'var(--space-3)' }}>
            Register
          </Button>
        </form>

        <div style={{ textAlign: 'center', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
          Already have an account?{' '}
          <Link href="/account/login" style={{ color: 'var(--color-accent-violet)', fontWeight: 'var(--font-weight-semibold)' }}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
