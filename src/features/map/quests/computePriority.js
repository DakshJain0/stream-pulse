/**
 * Computes priority score (0-100+) and ethical explanation text.
 */
export function computePriority(site) {
  const days = site.daysSinceLastCheck;
  let score = 0;
  let reason = '';
  let status = 'green';

  if (days === null || days === undefined) {
    score += 100;
    reason = `No observations recorded in demo dataset for ${site.waterBody}. Baseline check requested.`;
    status = 'red';
  } else if (days > 90) {
    score += 70 + Math.min(days - 90, 30);
    reason = `Stale demo record: Last check was ${days} days ago. Current condition unconfirmed.`;
    status = 'red';
  } else if (days >= 30) {
    score += 35 + (days - 30);
    reason = `Revisit window open: ${days} days since last observation on ${site.waterBody}.`;
    status = 'amber';
  } else {
    score += 10;
    reason = `Fresh observation: Verified ${days} days ago in demo dataset.`;
    status = 'green';
  }

  if (site.lastRating === 'Poor') {
    score += 25;
    reason += ' Previous volunteer noted degraded water quality.';
  }
  if (site.streamType === 'headwater') {
    score += 15;
    reason += ' (Ecological headwater buffer)';
  }

  return { score, reason, status };
}