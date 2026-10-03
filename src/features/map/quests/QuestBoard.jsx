import React from 'react';
import { computePriority } from './computePriority';

export function QuestBoard({ sites, adoptedSiteIds, onToggleAdopt, onSelectSite, focusedSiteId }) {
  const prioritizedQuests = sites
    .map((site) => ({
      ...site,
      priority: computePriority(site),
    }))
    .sort((a, b) => b.priority.score - a.priority.score)
    .slice(0, 10);

  return (
    <div style={{ marginTop: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '14px' }}>
        <div>
          <h3 style={{ margin: '0 0 4px 0', fontSize: '19px', color: '#0f172a', fontWeight: '700' }}>
            🎯 Urgent Stream Quests (Top 10)
          </h3>
          <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
            Ranked by data staleness and ecological priority • Click any quest to locate on map
          </p>
        </div>
        <span style={{ fontSize: '12px', fontWeight: '600', color: '#2563eb', backgroundColor: '#eff6ff', padding: '4px 10px', borderRadius: '6px' }}>
          Showing 10 of {sites.length} sites
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {prioritizedQuests.map((quest, index) => {
          const isAdopted = adoptedSiteIds.includes(quest.id);
          const isFocused = focusedSiteId === quest.id;

          const badgeColors = {
            red: { bg: '#fee2e2', text: '#991b1b', border: '#fca5a5' },
            amber: { bg: '#fef3c7', text: '#92400e', border: '#fcd34d' },
            green: { bg: '#d1fae5', text: '#065f46', border: '#6ee7b7' },
          }[quest.priority.status];

          return (
            <div
              key={quest.id}
              onClick={() => onSelectSite(quest)}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '14px 18px',
                backgroundColor: isFocused ? '#eff6ff' : '#ffffff',
                border: isFocused ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                borderRadius: '10px',
                boxShadow: isFocused ? '0 4px 12px rgba(59, 130, 246, 0.15)' : '0 1px 3px rgba(0,0,0,0.04)',
                cursor: 'pointer',
                transition: 'all 0.15s ease-in-out',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', flex: 1, paddingRight: '12px' }}>
                <span style={{ fontWeight: '800', fontSize: '16px', color: isFocused ? '#2563eb' : '#94a3b8', minWidth: '28px', marginTop: '2px' }}>
                  #{index + 1}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: '700', color: '#0f172a', fontSize: '15px' }}>{quest.name}</span>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>• {quest.waterBody}</span>
                    <span
                      style={{
                        fontSize: '11px',
                        padding: '2px 8px',
                        borderRadius: '9999px',
                        backgroundColor: badgeColors.bg,
                        color: badgeColors.text,
                        border: `1px solid ${badgeColors.border}`,
                        fontWeight: '700',
                      }}
                    >
                      Urgency: {quest.priority.score}
                    </span>
                  </div>
                  <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#334155', lineHeight: '1.4' }}>
                    👉 {quest.priority.reason}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }} onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => onSelectSite(quest)}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#f1f5f9',
                    color: '#2563eb',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    fontWeight: '600',
                    fontSize: '12px',
                    cursor: 'pointer',
                  }}
                  title="Zoom map to this stream"
                >
                  📍 Locate
                </button>

                <button
                  onClick={() => onToggleAdopt(quest.id)}
                  style={{
                    padding: '6px 14px',
                    backgroundColor: isAdopted ? '#10b981' : '#ffffff',
                    color: isAdopted ? '#ffffff' : '#0f172a',
                    border: isAdopted ? '1px solid #059669' : '1px solid #cbd5e1',
                    borderRadius: '6px',
                    fontWeight: '600',
                    fontSize: '13px',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {isAdopted ? 'Adopted ✓' : 'Adopt'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}