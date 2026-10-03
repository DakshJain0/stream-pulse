import React from 'react';

/**
 * Community Challenge Progress Bar Component
 */
export function CommunityChallenge({ challenge }) {
  const { current, target, percentage, tier, nextTier, remainingChecks } = challenge;

  return (
    <div className="rounded-2xl border border-sky-100 dark:border-sky-900/40 bg-gradient-to-br from-sky-50/70 via-white to-indigo-50/40 dark:from-slate-900 dark:via-slate-900 dark:to-sky-950/30 p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xl">🌊</span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              OneAquaHealth Community Challenge
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-600 dark:text-sky-300 border border-sky-500/20">
              Sprint 2026
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Crowdsourcing 200 freshwater field checks across 5 European pilot cities
          </p>
        </div>

        {/* Current Tier Badge */}
        <div className="flex items-center space-x-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3.5 py-1.5 rounded-xl shadow-xs self-start sm:self-auto">
          <span className="text-base">🏅</span>
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Current Tier</div>
            <div className="text-xs font-bold text-sky-700 dark:text-sky-300">{tier}</div>
          </div>
        </div>
      </div>

      {/* Progress Bar Container */}
      <div className="space-y-2 mt-4">
        <div className="flex justify-between items-baseline text-xs">
          <span className="font-semibold text-slate-700 dark:text-slate-200">
            <strong className="text-lg text-sky-600 dark:text-sky-400 font-extrabold">{current}</strong>
            <span className="text-slate-400"> / {target} Total Checks</span>
          </span>
          <span className="font-extrabold text-sm text-sky-600 dark:text-sky-400 font-mono">
            {percentage}% Complete
          </span>
        </div>

        {/* Outer Bar */}
        <div className="relative w-full h-4 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
          {/* Inner Fill */}
          <div
            className="h-full rounded-full bg-gradient-to-r from-sky-500 via-teal-400 to-indigo-500 transition-all duration-700 ease-out shadow-sm"
            style={{ width: `${Math.min(100, Math.max(5, percentage))}%` }}
          />
        </div>

        {/* Milestone Markers */}
        <div className="flex justify-between items-center text-[11px] text-slate-400 pt-1">
          <span>0 (Kickoff)</span>
          <span className={current >= 75 ? 'text-teal-600 font-semibold dark:text-teal-400' : ''}>75 (Bronze)</span>
          <span className={current >= 150 ? 'text-sky-600 font-semibold dark:text-sky-400' : ''}>150 (Silver)</span>
          <span className={current >= 200 ? 'text-indigo-600 font-semibold dark:text-indigo-400' : ''}>200 (Gold)</span>
        </div>
      </div>

      {/* Motivation Callout Footer */}
      <div className="mt-4 pt-3 border-t border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-600 dark:text-slate-400">
        <div>
          🎯 Next Unlock: <strong className="text-slate-800 dark:text-slate-200">{nextTier}</strong>
        </div>
        <div className="font-medium text-sky-700 dark:text-sky-400">
          Only <strong>{remainingChecks}</strong> more checks needed to unlock the next community badge!
        </div>
      </div>
    </div>
  );
}
