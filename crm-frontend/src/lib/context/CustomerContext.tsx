'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getCustomer, loginCustomer, registerCustomer } from '../api/customer';
import Cookies from 'js-cookie';

interface Customer {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  shipping_addresses?: Array<{
    id: string;
    first_name: string;
    last_name: string;
    address_1: string;
    address_2?: string;
    city: string;
    province?: string;
    postal_code: string;
    country_code: string;
    phone?: string;
  }>;
}

interface CustomerContextType {
  customer: Customer | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; password: string; first_name: string; last_name: string }) => Promise<void>;
  logout: () => void;
  refreshCustomer: () => Promise<void>;
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

export function CustomerProvider({ children }: { children: React.ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!customer;

  const loadCustomer = useCallback(async () => {
    try {
      const savedToken = Cookies.get('customer_token');
      if (savedToken) {
        const data = await getCustomer(savedToken);
        setCustomer(data.customer);
        setToken(savedToken);
      }
    } catch {
      Cookies.remove('customer_token');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCustomer();
  }, [loadCustomer]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const authData = await loginCustomer(email, password);
      const newToken = authData.token;
      Cookies.set('customer_token', newToken, { expires: 30 });
      setToken(newToken);
      const data = await getCustomer(newToken);
      setCustomer(data.customer);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: { email: string; password: string; first_name: string; last_name: string }) => {
    setIsLoading(true);
    try {
      await registerCustomer(data);
      await login(data.email, data.password);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    Cookies.remove('customer_token');
    setCustomer(null);
    setToken(null);
  };

  const refreshCustomer = async () => {
    if (!token) return;
    try {
      const data = await getCustomer(token);
      setCustomer(data.customer);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <CustomerContext.Provider value={{
      customer,
      isLoading,
      isAuthenticated,
      token,
      login,
      register,
      logout,
      refreshCustomer,
    }}>
      {children}
    </CustomerContext.Provider>
  );
}

export function useCustomer() {
  const context = useContext(CustomerContext);
  if (!context) throw new Error('useCustomer must be used within CustomerProvider');
  return context;
}
