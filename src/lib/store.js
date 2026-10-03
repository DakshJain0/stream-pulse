/**
 * StreamKeeper / Urban Stream Pulse Store & LocalStorage Manager
 * Tech Lead: Goyal
 * 
 * Manages:
 * - Adopted sites
 * - Observations
 * - Streaks
 * - "Reset Demo Data" action
 * - React hook for reactive UI updates
 */

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEYS = {
  ADOPTED: 'streampulse_adopted_sites',
  OBSERVATIONS: 'streampulse_observations',
  STREAKS: 'streampulse_streaks'
};

const DEFAULT_ADOPTED = ['COI-001', 'BEN-002'];

const DEFAULT_OBSERVATIONS = [
  {
    id: 'obs-1',
    siteId: 'COI-001',
    date: '2026-09-19T10:00:00Z',
    metrics: { ph: 7.2, dissolvedOxygen: 7.8, turbidity: 8.0 },
    observer: 'Volunteer Alex',
    notes: 'Good flow, clear riparian corridor.'
  },
  {
    id: 'obs-2',
    siteId: 'BEN-001',
    date: '2026-06-15T14:00:00Z',
    metrics: { ph: 6.2, dissolvedOxygen: 4.2, turbidity: 32.0 },
    observer: 'Goyal (Tech Lead)',
    notes: 'Urban discharge detected near heritage bridge.'
  }
];

const DEFAULT_STREAKS = {
  currentStreak: 3,
  longestStreak: 5,
  lastActivityDate: '2026-10-02',
  totalObservations: 2
};

const listeners = new Set();

function notify() {
  listeners.forEach((listener) => {
    try {
      listener();
    } catch (e) {
      console.error('Store listener error:', e);
    }
  });
}

function safeGet(key, fallback) {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (err) {
    return fallback;
  }
}

function safeSet(key, val) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (err) {}
}

export function initStore() {
  if (typeof window === 'undefined') return;
  if (!localStorage.getItem(STORAGE_KEYS.ADOPTED)) safeSet(STORAGE_KEYS.ADOPTED, DEFAULT_ADOPTED);
  if (!localStorage.getItem(STORAGE_KEYS.OBSERVATIONS)) safeSet(STORAGE_KEYS.OBSERVATIONS, DEFAULT_OBSERVATIONS);
  if (!localStorage.getItem(STORAGE_KEYS.STREAKS)) safeSet(STORAGE_KEYS.STREAKS, DEFAULT_STREAKS);
}

if (typeof window !== 'undefined') {
  initStore();
  window.addEventListener('storage', notify);
}

export function getAdoptedSiteIds() {
  return safeGet(STORAGE_KEYS.ADOPTED, DEFAULT_ADOPTED);
}

export function isSiteAdopted(siteId) {
  return getAdoptedSiteIds().includes(siteId);
}

export function toggleAdoptSite(siteId) {
  const current = getAdoptedSiteIds();
  const next = current.includes(siteId) ? current.filter((id) => id !== siteId) : [...current, siteId];
  safeSet(STORAGE_KEYS.ADOPTED, next);
  notify();
  return next;
}

export function getObservations() {
  return safeGet(STORAGE_KEYS.OBSERVATIONS, DEFAULT_OBSERVATIONS);
}

export function addObservation(obs) {
  const all = getObservations();
  const newObs = {
    id: obs.id || `obs-${Date.now()}`,
    date: obs.date || new Date().toISOString(),
    siteId: obs.siteId,
    metrics: obs.metrics || {},
    observer: obs.observer || 'Citizen Volunteer',
    notes: obs.notes || ''
  };
  safeSet(STORAGE_KEYS.OBSERVATIONS, [newObs, ...all]);

  // Update streak
  const streaks = getStreaks();
  streaks.totalObservations = (streaks.totalObservations || 0) + 1;
  const todayKey = new Date().toISOString().split('T')[0];
  if (streaks.lastActivityDate !== todayKey) {
    streaks.currentStreak = (streaks.currentStreak || 0) + 1;
    streaks.longestStreak = Math.max(streaks.longestStreak || 0, streaks.currentStreak);
    streaks.lastActivityDate = todayKey;
  }
  safeSet(STORAGE_KEYS.STREAKS, streaks);

  notify();
  return newObs;
}

export function getStreaks() {
  return safeGet(STORAGE_KEYS.STREAKS, DEFAULT_STREAKS);
}

export function resetDemoData() {
  safeSet(STORAGE_KEYS.ADOPTED, DEFAULT_ADOPTED);
  safeSet(STORAGE_KEYS.OBSERVATIONS, DEFAULT_OBSERVATIONS);
  safeSet(STORAGE_KEYS.STREAKS, DEFAULT_STREAKS);
  notify();
}

export function subscribe(cb) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function useStreamStore() {
  const [adoptedSiteIds, setAdoptedSiteIds] = useState(getAdoptedSiteIds);
  const [observations, setObservations] = useState(getObservations);
  const [streaks, setStreaks] = useState(getStreaks);

  const sync = useCallback(() => {
    setAdoptedSiteIds(getAdoptedSiteIds());
    setObservations(getObservations());
    setStreaks(getStreaks());
  }, []);

  useEffect(() => {
    return subscribe(sync);
  }, [sync]);

  return {
    adoptedSiteIds,
    observations,
    streaks,
    isAdopted: (siteId) => adoptedSiteIds.includes(siteId),
    toggleAdoptSite,
    addObservation,
    resetDemoData
  };
}
