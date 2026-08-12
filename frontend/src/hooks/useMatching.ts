// src/hooks/useMatching.ts

import { useState, useEffect, useCallback } from 'react';
import { matchingApi, UserPreferences, MatchResult } from '../services/api/matching';

export const useMatching = () => {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [matchCount, setMatchCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // ✅ Load user preferences
  const loadPreferences = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await matchingApi.getUserPreferences();
      setPreferences(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load preferences');
      console.error('Error loading preferences:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Save preferences
  const savePreferences = useCallback(async (prefs: UserPreferences) => {
    try {
      setSaving(true);
      setError(null);
      await matchingApi.savePreferences(prefs);
      setPreferences(prefs);
      // After saving, refresh matches
      await loadMatches();
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save preferences');
      console.error('Error saving preferences:', err);
      return false;
    } finally {
      setSaving(false);
    }
  }, []);

  // ✅ Load matches
  const loadMatches = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await matchingApi.getMatches();
      setMatches(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load matches');
      console.error('Error loading matches:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Load match count
  const loadMatchCount = useCallback(async () => {
    try {
      const count = await matchingApi.getMatchCount();
      setMatchCount(count);
    } catch (err) {
      console.error('Error loading match count:', err);
    }
  }, []);

  // ✅ Learn from behavior
  const learnFromBehavior = useCallback(async (propertyId: string) => {
    try {
      await matchingApi.updateFromBehavior(propertyId);
      // Refresh matches after learning
      await loadMatches();
      await loadMatchCount();
    } catch (err) {
      console.error('Error learning from behavior:', err);
    }
  }, []);

  // ✅ Initial load
  useEffect(() => {
    loadPreferences();
    loadMatches();
    loadMatchCount();
  }, []);

  return {
    preferences,
    matches,
    matchCount,
    loading,
    saving,
    error,
    savePreferences,
    loadMatches,
    loadMatchCount,
    learnFromBehavior,
    refresh: () => {
      loadPreferences();
      loadMatches();
      loadMatchCount();
    },
  };
};