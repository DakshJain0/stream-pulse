/**
 * OneAquaHealth Dashboard Data Service
 * Description: Utilities to aggregate, compute, and format metrics from
 * sites.json and seed-observations.json.
 */

export function computeDashboardMetrics(sites, observations, selectedCity = 'all') {
  if (!sites || sites.length === 0) {
    return {
      totalSites: 0,
      checkedSitesCount: 0,
      neverCheckedCount: 0,
      coveragePercent: 0,
      neverCheckedPercent: 0,
      avgDaysSinceCheck: 0,
      totalObservations: 0,
      cityChartData: [],
      neverCheckedSites: [],
      filteredSites: [],
      filteredObservations: [],
      communityChallenge: { current: 0, target: 200, percentage: 0, tier: 'Bronze' }
    };
  }

  // 1. Filter by selected city if applicable
  const filteredSites = selectedCity === 'all' 
    ? sites 
    : sites.filter(s => s.city.toLowerCase() === selectedCity.toLowerCase());

  const filteredSiteIds = new Set(filteredSites.map(s => s.id));

  const filteredObservations = observations.filter(obs => filteredSiteIds.has(obs.siteId));

  // 2. Identify checked sites and latest check dates
  const latestCheckBySite = {};
  const obsCountBySite = {};

  filteredObservations.forEach(obs => {
    obsCountBySite[obs.siteId] = (obsCountBySite[obs.siteId] || 0) + 1;
    const obsTime = new Date(obs.timestamp).getTime();
    if (!latestCheckBySite[obs.siteId] || obsTime > latestCheckBySite[obs.siteId]) {
      latestCheckBySite[obs.siteId] = obsTime;
    }
  });

  const totalSites = filteredSites.length;
  const checkedSiteIds = Object.keys(latestCheckBySite);
  const checkedSitesCount = checkedSiteIds.length;
  const neverCheckedSites = filteredSites.filter(s => !latestCheckBySite[s.id]);
  const neverCheckedCount = neverCheckedSites.length;

  // 3. Stat Card 1: Coverage %
  const coveragePercent = totalSites > 0 
    ? Math.round((checkedSitesCount / totalSites) * 1000) / 10 
    : 0;
  const neverCheckedPercent = totalSites > 0
    ? Math.round((neverCheckedCount / totalSites) * 1000) / 10
    : 0;

  // 4. Stat Card 3: Avg Days Since Check
  // Use benchmark reference time (early Oct 2026)
  const now = new Date("2026-10-02T18:00:00Z").getTime();
  let avgDaysSinceCheck = 0;

  if (checkedSitesCount > 0) {
    const totalDays = checkedSiteIds.reduce((sum, siteId) => {
      const diffMs = Math.max(0, now - latestCheckBySite[siteId]);
      const days = diffMs / (1000 * 60 * 60 * 24);
      return sum + days;
    }, 0);
    avgDaysSinceCheck = Math.round((totalDays / checkedSitesCount) * 10) / 10;
  }

  // 5. City breakdown for Recharts Bar Chart
  const allCities = ["Coimbra", "Benevento", "Ghent", "Oslo", "Toulouse"];
  const cityChartData = allCities.map(city => {
    const citySites = sites.filter(s => s.city.toLowerCase() === city.toLowerCase());
    const citySiteIds = new Set(citySites.map(s => s.id));
    const cityObs = observations.filter(o => citySiteIds.has(o.siteId));
    const cityCheckedIds = new Set(cityObs.map(o => o.siteId));

    const total = citySites.length;
    const checked = cityCheckedIds.size;
    const never = total - checked;
    const coverage = total > 0 ? Math.round((checked / total) * 100) : 0;

    return {
      city,
      totalSites: total,
      checkedSites: checked,
      neverChecked: never,
      coveragePercent: coverage,
      observationsCount: cityObs.length
    };
  });

  // 6. Community Challenge Progress Bar
  const targetGoal = 200;
  const currentTotalChecks = observations.length;
  const challengePercent = Math.min(100, Math.round((currentTotalChecks / targetGoal) * 100));

  let tier = 'Bronze Stream Scout';
  let nextTier = 'Silver River Guardian (150 Checks)';
  if (currentTotalChecks >= 200) {
    tier = 'Gold Aquatic Champion';
    nextTier = 'Challenge Completed!';
  } else if (currentTotalChecks >= 150) {
    tier = 'Silver River Guardian';
    nextTier = 'Gold Aquatic Champion (200 Checks)';
  } else if (currentTotalChecks >= 75) {
    tier = 'Bronze Stream Scout';
    nextTier = 'Silver River Guardian (150 Checks)';
  }

  const communityChallenge = {
    current: currentTotalChecks,
    target: targetGoal,
    percentage: challengePercent,
    tier,
    nextTier,
    remainingChecks: Math.max(0, targetGoal - currentTotalChecks)
  };

  return {
    totalSites,
    checkedSitesCount,
    neverCheckedCount,
    coveragePercent,
    neverCheckedPercent,
    avgDaysSinceCheck,
    totalObservations: filteredObservations.length,
    cityChartData,
    neverCheckedSites,
    filteredSites,
    filteredObservations,
    communityChallenge
  };
}
