'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, ShieldCheck, CreditCard, Truck, ArrowLeft, ArrowRight } from 'lucide-react';
import { useCart } from '@/lib/context/CartContext';
import { useCustomer } from '@/lib/context/CustomerContext';
import { useToast } from '@/lib/context/ToastContext';
import { formatPrice } from '@/lib/utils';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, itemCount, refreshCart } = useCart();
  const { customer } = useCustomer();
  const { addToast } = useToast();

  const [step, setStep] = useState(1); // 1: Contact, 2: Shipping, 3: Payment, 4: Review
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [email, setEmail] = useState(customer?.email || '');
  const [shippingAddress, setShippingAddress] = useState({
    firstName: customer?.first_name || '',
    lastName: customer?.last_name || '',
    address1: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
  });
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expiry: '',
    cvc: '',
    name: '',
  });

  const cartSubtotal = cart?.subtotal || 0;
  const currencyCode = cart?.region?.currency_code || 'USD';
  const shippingCost = cartSubtotal >= 15000 ? 0 : 1500;
  const taxCost = Math.round(cartSubtotal * 0.08);
  const cartTotal = cartSubtotal + shippingCost + taxCost;

  const handleNextStep = () => {
    if (step === 1 && !email) {
      addToast('Please enter an email address', 'error');
      return;
    }
    if (step === 2 && (!shippingAddress.firstName || !shippingAddress.address1 || !shippingAddress.city || !shippingAddress.zip)) {
      addToast('Please fill out all required shipping details', 'error');
      return;
    }
    if (step === 3 && (!paymentDetails.cardNumber || !paymentDetails.expiry || !paymentDetails.cvc)) {
      addToast('Please enter your payment card details', 'error');
      return;
    }
    setStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setStep(prev => Math.max(1, prev - 1));
  };

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);
    try {
      // Simulate API completeCart or checkout flow delay
      await new Promise(res => setTimeout(res, 2000));
      addToast('Order placed successfully!', 'success');
      await refreshCart();
      router.push(`/checkout/success?order_id=ORD-${Math.floor(100000 + Math.random() * 900000)}`);
    } catch {
      addToast('An error occurred while placing your order', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: 'var(--space-8)', paddingBottom: 'var(--space-12)' }}>
      {/* Step Indicators */}
      <div className="checkout-steps-bar" style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-10)', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
        {[
          { num: 1, label: 'Contact' },
          { num: 2, label: 'Shipping' },
          { num: 3, label: 'Payment' },
          { num: 4, label: 'Review' },
        ].map((item, idx) => {
          const isActive = step >= item.num;
          const isDone = step > item.num;
          return (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: 'var(--radius-full)',
                  background: isDone ? 'var(--color-success)' : isActive ? 'var(--color-accent-violet)' : 'var(--color-bg-tertiary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: isActive || isDone ? '#ffffff' : 'var(--color-text-secondary)',
                  border: `1px solid ${isActive || isDone ? 'transparent' : 'var(--color-border)'}`,
                  transition: 'background-color var(--transition-fast)',
                }}
              >
                {isDone ? <Check size={14} /> : item.num}
              </div>
              <span
                style={{
                  fontSize: 'var(--text-sm)',
                  fontWeight: isActive ? 'var(--font-weight-semibold)' : 'var(--font-weight-normal)',
                  color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)',
                }}
              >
                {item.label}
              </span>
              {item.num < 4 && <div style={{ width: '40px', height: '1px', background: 'var(--color-border)' }} className="indicators-divider" />}
            </div>
          );
        })}
      </div>

      <div className="checkout-layout">
        {/* Step Forms */}
        <main className="checkout-main-form">
          <div className="glass-card" style={{ padding: 'var(--space-8)' }}>
            {/* Step 1: Contact Information */}
            {step === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                <h2 style={{ fontSize: 'var(--text-xl)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>Contact Information</h2>
                <Input
                  type="email"
                  label="Email Address (For order receipts)"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                />
              </div>
            )}

            {/* Step 2: Shipping Address */}
            {step === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                <h2 style={{ fontSize: 'var(--text-xl)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>Shipping Details</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                  <Input
                    label="First Name"
                    value={shippingAddress.firstName}
                    onChange={e => setShippingAddress({ ...shippingAddress, firstName: e.target.value })}
                    placeholder="John"
                  />
                  <Input
                    label="Last Name"
                    value={shippingAddress.lastName}
                    onChange={e => setShippingAddress({ ...shippingAddress, lastName: e.target.value })}
                    placeholder="Doe"
                  />
                </div>
                <Input
                  label="Address"
                  value={shippingAddress.address1}
                  onChange={e => setShippingAddress({ ...shippingAddress, address1: e.target.value })}
                  placeholder="123 Luxury Ave, Apt 4"
                />
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 'var(--space-4)' }}>
                  <Input
                    label="City"
                    value={shippingAddress.city}
                    onChange={e => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                    placeholder="New York"
                  />
                  <Input
                    label="State / Province"
                    value={shippingAddress.state}
                    onChange={e => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                    placeholder="NY"
                  />
                  <Input
                    label="ZIP / Postal Code"
                    value={shippingAddress.zip}
                    onChange={e => setShippingAddress({ ...shippingAddress, zip: e.target.value })}
                    placeholder="10001"
                  />
                </div>
                <Input
                  label="Phone Number"
                  value={shippingAddress.phone}
                  onChange={e => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            )}

            {/* Step 3: Payment */}
            {step === 3 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                <h2 style={{ fontSize: 'var(--text-xl)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <CreditCard size={20} /> Payment Details
                </h2>
                <div
                  className="glass"
                  style={{
                    borderRadius: 'var(--radius-lg)',
                    padding: 'var(--space-4)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-3)',
                    border: '1px solid rgba(139, 92, 246, 0.2)',
                  }}
                >
                  <ShieldCheck size={18} color="var(--color-accent-violet)" />
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                    Payment processing is fully secured and simulated. No actual charge will be made.
                  </span>
                </div>
                <Input
                  label="Name on Card"
                  value={paymentDetails.name}
                  onChange={e => setPaymentDetails({ ...paymentDetails, name: e.target.value })}
                  placeholder="John Doe"
                />
                <Input
                  label="Card Number"
                  value={paymentDetails.cardNumber}
                  onChange={e => setPaymentDetails({ ...paymentDetails, cardNumber: e.target.value })}
                  placeholder="4111 2222 3333 4444"
                />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                  <Input
                    label="Expiry Date"
                    value={paymentDetails.expiry}
                    onChange={e => setPaymentDetails({ ...paymentDetails, expiry: e.target.value })}
                    placeholder="MM / YY"
                  />
                  <Input
                    label="CVC / CVV"
                    value={paymentDetails.cvc}
                    onChange={e => setPaymentDetails({ ...paymentDetails, cvc: e.target.value })}
                    placeholder="123"
                  />
                </div>
              </div>
            )}

            {/* Step 4: Review Order */}
            {step === 4 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                <h2 style={{ fontSize: 'var(--text-xl)' }}>Review &amp; Place Order</h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                  {/* Contact Summary */}
                  <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-4)' }}>
                    <h4 style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', textTransform: 'uppercase', marginBottom: 'var(--space-2)' }}>
                      Contact Info
                    </h4>
                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)' }}>{email}</span>
                  </div>

                  {/* Shipping Summary */}
                  <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-4)' }}>
                    <h4 style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', textTransform: 'uppercase', marginBottom: 'var(--space-2)' }}>
                      Shipping Address
                    </h4>
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)', lineHeight: 1.5 }}>
                      {shippingAddress.firstName} {shippingAddress.lastName} <br />
                      {shippingAddress.address1} <br />
                      {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zip}
                    </p>
                  </div>

                  {/* Payment Summary */}
                  <div>
                    <h4 style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', textTransform: 'uppercase', marginBottom: 'var(--space-2)' }}>
                      Payment Method
                    </h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)' }}>
                      <CreditCard size={16} />
                      <span>Card ending in {paymentDetails.cardNumber.slice(-4) || '4444'}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Buttons Row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--space-10)', gap: 'var(--space-4)' }}>
              {step > 1 ? (
                <Button onClick={handlePrevStep} className="btn-secondary">
                  <ArrowLeft size={16} /> Back
                </Button>
              ) : (
                <div />
              )}

              {step < 4 ? (
                <Button onClick={handleNextStep} className="btn-primary">
                  Continue <ArrowRight size={16} />
                </Button>
              ) : (
                <Button onClick={handlePlaceOrder} isLoading={isSubmitting} className="btn-primary" style={{ minWidth: '180px' }}>
                  Place Order <ShieldCheck size={18} />
                </Button>
              )}
            </div>
          </div>
        </main>

        {/* Sidebar cart summary (Right) */}
        <aside className="checkout-summary-sidebar">
          <div className="glass-card" style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-bold)', borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-3)' }}>
              Cart Details ({itemCount} items)
            </h3>

            {/* Items scroll */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', maxHeight: '240px', overflowY: 'auto' }}>
              {cart?.items?.map(item => {
                const itemPrice = item.variant?.calculated_price?.calculated_amount || item.unit_price || 0;
                return (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', objectFit: 'cover' }}
                    />
                    <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, minWidth: 0 }}>
                      <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.title}
                      </span>
                      <span style={{ fontSize: '10px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                        Qty: {item.quantity} &times; {formatPrice(itemPrice, currencyCode)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ height: '1px', background: 'var(--color-border)' }} />

            {/* Totals group */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', fontSize: 'var(--text-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Subtotal</span>
                <span>{formatPrice(cartSubtotal, currencyCode)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Shipping</span>
                <span>{shippingCost === 0 ? 'Free' : formatPrice(shippingCost, currencyCode)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Tax</span>
                <span>{formatPrice(taxCost, currencyCode)}</span>
              </div>
            </div>

            <div style={{ height: '1px', background: 'var(--color-border)', margin: 'var(--space-1) 0' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'var(--font-weight-bold)', fontSize: 'var(--text-base)' }}>
              <span>Total</span>
              <span className="text-gradient">{formatPrice(cartTotal, currencyCode)}</span>
            </div>
          </div>
        </aside>
      </div>

      <style jsx global>{`
        .checkout-layout {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: var(--space-8);
          align-items: start;
        }
        .checkout-summary-sidebar {
          position: sticky;
          top: 96px;
        }
        @media (max-width: 992px) {
          .checkout-layout {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 576px) {
          .indicators-divider {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
