'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { medusaRequest } from '../medusa';

const REGION_STORAGE_KEY = 'crm_region_id';

interface RegionContextType {
  regionId: string | null;
  isLoading: boolean;
}

const RegionContext = createContext<RegionContextType>({ regionId: null, isLoading: true });

export function RegionProvider({ children }: { children: React.ReactNode }) {
  const [regionId, setRegionId] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(REGION_STORAGE_KEY);
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState(!regionId);

  useEffect(() => {
    if (regionId) {
      setIsLoading(false);
      return;
    }
    // Fetch and cache the first available region
    medusaRequest('/store/regions')
      .then((data) => {
        const firstRegion = data?.regions?.[0];
        if (firstRegion?.id) {
          setRegionId(firstRegion.id);
          localStorage.setItem(REGION_STORAGE_KEY, firstRegion.id);
        }
      })
      .catch((err) => console.warn('[RegionContext] Could not fetch regions:', err))
      .finally(() => setIsLoading(false));
  }, [regionId]);

  return (
    <RegionContext.Provider value={{ regionId, isLoading }}>
      {children}
    </RegionContext.Provider>
  );
}

export function useRegion() {
  return useContext(RegionContext);
}
