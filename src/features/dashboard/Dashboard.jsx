import React, { useState } from 'react';

export function Dashboard({ sites, selectedCity, onStartCheck, onSelectSite }) {
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'FRESH' | 'DUE' | 'STALE'
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Data synchronized strictly with selected city
  const citySites = sites.filter((s) => s.city === selectedCity);
  const totalSites = citySites.length;

  const freshSites = citySites.filter((s) => s.daysSinceLastCheck !== null && s.daysSinceLastCheck < 30);
  const dueSoonSites = citySites.filter((s) => s.daysSinceLastCheck !== null && s.daysSinceLastCheck >= 30 && s.daysSinceLastCheck <= 90);
  const staleSites = citySites.filter((s) => s.daysSinceLastCheck === null || s.daysSinceLastCheck > 90);

  const coveragePercent = totalSites ? Math.round((freshSites.length / totalSites) * 100) : 0;

  // Filtered Table Data
  const filteredSites = citySites.filter((site) => {
    const matchesSearch =
      site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      site.waterBody.toLowerCase().includes(searchQuery.toLowerCase()) ||
      site.id.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (statusFilter === 'FRESH') return site.daysSinceLastCheck !== null && site.daysSinceLastCheck < 30;
    if (statusFilter === 'DUE') return site.daysSinceLastCheck !== null && site.daysSinceLastCheck >= 30 && site.daysSinceLastCheck <= 90;
    if (statusFilter === 'STALE') return site.daysSinceLastCheck === null || site.daysSinceLastCheck > 90;
    return true;
  });

  return (
    <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* 4 Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
        <div style={{ backgroundColor: '#ffffff', padding: '18px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>
            Data Freshness
          </div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#047857', marginTop: '6px' }}>
            {coveragePercent}%
          </div>
          <div style={{ fontSize: '13px', color: '#475569', marginTop: '4px' }}>
            {freshSites.length} of {totalSites} reaches verified &lt;30d
          </div>
        </div>

        <div style={{ backgroundColor: '#ffffff', padding: '18px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>
            Due for Revisit
          </div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#b45309', marginTop: '6px' }}>
            {dueSoonSites.length}
          </div>
          <div style={{ fontSize: '13px', color: '#475569', marginTop: '4px' }}>
            Inspected 30–90 days ago
          </div>
        </div>

        <div style={{ backgroundColor: '#ffffff', padding: '18px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>
            Stale / Unchecked
          </div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#b91c1c', marginTop: '6px' }}>
            {staleSites.length}
          </div>
          <div style={{ fontSize: '13px', color: '#475569', marginTop: '4px' }}>
            Overdue (&gt;90d or no baseline)
          </div>
        </div>

        <div style={{ backgroundColor: '#ffffff', padding: '18px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>
            Monitoring Target
          </div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#2563eb', marginTop: '6px' }}>
            80%
          </div>
          <div style={{ fontSize: '13px', color: '#475569', marginTop: '4px' }}>
            Citywide shared coverage goal
          </div>
        </div>
      </div>

      {/* Freshness Distribution Progress Bar */}
      <div style={{ backgroundColor: '#ffffff', padding: '18px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontWeight: '700', fontSize: '14px', color: '#0f172a' }}>
            {selectedCity} Catchment Freshness Distribution
          </span>
          <span style={{ fontSize: '13px', color: '#64748b' }}>
            Total: {totalSites} monitoring sites
          </span>
        </div>

        {/* Visual Stacked Bar */}
        <div style={{ height: '14px', width: '100%', backgroundColor: '#f1f5f9', borderRadius: '8px', overflow: 'hidden', display: 'flex' }}>
          <div style={{ width: `${(freshSites.length / totalSites) * 100}%`, backgroundColor: '#10b981' }} title={`Fresh: ${freshSites.length}`}></div>
          <div style={{ width: `${(dueSoonSites.length / totalSites) * 100}%`, backgroundColor: '#f59e0b' }} title={`Due Soon: ${dueSoonSites.length}`}></div>
          <div style={{ width: `${(staleSites.length / totalSites) * 100}%`, backgroundColor: '#ef4444' }} title={`Stale: ${staleSites.length}`}></div>
        </div>

        {/* Legend under bar */}
        <div style={{ display: 'flex', gap: '20px', marginTop: '10px', fontSize: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: '#10b981' }}></span>
            <span>Fresh &lt;30d: <strong>{freshSites.length}</strong></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: '#f59e0b' }}></span>
            <span>Due Soon 30–90d: <strong>{dueSoonSites.length}</strong></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: '#ef4444' }}></span>
            <span>Stale / Never: <strong>{staleSites.length}</strong></span>
          </div>
        </div>
      </div>

      {/* Pilot Site Registry Table */}
      <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
        
        {/* Table Controls */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ margin: '0 0 2px 0', fontSize: '16px', fontWeight: '800', color: '#0f172a' }}>
              {selectedCity} Stream Registry ({filteredSites.length})
            </h3>
            <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
              Filter by data age or search by river reach
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Search */}
            <input
              type="text"
              placeholder="Search stream or river..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                padding: '7px 12px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '13px',
                outline: 'none',
              }}
            />

            {/* Filter Buttons */}
            <div style={{ display: 'flex', gap: '4px', backgroundColor: '#f1f5f9', padding: '3px', borderRadius: '6px' }}>
              {[
                { id: 'ALL', label: 'All' },
                { id: 'FRESH', label: 'Fresh' },
                { id: 'DUE', label: 'Due' },
                { id: 'STALE', label: 'Stale' },
              ].map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => setStatusFilter(btn.id)}
                  style={{
                    padding: '5px 10px',
                    borderRadius: '4px',
                    border: 'none',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    backgroundColor: statusFilter === btn.id ? '#ffffff' : 'transparent',
                    color: statusFilter === btn.id ? '#0f172a' : '#64748b',
                    boxShadow: statusFilter === btn.id ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
                  }}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', color: '#64748b', borderBottom: '1px solid #e2e8f0', fontSize: '12px', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 18px' }}>Site ID</th>
                <th style={{ padding: '12px 18px' }}>Reach & Waterbody</th>
                <th style={{ padding: '12px 18px' }}>Type</th>
                <th style={{ padding: '12px 18px' }}>Freshness Status</th>
                <th style={{ padding: '12px 18px' }}>Last Rating</th>
                <th style={{ padding: '12px 18px', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredSites.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>
                    No streams match your filter.
                  </td>
                </tr>
              ) : (
                filteredSites.map((site) => {
                  const days = site.daysSinceLastCheck;
                  const isFresh = days !== null && days < 30;
                  const isDue = days !== null && days >= 30 && days <= 90;

                  const statusBadge = isFresh
                    ? { bg: '#d1fae5', text: '#065f46', label: `${days}d ago (Fresh)` }
                    : isDue
                    ? { bg: '#fef3c7', text: '#92400e', label: `${days}d ago (Due)` }
                    : { bg: '#fee2e2', text: '#991b1b', label: days === null ? 'Never Checked' : `${days}d ago (Stale)` };

                  return (
                    <tr key={site.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px 18px', fontWeight: '600', color: '#475569' }}>
                        {site.id}
                      </td>
                      <td style={{ padding: '12px 18px' }}>
                        <div style={{ fontWeight: '700', color: '#0f172a' }}>{site.name}</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>🌊 {site.waterBody}</div>
                      </td>
                      <td style={{ padding: '12px 18px', color: '#475569', textTransform: 'capitalize' }}>
                        {site.streamType?.replace('_', ' ')}
                      </td>
                      <td style={{ padding: '12px 18px' }}>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: '700',
                            padding: '3px 8px',
                            borderRadius: '9999px',
                            backgroundColor: statusBadge.bg,
                            color: statusBadge.text,
                          }}
                        >
                          {statusBadge.label}
                        </span>
                      </td>
                      <td style={{ padding: '12px 18px', fontWeight: '600', color: '#334155' }}>
                        {site.lastRating || 'Unrecorded'}
                      </td>
                      <td style={{ padding: '12px 18px', textAlign: 'right' }}>
                        <button
                          onClick={() => onStartCheck?.(site)}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#10b981',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '6px',
                            fontWeight: '600',
                            fontSize: '12px',
                            cursor: 'pointer',
                          }}
                        >
                          Verify
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}