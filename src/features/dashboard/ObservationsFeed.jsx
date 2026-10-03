import React from 'react';

/**
 * ObservationsFeed Component
 * Displays recent citizen science submissions from seed-observations.json
 */
export function ObservationsFeed({ observations, onSelectSiteId }) {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Recent Field Observations
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              Live Feed
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Standardized citizen checks recorded across pilot rivers
          </p>
        </div>
      </div>

      <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
        {observations.slice(0, 6).map(obs => (
          <div
            key={obs.id}
            className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/30 hover:border-slate-200 dark:hover:border-slate-700 transition-all text-xs"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="font-mono font-bold text-sky-600 dark:text-sky-400 cursor-pointer hover:underline" onClick={() => onSelectSiteId && onSelectSiteId(obs.siteId)}>
                  {obs.siteId}
                </span>
                <span className="text-slate-400">•</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{obs.siteName}</span>
                <span className="text-[11px] text-slate-400">({obs.city})</span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                {obs.daysAgo === 1 ? 'Yesterday' : `${obs.daysAgo} days ago`}
              </span>
            </div>

            {/* Parameter Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-2 py-2 px-2.5 rounded-lg bg-white dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/50">
              <div>
                <span className="text-[10px] text-slate-400 uppercase block">Water Temp</span>
                <span className="font-semibold font-mono text-slate-700 dark:text-slate-200">
                  {obs.measurements.waterTempC}°C
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase block">pH</span>
                <span className="font-semibold font-mono text-slate-700 dark:text-slate-200">
                  {obs.measurements.pH}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase block">Dissolved O₂</span>
                <span className="font-semibold font-mono text-slate-700 dark:text-slate-200">
                  {obs.measurements.dissolvedOxygenMgL} mg/L
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase block">Health Score</span>
                <span className="font-bold font-mono text-emerald-600 dark:text-emerald-400">
                  {obs.measurements.streamHealthScore} / 10
                </span>
              </div>
            </div>

            {/* Notes & Observer */}
            <p className="text-slate-600 dark:text-slate-300 italic mb-2">
              "{obs.notes}"
            </p>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
              <span>Observer: <strong className="text-slate-700 dark:text-slate-300">{obs.observerId}</strong></span>
              <div className="flex items-center space-x-2">
                <span>Wellbeing Rating: <strong className="text-sky-600 dark:text-sky-400">{obs.measurements.wellbeingRating}/5</strong></span>
                {obs.hasPhoto && <span title="Photo attached">📷</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
