// Region Context Provider

import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Region } from '../types/app.types';

interface RegionContextType {
  region: Region;
  setRegion: (region: Region) => void;
}

const RegionContext = createContext<RegionContextType | undefined>(undefined);
const REGION_STORAGE_KEY = '@sushi_world_region';

export const RegionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Belgium only - always use 'BE'
  const [region] = useState<Region>('BE');

  // No-op setter since we only support Belgium
  const setRegion = async (_newRegion: Region) => {
    // Region is fixed to Belgium
  };

  return (
    <RegionContext.Provider value={{ region, setRegion }}>
      {children}
    </RegionContext.Provider>
  );
};

export const useRegion = () => {
  const context = useContext(RegionContext);
  if (context === undefined) {
    throw new Error('useRegion must be used within a RegionProvider');
  }
  return context;
};

