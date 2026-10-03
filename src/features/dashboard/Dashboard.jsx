import React, { useState, useEffect } from 'react';
import { computeDashboardMetrics } from './dashboardDataService';
import { StatCard } from './StatCard';
import { CityBarChart } from './CityBarChart';
import { CommunityChallenge } from './CommunityChallenge';
import { SiteListTable } from './SiteListTable';
import { ObservationsFeed } from './ObservationsFeed';

/**
 * Main OneAquaHealth Dashboard Feature Component
 */
export function Dashboard({ initialSites = [], initialObservations = [] }) {
  const [sites, setSites] = useState(initialSites);
  const [observations, setObservations] = useState(initialObservations);
  const [loading, setLoading] = useState(!initialSites.length);
  const [error, setError] = useState(null);
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedSiteModal, setSelectedSiteModal] = useState(null);

  // If no props passed, fetch from local JSON files
  useEffect(() => {
    if (sites.length > 0 && observations.length > 0) return;

    async function loadData() {
      try {
        setLoading(true);
        const [sitesRes, obsRes] = await Promise.all([
          fetch('/data/sites.json'),
          fetch('/data/seed-observations.json')
        ]);

        if (!sitesRes.ok || !obsRes.ok) {
          throw new Error('Failed to load JSON data files from data/ directory');
        }

        const sitesData = await sitesRes.json();
        const obsData = await obsRes.json();
        setSites(sitesData);
        setObservations(obsData);
        setError(null);
      } catch (err) {
        console.warn('Network fetch fallback to bundled data:', err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [sites.length, observations.length]);

  // Compute reactive metrics
  const metrics = computeDashboardMetrics(sites, observations, selectedCity);

  const citiesList = [
    { id: 'all', label: 'All 5 Pilot Basins' },
    { id: 'coimbra', label: 'Coimbra (Portugal)' },
    { id: 'benevento', label: 'Benevento (Italy)' },
    { id: 'ghent', label: 'Ghent (Belgium)' },
    { id: 'oslo', label: 'Oslo (Norway)' },
    { id: 'toulouse', label: 'Toulouse (France)' },
  ];

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-medium text-slate-500">Loading OneAquaHealth stream telemetry...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Top Banner / Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center space-x-3">
            <span className="text-3xl">💧</span>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                OneAquaHealth Surveillance Dashboard
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Citizen Science freshwater ecosystem monitoring across 100 European pilot sites
              </p>
            </div>
          </div>
        </div>

        {/* City Filter Selector */}
        <div className="flex items-center space-x-3">
          <label htmlFor="city-filter" className="text-xs font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap">
            Filter Basin:
          </label>
          <select
            id="city-filter"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-3.5 py-2 shadow-xs focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
          >
            {citiesList.map(c => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>

          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300">
            ● Oct 2026 Seed
          </span>
        </div>
      </div>

      {/* 3 Core Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Coverage % */}
        <StatCard
          title="Coverage Rate"
          value={`${metrics.coveragePercent}%`}
          unit=""
          subtext={`${metrics.checkedSitesCount} of ${metrics.totalSites} sites verified`}
          icon="🎯"
          trend="+14% this month"
          status={metrics.coveragePercent >= 70 ? 'success' : 'warning'}
        />

        {/* Card 2: Never-Checked Sites */}
        <StatCard
          title="Never-Checked Sites"
          value={metrics.neverCheckedCount}
          unit="sites"
          subtext={`${metrics.neverCheckedPercent}% of basin pending first visit`}
          icon="⚠️"
          trend="Needs Volunteers"
          status={metrics.neverCheckedCount > 20 ? 'alert' : 'warning'}
        />

        {/* Card 3: Avg Days Since Check */}
        <StatCard
          title="Avg Days Since Check"
          value={metrics.avgDaysSinceCheck}
          unit="days"
          subtext="Data freshness across monitored reaches"
          icon="⏱️"
          trend="Optimal < 14d"
          status={metrics.avgDaysSinceCheck <= 14 ? 'success' : 'warning'}
        />
      </div>

      {/* Community Challenge Progress Bar */}
      <CommunityChallenge challenge={metrics.communityChallenge} />

      {/* Main Content Grid: Recharts Bar Chart & Observations Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Recharts City Bar Chart (7 cols) */}
        <div className="lg:col-span-7">
          <CityBarChart
            data={metrics.cityChartData}
            onCityClick={(city) => setSelectedCity(city.toLowerCase())}
          />
        </div>

        {/* Right Column: Live Seed Observations Feed (5 cols) */}
        <div className="lg:col-span-5">
          <ObservationsFeed
            observations={metrics.filteredObservations}
            onSelectSiteId={(siteId) => {
              const s = sites.find(item => item.id === siteId);
              if (s) setSelectedSiteModal(s);
            }}
          />
        </div>
      </div>

      {/* Full Width Section: Site Registry & Priority Alerts Table */}
      <SiteListTable
        sites={metrics.filteredSites}
        observations={observations}
        onSelectSite={(site) => setSelectedSiteModal(site)}
      />

      {/* Site Detail Modal / Inspection Drawer */}
      {selectedSiteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-sky-600 dark:text-sky-400 font-bold">
                  {selectedSiteModal.id} • {selectedSiteModal.city}, {selectedSiteModal.country}
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                  {selectedSiteModal.name}
                </h3>
                <p className="text-xs text-slate-500">Water body: {selectedSiteModal.waterBody}</p>
              </div>
              <button
                onClick={() => setSelectedSiteModal(null)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs border-y border-slate-100 dark:border-slate-800 py-3">
              <div className="flex justify-between">
                <span className="text-slate-500">Coordinates:</span>
                <span className="font-mono">{selectedSiteModal.coordinates.lat}, {selectedSiteModal.coordinates.lng}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Stream Type:</span>
                <span className="capitalize">{selectedSiteModal.streamType.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Accessibility:</span>
                <span className="capitalize">{selectedSiteModal.accessibility.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Data Origin:</span>
                <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-[10px]">
                  {selectedSiteModal.source}
                </span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
                Monitored Quality Parameters:
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedSiteModal.targetParameters.map(param => (
                  <span key={param} className="px-2 py-0.5 rounded-md bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 text-[11px] font-mono">
                    {param}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedSiteModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-semibold hover:opacity-90 transition-opacity"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
