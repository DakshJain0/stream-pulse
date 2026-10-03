export function computePriority(site) {
  const days = site.daysSinceLastCheck;
  let score = 0;
  let reason = '';
  let status = 'green';

  if (days === null || days === undefined) {
    score += 100;
    reason = `Critical baseline gap: ${site.waterBody} has never been surveyed yet.`;
    status = 'red';
  } else if (days > 90) {
    score += 70 + Math.min(days - 90, 30);
    reason = `Data stale: Last checked ${days} days ago (>3 months). Health trend unknown.`;
    status = 'red';
  } else if (days >= 30) {
    score += 35 + (days - 30);
    reason = `Due for revisit: ${days} days without observations on ${site.waterBody}.`;
    status = 'amber';
  } else {
    score += 10;
    reason = `Fresh data: Inspected ${days} days ago.`;
    status = 'green';
  }

  if (site.lastRating === 'Poor') {
    score += 25;
    reason += ' Previous reading reported degraded water quality.';
  }
  if (site.streamType === 'headwater') {
    score += 10;
  }

  return { score, reason, status };
}