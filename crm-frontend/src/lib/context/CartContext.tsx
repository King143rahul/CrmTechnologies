'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { createCart, getCart, addToCart as apiAddToCart, updateLineItem, removeLineItem as apiRemoveLineItem } from '../api/cart';
import Cookies from 'js-cookie';

interface CartItem {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  variant: {
    id: string;
    title: string;
    calculated_price?: {
      calculated_amount: number;
      currency_code: string;
    };
  };
  quantity: number;
  unit_price: number;
  subtotal: number;
}

interface Cart {
  id: string;
  items: CartItem[];
  subtotal: number;
  total: number;
  tax_total: number;
  shipping_total: number;
  discount_total: number;
  region?: {
    currency_code: string;
  };
}

interface CartContextType {
  cart: Cart | null;
  isLoading: boolean;
  isCartOpen: boolean;
  itemCount: number;
  addItem: (variantId: string, quantity?: number) => Promise<void>;
  updateItem: (lineItemId: string, quantity: number) => Promise<void>;
  removeItem: (lineItemId: string) => Promise<void>;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const itemCount = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  const initCart = useCallback(async () => {
    try {
      const cartId = Cookies.get('cart_id');
      if (cartId) {
        const data = await getCart(cartId);
        setCart(data.cart);
      } else {
        const data = await createCart();
        Cookies.set('cart_id', data.cart.id, { expires: 30 });
        setCart(data.cart);
      }
    } catch {
      // If cart not found, create new one
      try {
        const data = await createCart();
        Cookies.set('cart_id', data.cart.id, { expires: 30 });
        setCart(data.cart);
      } catch {
        console.error('Failed to initialize cart');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    initCart();
  }, [initCart]);

  const refreshCart = async () => {
    if (!cart?.id) return;
    try {
      const data = await getCart(cart.id);
      setCart(data.cart);
    } catch (e) {
      console.error(e);
    }
  };

  const addItem = async (variantId: string, quantity = 1) => {
    if (!cart?.id) return;
    setIsLoading(true);
    try {
      const data = await apiAddToCart(cart.id, variantId, quantity);
      setCart(data.cart);
      setIsCartOpen(true);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const updateItem = async (lineItemId: string, quantity: number) => {
    if (!cart?.id) return;
    try {
      const data = await updateLineItem(cart.id, lineItemId, quantity);
      setCart(data.cart);
    } catch (error) {
      console.error('Failed to update item:', error);
    }
  };

  const removeItem = async (lineItemId: string) => {
    if (!cart?.id) return;
    try {
      const data = await apiRemoveLineItem(cart.id, lineItemId);
      setCart(data.cart);
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  };

  return (
    <CartContext.Provider value={{
      cart,
      isLoading,
      isCartOpen,
      itemCount,
      addItem,
      updateItem,
      removeItem,
      openCart: () => setIsCartOpen(true),
      closeCart: () => setIsCartOpen(false),
      toggleCart: () => setIsCartOpen(prev => !prev),
      refreshCart,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
