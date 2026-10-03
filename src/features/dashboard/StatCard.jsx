import React from 'react';

/**
 * Reusable Stat Card Component for OneAquaHealth Dashboard
 */
export function StatCard({ title, value, unit = '', subtext, icon, trend, status = 'default' }) {
  const statusStyles = {
    default: {
      border: 'border-slate-200 dark:border-slate-800',
      bg: 'bg-white dark:bg-slate-900',
      text: 'text-slate-900 dark:text-white',
      badge: 'bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300'
    },
    success: {
      border: 'border-emerald-200 dark:border-emerald-900/50',
      bg: 'bg-emerald-50/40 dark:bg-emerald-950/20',
      text: 'text-emerald-950 dark:text-emerald-100',
      badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300'
    },
    warning: {
      border: 'border-amber-200 dark:border-amber-900/50',
      bg: 'bg-amber-50/40 dark:bg-amber-950/20',
      text: 'text-amber-950 dark:text-amber-100',
      badge: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300'
    },
    alert: {
      border: 'border-rose-200 dark:border-rose-900/50',
      bg: 'bg-rose-50/40 dark:bg-rose-950/20',
      text: 'text-rose-950 dark:text-rose-100',
      badge: 'bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300'
    }
  };

  const style = statusStyles[status] || statusStyles.default;

  return (
    <div className={`rounded-2xl border ${style.border} ${style.bg} p-6 shadow-sm hover:shadow-md transition-shadow duration-200`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {title}
        </span>
        {icon && (
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-base">
            {icon}
          </div>
        )}
      </div>

      <div className="flex items-baseline space-x-2">
        <span className={`text-3xl font-extrabold tracking-tight ${style.text}`}>
          {value}
        </span>
        {unit && (
          <span className="text-base font-semibold text-slate-500 dark:text-slate-400">
            {unit}
          </span>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between text-xs">
        <span className="text-slate-600 dark:text-slate-400 font-medium">
          {subtext}
        </span>
        {trend && (
          <span className={`px-2 py-0.5 rounded-full font-medium ${style.badge}`}>
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}
