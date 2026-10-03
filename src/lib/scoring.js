/**
 * StreamKeeper / Urban Stream Pulse Priority Scoring Engine
 * Tech Lead: Goyal
 * 
 * Computes priority score (0-100) and reasons for stream monitoring sites.
 * Compatible with Daksh's StreamMap and QuestBoard components while meeting
 * the Tech Lead specification: computePriority(site, observations, userLocation, today) -> { score, reasons[] }
 */

/**
 * Calculates Haversine distance in kilometers between two geo-coordinates.
 */
export function calculateDistanceKm(loc1, loc2) {
  if (!loc1 || !loc2) return null;

  const lat1 = loc1.lat ?? loc1.latitude ?? (Array.isArray(loc1) ? loc1[0] : null);
  const lon1 = loc1.lng ?? loc1.lon ?? loc1.longitude ?? (Array.isArray(loc1) ? loc1[1] : null);
  const lat2 = loc2.lat ?? loc2.latitude ?? (Array.isArray(loc2) ? loc2[0] : null);
  const lon2 = loc2.lng ?? loc2.lon ?? loc2.longitude ?? (Array.isArray(loc2) ? loc2[1] : null);

  if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) return null;

  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Extracts coordinate object from site
 */
export function getSiteCoordinates(site) {
  if (!site) return null;
  if (site.coordinates) {
    if (Array.isArray(site.coordinates)) {
      return { lat: site.coordinates[0], lng: site.coordinates[1] };
    }
    return site.coordinates;
  }
  if (site.lat != null && site.lng != null) {
    return { lat: site.lat, lng: site.lng };
  }
  return null;
}

/**
 * Stub implementation of computePriority() so teammates are never blocked.
 */
export function computePriorityStub(site, observations = [], userLocation = null, today = new Date()) {
  const fakeScore = site?.daysSinceLastCheck != null ? Math.min(100, site.daysSinceLastCheck) : 80;
  return {
    score: fakeScore,
    reasons: ['[STUB] Placeholder priority computation active.'],
    reason: '[STUB] Placeholder priority computation active.',
    status: fakeScore >= 60 ? 'red' : fakeScore >= 30 ? 'amber' : 'green'
  };
}

/**
 * Production implementation of computePriority(site, observations, userLocation, today)
 * 
 * @param {Object} site - Monitored site
 * @param {Array} observations - List of observation records (optional)
 * @param {Object|null} userLocation - { lat, lng } (optional)
 * @param {Date|string} today - Reference date
 * @returns {{ score: number, reasons: string[], reason: string, status: 'red'|'amber'|'green' }}
 */
export function computePriority(site, observations = [], userLocation = null, today = new Date()) {
  if (!site) {
    return { score: 0, reasons: ['Invalid site'], reason: 'Invalid site', status: 'green' };
  }

  const reasons = [];
  let score = 0;
  let status = 'green';
  const waterBody = site.waterBody || site.name || 'Stream reach';

  // 1. Determine days since last check
  let days = site.daysSinceLastCheck;

  // Check if observations list contains a more recent date for this site
  if (Array.isArray(observations) && observations.length > 0) {
    const siteObs = observations
      .filter((o) => o && (o.siteId === site.id || o.site_id === site.id))
      .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

    if (siteObs.length > 0 && siteObs[0].date) {
      const todayDate = today instanceof Date ? today : new Date(today);
      const obsDate = new Date(siteObs[0].date);
      days = Math.max(0, Math.floor((todayDate.getTime() - obsDate.getTime()) / (1000 * 60 * 60 * 24)));
    }
  }

  // --- FACTOR 1: STALENESS / TIMING (Max 50 pts) ---
  if (days === null || days === undefined) {
    score += 45;
    reasons.push(`Critical baseline gap: ${waterBody} has never been surveyed yet.`);
    status = 'red';
  } else if (days > 90) {
    const stalenessPts = Math.min(50, 35 + Math.floor((days - 90) / 2));
    score += stalenessPts;
    reasons.push(`Data stale: Last checked ${days} days ago (>3 months). Health trend unknown.`);
    status = 'red';
  } else if (days >= 30) {
    const revisitPts = Math.min(30, 20 + Math.floor((days - 30) / 3));
    score += revisitPts;
    reasons.push(`Due for revisit: ${days} days without observations on ${waterBody}.`);
    if (status !== 'red') status = 'amber';
  } else {
    score += 5;
    reasons.push(`Fresh data: Inspected ${days} days ago.`);
  }

  // --- FACTOR 2: WATER QUALITY RATING & ANOMALIES (Max 30 pts) ---
  if (site.lastRating === 'Poor') {
    score += 25;
    reasons.push('Previous reading reported degraded water quality (Poor rating).');
    status = 'red';
  } else if (site.lastRating === 'Moderate') {
    score += 10;
    reasons.push('Previous reading reported moderate/vulnerable water quality.');
    if (status === 'green') status = 'amber';
  }

  // Check observation metrics if available
  if (Array.isArray(observations) && observations.length > 0) {
    const latestObs = observations.find((o) => o && (o.siteId === site.id || o.site_id === site.id));
    if (latestObs?.metrics) {
      const { ph, dissolvedOxygen, turbidity } = latestObs.metrics;
      if (ph != null && (ph < 6.5 || ph > 8.5)) {
        score += 10;
        reasons.push(`Abnormal pH recorded (${ph}).`);
      }
      if (dissolvedOxygen != null && dissolvedOxygen < 5.0) {
        score += 15;
        reasons.push(`Severe hypoxia warning: low dissolved oxygen (${dissolvedOxygen} mg/L).`);
        status = 'red';
      }
      if (turbidity != null && turbidity > 25) {
        score += 8;
        reasons.push(`High turbidity alert (${turbidity} NTU).`);
      }
    }
  }

  // --- FACTOR 3: STREAM TYPE & ECOLOGICAL SENSITIVITY (Max 15 pts) ---
  if (site.streamType === 'headwater') {
    score += 12;
    reasons.push('Ecological priority: Headwater stream buffer.');
  } else if (site.streamType === 'urban_river') {
    score += 6;
  } else if (site.priorityLevel === 'high') {
    score += 5;
  }

  // --- FACTOR 4: USER PROXIMITY (Max 10 pts) ---
  if (userLocation) {
    const coords = getSiteCoordinates(site);
    if (coords) {
      const distance = calculateDistanceKm(userLocation, coords);
      if (distance != null) {
        if (distance <= 5.0) {
          score += 10;
          reasons.push(`High proximity: Only ${distance.toFixed(1)} km from volunteer location.`);
        } else if (distance <= 15.0) {
          score += 5;
          reasons.push(`Within reach: ${distance.toFixed(1)} km away.`);
        }
      }
    }
  }

  const finalScore = Math.min(100, Math.max(0, Math.round(score)));
  if (finalScore >= 60) status = 'red';
  else if (finalScore >= 30 && status === 'green') status = 'amber';

  return {
    score: finalScore,
    reasons,
    reason: reasons.join(' '),
    status
  };
}

