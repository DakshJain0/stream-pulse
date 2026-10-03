/**
 * Computes priority score strictly clamped between 0 and 100.
 */
export function computePriority(site) {
  const days = site.daysSinceLastCheck;
  let score = 0;
  let reason = '';
  let status = 'green';

  // 1. Freshness Staleness Component (0 - 65 pts)
  if (days === null || days === undefined) {
    score += 65;
    reason = `No observations recorded in demo dataset for ${site.waterBody}. Baseline check needed.`;
    status = 'red';
  } else if (days > 90) {
    score += 45 + Math.min(Math.round((days - 90) * 0.3), 20);
    reason = `Stale demo record: Last check was ${days} days ago. Condition unverified.`;
    status = 'red';
  } else if (days >= 30) {
    score += 20 + Math.round((days - 30) * 0.4);
    reason = `Revisit window open: ${days} days since last observation on ${site.waterBody}.`;
    status = 'amber';
  } else {
    score += Math.max(5, Math.round(days * 0.3));
    reason = `Fresh observation: Verified ${days} days ago in demo dataset.`;
    status = 'green';
  }

  // 2. Health & Water Quality Urgency (+20 pts)
  if (site.lastRating === 'Poor') {
    score += 20;
    reason += ' Previous volunteer noted degraded water quality.';
  } else if (site.lastRating === 'Moderate') {
    score += 10;
  }

  // 3. Ecological Sensitivity (+15 pts)
  if (site.streamType === 'headwater') {
    score += 15;
    reason += ' (Ecological headwater reach)';
  }

  // Strict clamp: 0 to 100
  const finalScore = Math.min(100, Math.max(0, Math.round(score)));

  return {
    score: finalScore,
    reason,
    status,
  };
}