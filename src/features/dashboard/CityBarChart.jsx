import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

/**
 * Custom Recharts Tooltip Component
 */
const CustomCityTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const checked = payload.find(p => p.dataKey === 'checkedSites')?.value || 0;
    const never = payload.find(p => p.dataKey === 'neverChecked')?.value || 0;
    const total = checked + never;
    const coverage = total > 0 ? Math.round((checked / total) * 100) : 0;
    const obsCount = payload[0]?.payload?.observationsCount || 0;

    return (
      <div className="bg-slate-900/95 backdrop-blur-sm text-white p-3.5 rounded-xl shadow-xl border border-slate-700 text-xs min-w-[210px]">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
          <span className="font-bold text-sm text-sky-400">{label}</span>
          <span className="px-2 py-0.5 rounded-full bg-sky-950 text-sky-300 font-mono text-[11px]">
            {coverage}% Coverage
          </span>
        </div>
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-emerald-300">
            <span>✓ Monitored Sites:</span>
            <span className="font-mono font-bold">{checked} / {total}</span>
          </div>
          <div className="flex justify-between items-center text-amber-300">
            <span>⚠ Never-Checked:</span>
            <span className="font-mono font-bold">{never}</span>
          </div>
          <div className="flex justify-between items-center text-slate-300 pt-1 border-t border-slate-800/80">
            <span>Total Field Checks:</span>
            <span className="font-mono font-semibold text-white">{obsCount}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

/**
 * CityBarChart Component using Recharts
 */
export function CityBarChart({ data, onCityClick }) {
  const [chartMode, setChartMode] = useState('grouped'); // 'grouped' or 'stacked'

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Monitoring Coverage per Pilot City
            </h3>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300">
              5 Basins
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Recharts comparison of verified sites vs. unmonitored reaches (20 sites per city)
          </p>
        </div>

        {/* View Toggle */}
        <div className="inline-flex rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-1">
          <button
            onClick={() => setChartMode('grouped')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              chartMode === 'grouped'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
            }`}
          >
            Grouped
          </button>
          <button
            onClick={() => setChartMode('stacked')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              chartMode === 'stacked'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
            }`}
          >
            Stacked (Total 20)
          </button>
        </div>
      </div>

      {/* Recharts Container */}
      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 15, left: -15, bottom: 5 }}
            onClick={(state) => {
              if (state && state.activePayload && onCityClick) {
                onCityClick(state.activePayload[0].payload.city);
              }
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
            <XAxis
              dataKey="city"
              tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
              axisLine={{ stroke: '#cbd5e1' }}
              tickLine={false}
            />
            <YAxis
              domain={[0, 22]}
              tick={{ fill: '#64748b', fontSize: 12 }}
              axisLine={{ stroke: '#cbd5e1' }}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip content={<CustomCityTooltip />} cursor={{ fill: 'rgba(2, 132, 199, 0.06)' }} />
            <Legend
              wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }}
              iconType="circle"
            />
            <Bar
              dataKey="checkedSites"
              name="Monitored Sites"
              fill="#0ea5e9"
              stackId={chartMode === 'stacked' ? 'a' : undefined}
              radius={chartMode === 'stacked' ? [0, 0, 0, 0] : [6, 6, 0, 0]}
              maxBarSize={44}
            />
            <Bar
              dataKey="neverChecked"
              name="Never-Checked Sites"
              fill="#f59e0b"
              stackId={chartMode === 'stacked' ? 'a' : undefined}
              radius={[6, 6, 0, 0]}
              maxBarSize={44}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
