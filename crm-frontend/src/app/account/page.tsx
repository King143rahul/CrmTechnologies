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
import styles from './AccountPage.module.css';

function AccountContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const { customer, isAuthenticated, token, logout } = useCustomer();
  const { items: wishlistItems, removeItem: removeFromWishlist } = useWishlist();
  const { addToast } = useToast();

  const queryTab = searchParams.get('tab') || 'overview';
  const [activeTab, setActiveTab] = useState(queryTab);
  const [orders, setOrders] = useState<any[]>([]);
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
        console.warn('API error listing orders:', err);
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
    <div className={styles.container}>
      <h1 className={styles.title}>My Account</h1>

      <div className={styles.accountLayout}>
        {/* Navigation Sidebar */}
        <aside className={styles.accountSidebar}>
          <div className={styles.sidebarCard}>
            {tabs.map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${styles.sidebarBtn} ${isActive ? styles.sidebarBtnActive : styles.sidebarBtnInactive}`}
                >
                  {tab.icon} {tab.label}
                </button>
              );
            })}
            <div className={styles.divider} />
            <button onClick={handleLogout} className={styles.logoutBtn}>
              <LogOut size={16} /> Logout
            </button>
          </div>
        </aside>

        {/* Tab content panel */}
        <main className={styles.mainContent}>
          <div>
            {/* T1: Overview */}
            {activeTab === 'overview' && (
              <div className={styles.tabContent}>
                <div>
                  <h2 className={styles.sectionTitle}>Welcome back, {customer?.first_name || 'Guest'}!</h2>
                  <p className={styles.sectionSub}>
                    Manage your orders, profile updates, and shipping details.
                  </p>
                </div>

                {/* Info Cards Grid */}
                <div className={styles.overviewCards}>
                  <div className={styles.infoCard}>
                    <span className={styles.cardLabel}>Total Orders</span>
                    <h3 className={styles.cardValue}>{isLoadingOrders ? '...' : orders.length}</h3>
                  </div>
                  <div className={styles.infoCard}>
                    <span className={styles.cardLabel}>Wishlist</span>
                    <h3 className={styles.cardValue}>{wishlistItems.length} items</h3>
                  </div>
                  <div className={styles.infoCard}>
                    <span className={styles.cardLabel}>Registered Email</span>
                    <p className={styles.cardValueText}>{customer?.email}</p>
                  </div>
                </div>

                {/* Recent Order Summary */}
                <div>
                  <h3 className={styles.recentOrderHeader}>Recent Order</h3>
                  {orders.length > 0 ? (
                    <div className={styles.orderRow}>
                      <div>
                        <span className={styles.orderId}>{orders[0].id}</span>
                        <span className={styles.orderDate}>
                          Placed on {formatDate(orders[0].created_at)}
                        </span>
                      </div>
                      <div className="badge badge-stock" style={{ textTransform: 'capitalize' }}>
                        {orders[0].status}
                      </div>
                      <span className={styles.orderTotal}>
                        {formatPrice(orders[0].total, 'ZAR')}
                      </span>
                    </div>
                  ) : (
                    <p className={styles.emptyState}>No orders placed yet.</p>
                  )}
                </div>
              </div>
            )}

            {/* T2: Orders */}
            {activeTab === 'orders' && (
              <div className={styles.tabContent}>
                <h2 className={styles.sectionTitle}>Order History</h2>
                {orders.length > 0 ? (
                  <div className={styles.ordersList}>
                    {orders.map(order => (
                      <div key={order.id} className={styles.orderRow}>
                        <div>
                          <span className={styles.orderId}>{order.id}</span>
                          <span className={styles.orderDate}>
                            {formatDate(order.created_at)} &bull; {order.items?.length || 0} items
                          </span>
                        </div>
                        <div className="badge badge-stock" style={{ textTransform: 'capitalize' }}>
                          {order.status}
                        </div>
                        <div className={styles.orderDetailBtnGroup}>
                          <span className={styles.orderTotal}>
                            {formatPrice(order.total, 'ZAR')}
                          </span>
                          <Button variant="ghost" className="btn-sm">
                            Details <ArrowRight size={14} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={styles.emptyState} style={{ textAlign: 'center', padding: 'var(--space-8) 0' }}>
                    No orders found.
                  </div>
                )}
              </div>
            )}

            {/* T3: Profile */}
            {activeTab === 'profile' && (
              <form onSubmit={handleUpdateProfile} className={styles.profileForm}>
                <h2 className={styles.sectionTitle}>Profile Information</h2>
                <div className={styles.grid2Col}>
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
              <div className={styles.tabContent}>
                <div className={styles.addressesHeader}>
                  <h2 className={styles.sectionTitle}>Shipping Addresses</h2>
                  {!isAddingAddress && (
                    <Button onClick={() => setIsAddingAddress(true)} className="btn-secondary btn-sm">
                      <Plus size={14} /> Add Address
                    </Button>
                  )}
                </div>

                {isAddingAddress ? (
                  <form onSubmit={handleAddAddress} className={styles.addressForm}>
                    <div className={styles.grid2Col}>
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
                    <div className={styles.grid3Col}>
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
                    <div className={styles.formActions}>
                      <Button type="submit" className="btn-primary">
                        Save Address
                      </Button>
                      <Button type="button" onClick={() => setIsAddingAddress(false)} variant="secondary">
                        Cancel
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className={styles.addressesGrid}>
                    {customer?.shipping_addresses && customer.shipping_addresses.length > 0 ? (
                      customer.shipping_addresses.map((addr: any, index: number) => (
                        <div key={addr.id || index} className={styles.addressCard}>
                          {index === 0 && <span className={styles.addressBadge}>Default Address</span>}
                          <p className={styles.addressText}>
                            {addr.first_name} {addr.last_name} <br />
                            {addr.address_1} {addr.address_2 ? `, ${addr.address_2}` : ''} <br />
                            {addr.city}, {addr.province} {addr.postal_code} <br />
                            {addr.country_code?.toUpperCase()}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className={styles.emptyState}>No shipping addresses saved yet.</p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* T5: Wishlist */}
            {activeTab === 'wishlist' && (
              <div className={styles.tabContent}>
                <h2 className={styles.sectionTitle}>My Wishlist</h2>
                {wishlistItems.length > 0 ? (
                  <div className={styles.wishlistGrid}>
                    {wishlistItems.map(item => (
                      <div key={item.id} className={styles.wishlistItem}>
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className={styles.wishlistThumb}
                        />
                        <div className={styles.wishlistDetails}>
                          <Link href={`/products/${item.handle}`} className={styles.wishlistTitle}>
                            {item.title}
                          </Link>
                          <span className={styles.wishlistPrice}>
                            {formatPrice(item.price, 'ZAR')}
                          </span>
                        </div>
                        <button
                          onClick={() => removeFromWishlist(item.id)}
                          className={styles.wishlistRemove}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={styles.emptyState} style={{ textAlign: 'center', padding: 'var(--space-12) 0' }}>
                    Your wishlist is empty.
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={<div className={styles.container} style={{ textAlign: 'center' }}>Loading account details...</div>}>
      <AccountContent />
    </Suspense>
  );
}

