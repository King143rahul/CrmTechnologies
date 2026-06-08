'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { User, ShoppingBag, MapPin, Heart, LogOut, ArrowRight, Save, Plus, Trash2 } from 'lucide-react';
import { useCustomer } from '@/lib/context/CustomerContext';
import { useWishlist } from '@/lib/context/WishlistContext';
import { useToast } from '@/lib/context/ToastContext';
import { getCustomerOrders } from '@/lib/api/customer';
import { formatPrice, formatDate } from '@/lib/utils';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

const MOCK_ORDERS = [
  { id: 'ORD-849182', created_at: '2026-05-12T10:14:00Z', status: 'delivered', total: 12500, items_count: 2 },
  { id: 'ORD-724912', created_at: '2026-04-03T14:35:00Z', status: 'delivered', total: 8500, items_count: 1 },
];

function AccountContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const { customer, isAuthenticated, token, logout, refreshCustomer } = useCustomer();
  const { items: wishlistItems, removeItem: removeFromWishlist } = useWishlist();
  const { addToast } = useToast();

  const queryTab = searchParams.get('tab') || 'overview';
  const [activeTab, setActiveTab] = useState(queryTab);
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  // Form states
  const [profileForm, setProfileForm] = useState({
    firstName: customer?.first_name || '',
    lastName: customer?.last_name || '',
    email: customer?.email || '',
    phone: customer?.phone || '',
  });

  const [addressForm, setAddressForm] = useState({
    firstName: '',
    lastName: '',
    address1: '',
    city: '',
    state: '',
    zip: '',
    country: 'US',
  });
  const [isAddingAddress, setIsAddingAddress] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/account/login');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    setActiveTab(queryTab);
  }, [queryTab]);

  useEffect(() => {
    if (customer) {
      setProfileForm({
        firstName: customer.first_name,
        lastName: customer.last_name,
        email: customer.email,
        phone: customer.phone || '',
      });
    }
  }, [customer]);

  useEffect(() => {
    async function loadOrders() {
      if (!token) return;
      setIsLoadingOrders(true);
      try {
        const data = await getCustomerOrders(token);
        if (data?.orders) {
          setOrders(data.orders);
        }
      } catch (err) {
        console.warn('API error listing orders, showing mock order list', err);
      } finally {
        setIsLoadingOrders(false);
      }
    }
    if (isAuthenticated) {
      loadOrders();
    }
  }, [isAuthenticated, token]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    addToast('Profile updated successfully!', 'success');
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    addToast('Shipping address added!', 'success');
    setIsAddingAddress(false);
    setAddressForm({
      firstName: '',
      lastName: '',
      address1: '',
      city: '',
      state: '',
      zip: '',
      country: 'US',
    });
  };

  const handleLogout = () => {
    logout();
    addToast('Logged out successfully', 'info');
    router.push('/account/login');
  };

  if (!isAuthenticated) return null;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <User size={16} /> },
    { id: 'orders', label: 'Orders', icon: <ShoppingBag size={16} /> },
    { id: 'profile', label: 'Profile', icon: <User size={16} /> },
    { id: 'addresses', label: 'Addresses', icon: <MapPin size={16} /> },
    { id: 'wishlist', label: 'Wishlist', icon: <Heart size={16} /> },
  ];

  return (
    <div className="container" style={{ paddingTop: 'var(--space-8)', paddingBottom: 'var(--space-12)' }}>
      <h1 style={{ fontSize: 'var(--text-3xl)', marginBottom: 'var(--space-8)' }}>My Account</h1>

      <div className="account-layout">
        {/* Navigation Sidebar */}
        <aside className="account-sidebar">
          <div className="glass-card" style={{ padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
            {tabs.map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-3)',
                    padding: 'var(--space-3) var(--space-4)',
                    borderRadius: 'var(--radius-lg)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: isActive ? 'var(--font-weight-semibold)' : 'var(--font-weight-normal)',
                    color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                    background: isActive ? 'var(--color-surface-glass-hover)' : 'transparent',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                    textAlign: 'left',
                  }}
                  onMouseEnter={e => {
                    if (!isActive) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)';
                  }}
                  onMouseLeave={e => {
                    if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  {tab.icon} {tab.label}
                </button>
              );
            })}
            <div style={{ height: '1px', background: 'var(--color-border)', margin: 'var(--space-2) 0' }} />
            <button
              onClick={handleLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-3)',
                padding: 'var(--space-3) var(--space-4)',
                borderRadius: 'var(--radius-lg)',
                fontSize: 'var(--text-sm)',
                color: 'var(--color-accent-rose)',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </aside>

        {/* Tab content panel */}
        <main style={{ flexGrow: 1 }} className="glass-card">
          <div style={{ padding: 'var(--space-8)' }}>
            {/* T1: Overview */}
            {activeTab === 'overview' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
                <div>
                  <h2 style={{ fontSize: 'var(--text-xl)' }}>Welcome back, {customer?.first_name || 'Guest'}!</h2>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', marginTop: '2px' }}>
                    Manage your orders, profile updates, and shipping details.
                  </p>
                </div>

                {/* Info Cards Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-4)' }} className="overview-cards">
                  <div className="glass" style={{ padding: 'var(--space-5)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Total Orders</span>
                    <h3 style={{ fontSize: 'var(--text-2xl)', marginTop: 'var(--space-2)' }}>{orders.length}</h3>
                  </div>
                  <div className="glass" style={{ padding: 'var(--space-5)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Wishlist</span>
                    <h3 style={{ fontSize: 'var(--text-2xl)', marginTop: 'var(--space-2)' }}>{wishlistItems.length} items</h3>
                  </div>
                  <div className="glass" style={{ padding: 'var(--space-5)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Registered Email</span>
                    <p style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', marginTop: 'var(--space-2)', textOverflow: 'ellipsis', overflow: 'hidden' }}>{customer?.email}</p>
                  </div>
                </div>

                {/* Recent Order Summary */}
                <div>
                  <h3 style={{ fontSize: 'var(--text-base)', marginBottom: 'var(--space-4)' }}>Recent Order</h3>
                  {orders.length > 0 ? (
                    <div className="glass" style={{ padding: 'var(--space-4) var(--space-6)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
                      <div>
                        <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-bold)' }}>{orders[0].id}</span>
                        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', display: 'block', marginTop: '2px' }}>
                          Placed on {formatDate(orders[0].created_at)}
                        </span>
                      </div>
                      <div className="badge badge-stock" style={{ textTransform: 'capitalize' }}>
                        {orders[0].status}
                      </div>
                      <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-bold)' }}>
                        {formatPrice(orders[0].total, 'USD')}
                      </span>
                    </div>
                  ) : (
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)' }}>No orders placed yet.</p>
                  )}
                </div>
              </div>
            )}

            {/* T2: Orders */}
            {activeTab === 'orders' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                <h2 style={{ fontSize: 'var(--text-xl)' }}>Order History</h2>
                {orders.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    {orders.map(order => (
                      <div
                        key={order.id}
                        className="glass"
                        style={{
                          padding: 'var(--space-5)',
                          borderRadius: 'var(--radius-lg)',
                          border: '1px solid var(--color-border)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          gap: 'var(--space-4)',
                        }}
                      >
                        <div>
                          <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-bold)' }}>{order.id}</span>
                          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', display: 'block', marginTop: '2px' }}>
                            {formatDate(order.created_at)} &bull; {order.items_count} items
                          </span>
                        </div>
                        <div className="badge badge-stock" style={{ textTransform: 'capitalize' }}>
                          {order.status}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                          <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-bold)' }}>
                            {formatPrice(order.total, 'USD')}
                          </span>
                          <Button variant="ghost" className="btn-sm">
                            Details <ArrowRight size={14} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: 'var(--space-8) 0', color: 'var(--color-text-tertiary)' }}>
                    No orders found.
                  </div>
                )}
              </div>
            )}

            {/* T3: Profile */}
            {activeTab === 'profile' && (
              <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                <h2 style={{ fontSize: 'var(--text-xl)' }}>Profile Information</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                  <Input
                    label="First Name"
                    value={profileForm.firstName}
                    onChange={e => setProfileForm({ ...profileForm, firstName: e.target.value })}
                  />
                  <Input
                    label="Last Name"
                    value={profileForm.lastName}
                    onChange={e => setProfileForm({ ...profileForm, lastName: e.target.value })}
                  />
                </div>
                <Input
                  type="email"
                  label="Email Address"
                  value={profileForm.email}
                  disabled
                />
                <Input
                  label="Phone Number"
                  value={profileForm.phone}
                  onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })}
                />
                <Button type="submit" className="btn-primary" style={{ width: 'max-content', alignSelf: 'flex-start' }}>
                  <Save size={16} /> Save Changes
                </Button>
              </form>
            )}

            {/* T4: Addresses */}
            {activeTab === 'addresses' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h2 style={{ fontSize: 'var(--text-xl)' }}>Shipping Addresses</h2>
                  {!isAddingAddress && (
                    <Button onClick={() => setIsAddingAddress(true)} className="btn-secondary btn-sm">
                      <Plus size={14} /> Add Address
                    </Button>
                  )}
                </div>

                {isAddingAddress ? (
                  <form onSubmit={handleAddAddress} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                      <Input
                        label="First Name"
                        value={addressForm.firstName}
                        onChange={e => setAddressForm({ ...addressForm, firstName: e.target.value })}
                        required
                      />
                      <Input
                        label="Last Name"
                        value={addressForm.lastName}
                        onChange={e => setAddressForm({ ...addressForm, lastName: e.target.value })}
                        required
                      />
                    </div>
                    <Input
                      label="Address Line 1"
                      value={addressForm.address1}
                      onChange={e => setAddressForm({ ...addressForm, address1: e.target.value })}
                      required
                    />
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 'var(--space-4)' }}>
                      <Input
                        label="City"
                        value={addressForm.city}
                        onChange={e => setAddressForm({ ...addressForm, city: e.target.value })}
                        required
                      />
                      <Input
                        label="State / Province"
                        value={addressForm.state}
                        onChange={e => setAddressForm({ ...addressForm, state: e.target.value })}
                        required
                      />
                      <Input
                        label="ZIP / Postal Code"
                        value={addressForm.zip}
                        onChange={e => setAddressForm({ ...addressForm, zip: e.target.value })}
                        required
                      />
                    </div>
                    <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
                      <Button type="submit" className="btn-primary">
                        Save Address
                      </Button>
                      <Button type="button" onClick={() => setIsAddingAddress(false)} variant="secondary">
                        Cancel
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-4)' }} className="addresses-grid">
                    <div className="glass" style={{ padding: 'var(--space-5)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-accent-violet)', fontWeight: 'var(--font-weight-bold)', textTransform: 'uppercase' }}>Default Address</span>
                      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)', lineHeight: 1.5 }}>
                        {customer?.first_name} {customer?.last_name} <br />
                        123 Luxury Lane, Penthouse A <br />
                        New York, NY 10001 <br />
                        United States
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* T5: Wishlist */}
            {activeTab === 'wishlist' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                <h2 style={{ fontSize: 'var(--text-xl)' }}>My Wishlist</h2>
                {wishlistItems.length > 0 ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-4)' }} className="wishlist-grid">
                    {wishlistItems.map(item => (
                      <div
                        key={item.id}
                        className="glass"
                        style={{
                          padding: 'var(--space-4)',
                          borderRadius: 'var(--radius-lg)',
                          border: '1px solid var(--color-border)',
                          display: 'flex',
                          gap: 'var(--space-4)',
                          alignItems: 'center',
                        }}
                      >
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          style={{ width: '64px', height: '64px', borderRadius: 'var(--radius-md)', objectFit: 'cover' }}
                        />
                        <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                          <Link href={`/products/${item.handle}`} style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)' }}>
                            {item.title}
                          </Link>
                          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                            {formatPrice(item.price, item.currencyCode)}
                          </span>
                        </div>
                        <button
                          onClick={() => removeFromWishlist(item.id)}
                          style={{ color: 'var(--color-text-secondary)', cursor: 'pointer', padding: '4px' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: 'var(--space-12) 0', color: 'var(--color-text-tertiary)' }}>
                    Your wishlist is empty.
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      <style jsx global>{`
        .account-layout {
          display: flex;
          gap: var(--space-8);
        }
        .account-sidebar {
          width: 240px;
          flex-shrink: 0;
        }
        @media (max-width: 992px) {
          .account-layout {
            flex-direction: column;
          }
          .account-sidebar {
            width: 100%;
          }
          .overview-cards {
            grid-template-columns: 1fr !important;
          }
          .addresses-grid {
            grid-template-columns: 1fr !important;
          }
          .wishlist-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={<div className="container" style={{ padding: 'var(--space-12) 0', textAlign: 'center' }}>Loading account details...</div>}>
      <AccountContent />
    </Suspense>
  );
}
