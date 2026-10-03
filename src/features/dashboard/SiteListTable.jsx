import React, { useState } from 'react';

/**
 * SiteListTable Component with Focus on Never-Checked Sites
 */
export function SiteListTable({ sites, observations, onSelectSite }) {
  const [filterMode, setFilterMode] = useState('never'); // 'never', 'all', 'monitored'
  const [searchTerm, setSearchTerm] = useState('');

  // Map latest check per site
  const latestCheckMap = {};
  observations.forEach(obs => {
    const time = new Date(obs.timestamp).getTime();
    if (!latestCheckMap[obs.siteId] || time > latestCheckMap[obs.siteId]) {
      latestCheckMap[obs.siteId] = { time, daysAgo: obs.daysAgo, obsId: obs.id };
    }
  });

  const processedSites = sites.map(site => {
    const isChecked = !!latestCheckMap[site.id];
    return {
      ...site,
      isChecked,
      daysAgo: isChecked ? latestCheckMap[site.id].daysAgo : null
    };
  });

  const filteredSites = processedSites.filter(site => {
    if (filterMode === 'never' && site.isChecked) return false;
    if (filterMode === 'monitored' && !site.isChecked) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        site.name.toLowerCase().includes(term) ||
        site.id.toLowerCase().includes(term) ||
        site.waterBody.toLowerCase().includes(term) ||
        site.city.toLowerCase().includes(term)
      );
    }
    return true;
  });

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Pilot Site Registry & Priority Alerts
            </h3>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              {filteredSites.length} Reaches
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Prioritize volunteer visits to unmonitored sites across the 5 pilot cities
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Tabs */}
          <div className="inline-flex rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-1">
            <button
              onClick={() => setFilterMode('never')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                filterMode === 'never'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
              }`}
            >
              ⚠ Never Checked
            </button>
            <button
              onClick={() => setFilterMode('monitored')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                filterMode === 'monitored'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
              }`}
            >
              ✓ Monitored
            </button>
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                filterMode === 'all'
                  ? 'bg-slate-800 text-white dark:bg-slate-700 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
              }`}
            >
              All (100 Sites)
            </button>
          </div>

          {/* Search Input */}
          <input
            type="text"
            placeholder="Search stream or site..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600 dark:text-slate-400">
          <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 font-semibold border-y border-slate-200 dark:border-slate-800">
            <tr>
              <th className="py-2.5 px-3">Site ID</th>
              <th className="py-2.5 px-3">Site Name & River</th>
              <th className="py-2.5 px-3">City</th>
              <th className="py-2.5 px-3">Stream Type</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3">Last Check</th>
              <th className="py-2.5 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredSites.slice(0, 10).map(site => (
              <tr key={site.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                <td className="py-3 px-3 font-mono font-bold text-slate-800 dark:text-slate-200">
                  {site.id}
                </td>
                <td className="py-3 px-3">
                  <div className="font-semibold text-slate-900 dark:text-white">{site.name}</div>
                  <div className="text-[11px] text-slate-400">{site.waterBody}</div>
                </td>
                <td className="py-3 px-3 font-medium text-slate-700 dark:text-slate-300">
                  {site.city}
                </td>
                <td className="py-3 px-3">
                  <span className="capitalize px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px]">
                    {site.streamType.replace('_', ' ')}
                  </span>
                </td>
                <td className="py-3 px-3">
                  {site.isChecked ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full font-medium text-[11px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      ✓ Checked
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full font-bold text-[11px] bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                      ⚠ Never Checked
                    </span>
                  )}
                </td>
                <td className="py-3 px-3 font-mono text-[11px]">
                  {site.isChecked ? (
                    <span className="text-slate-600 dark:text-slate-400">{site.daysAgo}d ago</span>
                  ) : (
                    <span className="text-rose-500 dark:text-rose-400 font-semibold">Pending Visit</span>
                  )}
                </td>
                <td className="py-3 px-3 text-right">
                  <button
                    onClick={() => onSelectSite && onSelectSite(site)}
                    className="px-2.5 py-1 text-[11px] font-semibold rounded-md bg-sky-50 text-sky-700 hover:bg-sky-100 dark:bg-sky-950 dark:text-sky-300 transition-colors"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredSites.length === 0 && (
          <div className="text-center py-8 text-slate-400 text-xs">
            No monitoring sites match your current filters.
          </div>
        )}
      </div>

      {filteredSites.length > 10 && (
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-400">
          Showing 10 of {filteredSites.length} sites in current view. (All 100 sites stored in <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">data/sites.json</code>)
        </div>
      )}
    </div>
  );
}
