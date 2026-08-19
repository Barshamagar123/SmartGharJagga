// src/hooks/useMatching.ts

import { useState, useEffect, useCallback } from 'react';
import { matchingApi } from '../services/api/matching';
import type { MatchResult, UserPreferences, PreferenceRequest} from '../services/api/matching';
import { useAuth } from './useAuth';

export const useMatching = () => {
  const { isAuthenticated, user } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [allMatches, setAllMatches] = useState<MatchResult[]>([]); // Store all matches
  const [matchCount, setMatchCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ Load user preferences and matches
  const loadData = useCallback(async () => {
    if (!isAuthenticated) {
      setError('Please login to use AI matching');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // Load preferences
      const prefs = await matchingApi.getUserPreferences();
      setPreferences(prefs);
      
      // Load all matches
      const matchesData = await matchingApi.getPropertyMatches();
      setAllMatches(matchesData);
      
      // ✅ Only show TOP 3 matches
      const topMatches = matchesData.slice(0, 3);
      setMatches(topMatches);
      
      // Load match count
      const count = await matchingApi.getMatchCount();
      setMatchCount(count);
      
    } catch (err: any) {
      console.error('Error loading matching data:', err);
      setError(err.message || 'Failed to load matching data');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // ✅ Save preferences
  const savePreferences = useCallback(async (prefs: PreferenceRequest) => {
    if (!isAuthenticated) {
      setError('Please login to save preferences');
      return null;
    }

    setLoading(true);
    setError(null);
    
    try {
      console.log('📤 Saving preferences:', prefs);
      const saved = await matchingApi.savePreferences(prefs);
      console.log('✅ Preferences saved:', saved);
      setPreferences(saved);
      
      // After saving, reload matches
      const matchesData = await matchingApi.getPropertyMatches();
      setAllMatches(matchesData);
      
      // ✅ Only show TOP 3 matches
      const topMatches = matchesData.slice(0, 3);
      setMatches(topMatches);
      
      const count = await matchingApi.getMatchCount();
      setMatchCount(count);
      
      return saved;
    } catch (err: any) {
      console.error('Error saving preferences:', err);
      
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data?.errors) {
        const errors = err.response.data.errors;
        const errorMessages = Object.values(errors).flat().join(', ');
        setError(errorMessages);
      } else {
        setError(err.message || 'Failed to save preferences');
      }
      return null;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // ✅ Refresh matches (only top 3)
  const refreshMatches = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      const matchesData = await matchingApi.getPropertyMatches();
      setAllMatches(matchesData);
      
      // ✅ Only show TOP 3 matches
      const topMatches = matchesData.slice(0, 3);
      setMatches(topMatches);
      
      const count = await matchingApi.getMatchCount();
      setMatchCount(count);
    } catch (err) {
      console.error('Error refreshing matches:', err);
    }
  }, [isAuthenticated]);

  // ✅ Learn from behavior
  const learnFromBehavior = useCallback(async (propertyId: string) => {
    if (!isAuthenticated) return;
    
    try {
      await matchingApi.updateFromBehavior(propertyId);
      // Reload matches after learning (only top 3)
      const matchesData = await matchingApi.getPropertyMatches();
      setAllMatches(matchesData);
      
      // ✅ Only show TOP 3 matches
      const topMatches = matchesData.slice(0, 3);
      setMatches(topMatches);
    } catch (err) {
      console.error('Error learning from behavior:', err);
    }
  }, [isAuthenticated]);

  // ✅ Load data on mount if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated, loadData]);

  return {
    preferences,
    matches,          // ✅ Only top 3 matches
    allMatches,       // ✅ All matches (if needed)
    matchCount,
    loading,
    error,
    savePreferences,
    loadData,
    refreshMatches,
    learnFromBehavior,
    isAuthenticated,
  };
};