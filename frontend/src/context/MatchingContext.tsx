// src/context/MatchingContext.tsx

import React, { createContext, useContext} from 'react';
import type { ReactNode } from 'react';

import { useMatching } from '../hooks/useMatching';
import type { UserPreferences, MatchResult } from '../services/api/matching';

interface MatchingContextType {
  preferences: UserPreferences | null;
  matches: MatchResult[];
  matchCount: number;
  loading: boolean;
  saving: boolean;
  error: string | null;
  savePreferences: (prefs: UserPreferences) => Promise<boolean>;
  loadMatches: () => Promise<void>;
  loadMatchCount: () => Promise<void>;
  learnFromBehavior: (propertyId: string) => Promise<void>;
  refresh: () => void;
}

const MatchingContext = createContext<MatchingContextType | undefined>(undefined);

export const MatchingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const matching = useMatching();
  return (
    <MatchingContext.Provider value={matching}>
      {children}
    </MatchingContext.Provider>
  );
};

export const useMatchingContext = () => {
  const context = useContext(MatchingContext);
  if (!context) {
    throw new Error('useMatchingContext must be used within MatchingProvider');
  }
  return context;
};