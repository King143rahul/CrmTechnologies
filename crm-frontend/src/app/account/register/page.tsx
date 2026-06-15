'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useCustomer } from '@/lib/context/CustomerContext';
import { useToast } from '@/lib/context/ToastContext';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import styles from './RegisterPage.module.css';

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
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Registration failed. Email might be in use.';
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
          <h2 className={styles.title}>Create an Account</h2>
          <p className={styles.subtitle}>
            Join CRM Technology and access premium IT hardware at the best prices.
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.nameRow}>
            <Input
              label="First Name"
              placeholder="John"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              leftIcon={<User size={16} />}
              required
            />
            <Input
              label="Last Name"
              placeholder="Doe"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            />
          </div>

          <Input
            type="email"
            label="Email Address"
            placeholder="name@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            leftIcon={<Mail size={16} />}
            required
          />

          <Input
            type={showPassword ? 'text' : 'password'}
            label="Password (min 8 chars)"
            placeholder="Enter a secure password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            leftIcon={<Lock size={16} />}
            required
          />

          <div className={styles.termsRow}>
            <input type="checkbox" id="terms" required className={styles.termsCheckbox} />
            <label htmlFor="terms" className={styles.termsLabel}>
              I agree to the{' '}
              <a href="#" className={styles.termsLink}>Terms &amp; Conditions</a>{' '}
              and{' '}
              <a href="#" className={styles.termsLink}>Privacy Policy</a>.
            </label>
          </div>

          <Button
            type="submit"
            isLoading={isSubmitting}
            className={`btn-primary ${styles.submitBtn}`}
          >
            Register
          </Button>
        </form>

        <div className={styles.footer}>
          Already have an account?{' '}
          <Link href="/account/login" className={styles.footerLink}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