/**
 * 5 Test Cases satisfying Tech Lead requirements
 */
export const SCORING_TEST_CASES = [
  {
    id: 'test-1-unsurveyed-headwater',
    title: 'Test 1: Unsurveyed headwater stream (Critical baseline gap)',
    site: {
      id: 'COI-003',
      name: 'Mata do Choupal Riparian Buffer',
      waterBody: 'Rio Ceira',
      streamType: 'headwater',
      daysSinceLastCheck: null,
      lastRating: 'Unchecked',
      coordinates: { lat: 40.217424, lng: -8.407131 }
    },
    observations: [],
    userLocation: null,
    today: '2026-10-03',
    expectedRange: [50, 70],
    expectedStatus: 'red',
    expectedReasonSubstrings: ['Critical baseline gap', 'Headwater stream']
  },
  {
    id: 'test-2-fresh-good-quality',
    title: 'Test 2: Fresh data with Good water quality',
    site: {
      id: 'BEN-003',
      name: 'Parco Cellarulo Riparian Zone',
      waterBody: 'Torrente San Nicola',
      streamType: 'canal',
      daysSinceLastCheck: 8,
      lastRating: 'Good',
      coordinates: { lat: 41.10969, lng: 14.763795 }
    },
    observations: [],
    userLocation: null,
    today: '2026-10-03',
    expectedRange: [0, 15],
    expectedStatus: 'green',
    expectedReasonSubstrings: ['Fresh data']
  },
  {
    id: 'test-3-stale-poor-rating',
    title: 'Test 3: Severely stale reading (>90d) with Poor water quality',
    site: {
      id: 'BEN-001',
      name: 'Ponte Leproso Heritage Reach',
      waterBody: 'Fiume Calore',
      streamType: 'urban_river',
      daysSinceLastCheck: 110,
      lastRating: 'Poor',
      coordinates: { lat: 41.140929, lng: 14.750708 }
    },
    observations: [],
    userLocation: null,
    today: '2026-10-03',
    expectedRange: [70, 95],
    expectedStatus: 'red',
    expectedReasonSubstrings: ['Data stale', 'degraded water quality']
  },
  {
    id: 'test-4-due-moderate-revisit',
    title: 'Test 4: Due for revisit (38 days) with Moderate rating',
    site: {
      id: 'BEN-002',
      name: 'Confluenza Calore-Sabato',
      waterBody: 'Fiume Sabato',
      streamType: 'headwater',
      daysSinceLastCheck: 38,
      lastRating: 'Moderate',
      coordinates: { lat: 41.117095, lng: 14.767757 }
    },
    observations: [],
    userLocation: null,
    today: '2026-10-03',
    expectedRange: [35, 55],
    expectedStatus: 'amber',
    expectedReasonSubstrings: ['Due for revisit', 'moderate']
  },
  {
    id: 'test-5-nearby-headwater-revisit',
    title: 'Test 5: Due site with volunteer proximity bonus',
    site: {
      id: 'COI-002',
      name: 'Ponte de Santa Clara Pier',
      waterBody: 'Ribeira de Coselhas',
      streamType: 'headwater',
      daysSinceLastCheck: 52,
      lastRating: 'Moderate',
      coordinates: { lat: 40.194351, lng: -8.438875 }
    },
    observations: [],
    userLocation: { lat: 40.200, lng: -8.440 }, // ~0.6 km away
    today: '2026-10-03',
    expectedRange: [50, 75],
    expectedStatus: 'amber',
    expectedReasonSubstrings: ['Due for revisit', 'High proximity']
  }
];

/**
 * Runner function for scoring test cases
 */
export function runScoringTests() {
  const results = SCORING_TEST_CASES.map((tc) => {
    const actual = computePriority(tc.site, tc.observations, tc.userLocation, tc.today);
    const scoreInRange = actual.score >= tc.expectedRange[0] && actual.score <= tc.expectedRange[1];
    
    const missingReasons = tc.expectedReasonSubstrings.filter((sub) => {
      return !actual.reasons.some((r) => r.toLowerCase().includes(sub.toLowerCase()));
    });

    const passed = scoreInRange && missingReasons.length === 0;

    return {
      id: tc.id,
      title: tc.title,
      passed,
      actualScore: actual.score,
      expectedRange: tc.expectedRange,
      reasons: actual.reasons,
      missingReasons
    };
  });

  const allPassed = results.every((r) => r.passed);
  return { allPassed, results };
}
