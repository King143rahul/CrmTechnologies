'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface WishlistItem {
  id: string;
  title: string;
  handle: string;
  thumbnail: string;
  price: number;
  currencyCode: string;
}

interface WishlistContextType {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  toggleItem: (item: WishlistItem) => void;
  itemCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('wishlist');
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const addItem = (item: WishlistItem) => {
    setItems(prev => {
      const next = [...prev.filter(i => i.id !== item.id), item];
      localStorage.setItem('wishlist', JSON.stringify(next));
      return next;
    });
  };

  const removeItem = (id: string) => {
    setItems(prev => {
      const next = prev.filter(i => i.id !== id);
      localStorage.setItem('wishlist', JSON.stringify(next));
      return next;
    });
  };

  const isInWishlist = (id: string) => items.some(i => i.id === id);

  const toggleItem = (item: WishlistItem) => {
    if (isInWishlist(item.id)) {
      removeItem(item.id);
    } else {
      addItem(item);
    }
  };

  return (
    <WishlistContext.Provider value={{
      items,
      addItem,
      removeItem,
      isInWishlist,
      toggleItem,
      itemCount: items.length
    }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within WishlistProvider');
  return context;
}
