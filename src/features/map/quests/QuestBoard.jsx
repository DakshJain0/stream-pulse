import React from 'react';
import { computePriority } from './computePriority';

export function QuestBoard({ sites, adoptedSiteIds, onToggleAdopt }) {
  const prioritizedQuests = sites
    .map((site) => ({
      ...site,
      priority: computePriority(site),
    }))
    .sort((a, b) => b.priority.score - a.priority.score)
    .slice(0, 10);

  return (
    <div style={{ marginTop: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h3 style={{ margin: 0, fontSize: '18px' }}>🎯 Urgent Stream Quests (Top 10)</h3>
        <span style={{ fontSize: '13px', color: '#6b7280' }}>Prioritized by staleness & risk</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {prioritizedQuests.map((quest, index) => {
          const isAdopted = adoptedSiteIds.includes(quest.id);
          const badgeColors = {
            red: { bg: '#fee2e2', text: '#991b1b', border: '#f87171' },
            amber: { bg: '#fef3c7', text: '#92400e', border: '#fcd34d' },
            green: { bg: '#d1fae5', text: '#065f46', border: '#6ee7b7' },
          }[quest.priority.status];

          return (
            <div
              key={quest.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 16px',
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <span style={{ fontWeight: 'bold', fontSize: '16px', color: '#9ca3af', minWidth: '24px' }}>
                  #{index + 1}
                </span>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: '600', color: '#111827' }}>{quest.name}</span>
                    <span
                      style={{
                        fontSize: '11px',
                        padding: '2px 8px',
                        borderRadius: '9999px',
                        backgroundColor: badgeColors.bg,
                        color: badgeColors.text,
                        border: `1px solid ${badgeColors.border}`,
                        fontWeight: '600',
                      }}
                    >
                      Score: {quest.priority.score}
                    </span>
                  </div>
                  <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#4b5563' }}>
                    👉 {quest.priority.reason}
                  </p>
                </div>
              </div>

              <button
                onClick={() => onToggleAdopt(quest.id)}
                style={{
                  padding: '6px 14px',
                  backgroundColor: isAdopted ? '#10b981' : '#f3f4f6',
                  color: isAdopted ? '#ffffff' : '#374151',
                  border: isAdopted ? 'none' : '1px solid #d1d5db',
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
          );
        })}
      </div>
    </div>
  );
}