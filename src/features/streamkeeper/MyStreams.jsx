import React from 'react';

export function MyStreams({ sites, adoptedSiteIds, onToggleAdopt, onStartCheck, onSelectSite }) {
  const adoptedSites = sites.filter((s) => adoptedSiteIds.includes(s.id));

  return (
    <div style={{ marginTop: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <h2 style={{ margin: '0 0 4px 0', fontSize: '22px', fontWeight: '800', color: '#0f172a' }}>
            ⭐ My Adopted Streams ({adoptedSites.length})
          </h2>
          <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
            Continuous monitoring prevents stale data. Aim to revisit your adopted reaches every 30 days!
          </p>
        </div>
      </div>

      {adoptedSites.length === 0 ? (
        <div
          style={{
            padding: '48px 24px',
            textAlign: 'center',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '2px dashed #cbd5e1',
            color: '#64748b',
          }}
        >
          <div style={{ fontSize: '36px', marginBottom: '12px' }}>🌊</div>
          <h4 style={{ margin: '0 0 6px 0', fontSize: '16px', color: '#0f172a' }}>You haven't adopted any streams yet</h4>
          <p style={{ margin: '0 0 16px 0', fontSize: '13px' }}>
            Go to the <strong>Map & Quests</strong> tab and click <strong>"Adopt"</strong> on reaches you want to steward!
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {adoptedSites.map((site) => {
            const days = site.daysSinceLastCheck;
            const isFresh = days !== null && days < 30;

            // Revisit window calculation (30-day recommended cycle)
            let dueText = '';
            let dueColor = '#047857';

            if (days === null) {
              dueText = '⚠️ Baseline check pending';
              dueColor = '#b91c1c';
            } else if (days === 0) {
              dueText = 'Next check due in 30 days';
              dueColor = '#047857';
            } else if (days < 30) {
              dueText = `Next check due in ${30 - days} days`;
              dueColor = '#047857';
            } else {
              dueText = `Overdue by ${days - 30} days`;
              dueColor = '#b91c1c';
            }

            return (
              <div
                key={site.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px 20px',
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
                  flexWrap: 'wrap',
                  gap: '14px',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: '700', fontSize: '16px', color: '#0f172a' }}>{site.name}</span>
                    <span
                      style={{
                        fontSize: '11px',
                        padding: '2px 8px',
                        borderRadius: '9999px',
                        backgroundColor: isFresh ? '#d1fae5' : '#fee2e2',
                        color: isFresh ? '#065f46' : '#991b1b',
                        fontWeight: '700',
                      }}
                    >
                      {isFresh ? 'Fresh (<30d)' : 'Needs Check'}
                    </span>
                    <span
                      style={{
                        fontSize: '11px',
                        padding: '2px 8px',
                        borderRadius: '9999px',
                        backgroundColor: '#f1f5f9',
                        color: '#475569',
                        fontWeight: '600',
                      }}
                    >
                      🔥 {days === 0 ? 'Active Streak: 1 Revisit' : 'Steward'}
                    </span>
                  </div>

                  <div style={{ fontSize: '13px', color: '#475569', marginTop: '6px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <span>🌊 {site.waterBody} ({site.city})</span>
                    <span>
                      Last checked: <strong>{days === 0 ? 'Today (0d)' : days === null ? 'Never' : `${days}d ago`}</strong>
                    </span>
                    <span style={{ color: dueColor, fontWeight: '700' }}>
                      🗓️ {dueText}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => onSelectSite(site)}
                    style={{
                      padding: '8px 14px',
                      backgroundColor: '#f1f5f9',
                      color: '#2563eb',
                      border: '1px solid #cbd5e1',
                      borderRadius: '8px',
                      fontWeight: '600',
                      fontSize: '13px',
                      cursor: 'pointer',
                    }}
                  >
                    📍 Show on Map
                  </button>

                  <button
                    onClick={() => onStartCheck(site)}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#10b981',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: '700',
                      fontSize: '13px',
                      cursor: 'pointer',
                    }}
                  >
                    📝 Start Check
                  </button>

                  <button
                    onClick={() => onToggleAdopt(site.id)}
                    style={{
                      padding: '8px 12px',
                      backgroundColor: 'transparent',
                      color: '#94a3b8',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '13px',
                      cursor: 'pointer',
                    }}
                    title="Unadopt stream"
                  >
                    ✕
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}