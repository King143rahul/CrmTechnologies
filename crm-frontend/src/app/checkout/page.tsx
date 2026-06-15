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
import styles from './CheckoutPage.module.css';

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
  const currencyCode = cart?.region?.currency_code || 'ZAR';
  const shippingCost = cartSubtotal >= 15000 ? 0 : 1500;
  const taxCost = Math.round(cartSubtotal * 0.15); // standard 15% VAT for ZAR
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
    <div className={styles.container}>
      {/* Step Indicators */}
      <div className={styles.stepsBar}>
        {[
          { num: 1, label: 'Contact' },
          { num: 2, label: 'Shipping' },
          { num: 3, label: 'Payment' },
          { num: 4, label: 'Review' },
        ].map((item, idx) => {
          const isActive = step >= item.num;
          const isDone = step > item.num;
          return (
            <div key={idx} className={styles.stepIndicator}>
              <div
                className={`${styles.stepCircle} ${
                  isDone
                    ? styles.stepCircleDone
                    : isActive
                    ? styles.stepCircleActive
                    : styles.stepCircleInactive
                }`}
              >
                {isDone ? <Check size={14} /> : item.num}
              </div>
              <span
                className={`${styles.stepLabel} ${
                  isActive ? styles.stepLabelActive : styles.stepLabelInactive
                }`}
              >
                {item.label}
              </span>
              {item.num < 4 && <div className={styles.indicatorsDivider} />}
            </div>
          );
        })}
      </div>

      <div className={styles.checkoutLayout}>
        {/* Step Forms */}
        <main className={styles.checkoutMainForm}>
          <div>
            {/* Step 1: Contact Information */}
            {step === 1 && (
              <div className={styles.stepContent}>
                <h2 className={styles.stepTitle}>Contact Information</h2>
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
              <div className={styles.stepContent}>
                <h2 className={styles.stepTitle}>Shipping Details</h2>
                <div className={styles.grid2Col}>
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
                <div className={styles.grid3Col}>
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
              <div className={styles.stepContent}>
                <h2 className={styles.stepTitle}>
                  <CreditCard size={20} /> Payment Details
                </h2>
                <div className={styles.secureBadge}>
                  <ShieldCheck size={18} color="var(--color-accent-blue)" />
                  <span className={styles.secureText}>
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
                <div className={styles.grid2Col}>
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
              <div className={styles.stepContent}>
                <h2 className={styles.stepTitle}>Review &amp; Place Order</h2>

                <div className={styles.reviewSection}>
                  {/* Contact Summary */}
                  <div className={styles.reviewBlock}>
                    <h4 className={styles.reviewLabel}>Contact Info</h4>
                    <span className={styles.reviewValue}>{email}</span>
                  </div>

                  {/* Shipping Summary */}
                  <div className={styles.reviewBlock}>
                    <h4 className={styles.reviewLabel}>Shipping Address</h4>
                    <p className={styles.reviewValue}>
                      {shippingAddress.firstName} {shippingAddress.lastName} <br />
                      {shippingAddress.address1} <br />
                      {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zip}
                    </p>
                  </div>

                  {/* Payment Summary */}
                  <div className={styles.reviewBlockNoBorder}>
                    <h4 className={styles.reviewLabel}>Payment Method</h4>
                    <div className={styles.reviewCardLine}>
                      <CreditCard size={16} />
                      <span>Card ending in {paymentDetails.cardNumber.slice(-4) || '4444'}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Buttons Row */}
            <div className={styles.buttonRow}>
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
        <aside className={styles.checkoutSummarySidebar}>
          <div className={styles.summaryCard}>
            <h3 className={styles.summaryTitle}>
              Cart Details ({itemCount} items)
            </h3>

            {/* Items scroll */}
            <div className={styles.itemsList}>
              {cart?.items?.map(item => {
                const itemPrice = item.variant?.calculated_price?.calculated_amount || item.unit_price || 0;
                return (
                  <div key={item.id} className={styles.itemRow}>
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className={styles.itemThumb}
                    />
                    <div className={styles.itemDetails}>
                      <span className={styles.itemTitle}>
                        {item.title}
                      </span>
                      <span className={styles.itemMeta}>
                        Qty: {item.quantity} &times; {formatPrice(itemPrice, currencyCode)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className={styles.divider} />

            {/* Totals group */}
            <div className={styles.totalsGroup}>
              <div className={styles.totalRow}>
                <span className={styles.totalLabelSecondary}>Subtotal</span>
                <span>{formatPrice(cartSubtotal, currencyCode)}</span>
              </div>
              <div className={styles.totalRow}>
                <span className={styles.totalLabelSecondary}>Shipping</span>
                <span>{shippingCost === 0 ? 'Free' : formatPrice(shippingCost, currencyCode)}</span>
              </div>
              <div className={styles.totalRow}>
                <span className={styles.totalLabelSecondary}>Tax (VAT)</span>
                <span>{formatPrice(taxCost, currencyCode)}</span>
              </div>
            </div>

            <div className={styles.dividerSpace} />

            <div className={styles.finalTotalRow}>
              <span>Total</span>
              <span className="text-gradient">{formatPrice(cartTotal, currencyCode)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

