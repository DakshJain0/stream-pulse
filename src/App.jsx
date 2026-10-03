import React, { useState } from 'react';
import sitesData from './data/sites.json';
import { StreamMap } from './features/map/StreamMap';
import { QuestBoard } from './features/map/quests/QuestBoard';
import { useStreamStore } from './lib/store';

const CITIES = {
  Coimbra: { center: [40.208, -8.43], zoom: 13, country: 'Portugal' },
  Benevento: { center: [41.128, 14.76], zoom: 13, country: 'Italy' },
  Ghent: { center: [51.054, 3.715], zoom: 13, country: 'Belgium' },
  Oslo: { center: [59.915, 10.75], zoom: 13, country: 'Norway' },
  Toulouse: { center: [43.60, 1.44], zoom: 13, country: 'France' },
};

export default function App() {
  const [selectedCity, setSelectedCity] = useState('Coimbra');
  const { adoptedSiteIds, streaks, toggleAdoptSite, resetDemoData } = useStreamStore();

  const citySites = sitesData.filter((site) => site.city === selectedCity);

  const freshSites = citySites.filter(
    (s) => s.daysSinceLastCheck !== null && s.daysSinceLastCheck < 30
  ).length;
  const freshnessPercent = citySites.length ? Math.round((freshSites / citySites.length) * 100) : 0;

  const handleReset = () => {
    if (window.confirm('Reset all demo data back to default initial state?')) {
      resetDemoData();
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ margin: '0 0 8px 0', fontSize: '26px', color: '#0f172a' }}>
            🌊 Urban Stream Pulse
          </h1>
          <p style={{ margin: 0, color: '#475569', fontSize: '15px' }}>
            OneAquaHealth Citizen Science: Directing volunteers to streams that need a revisit right now.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Volunteer Activity Streak */}
          <div
            style={{
              padding: '6px 12px',
              borderRadius: '9999px',
              backgroundColor: '#fff7ed',
              border: '1px solid #fdba74',
              color: '#c2410c',
              fontSize: '13px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
            title={`Longest streak: ${streaks.longestStreak} days`}
          >
            <span>🔥</span>
            <span>{streaks.currentStreak} Day Streak</span>
          </div>

          {/* Reset Demo Data Button */}
          <button
            onClick={handleReset}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              backgroundColor: '#fee2e2',
              border: '1px solid #fca5a5',
              color: '#991b1b',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
            title="Reset adopted sites, observations, and streaks back to demo baseline"
          >
            ↺ Reset Demo Data
          </button>
        </div>
      </header>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          padding: '14px 18px',
          backgroundColor: '#f8fafc',
          borderRadius: '10px',
          border: '1px solid #e2e8f0',
          marginBottom: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label htmlFor="city-select" style={{ fontWeight: '600', fontSize: '14px', color: '#1e293b' }}>
            City:
          </label>
          <select
            id="city-select"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              fontWeight: '500',
              fontSize: '14px',
              backgroundColor: '#fff',
            }}
          >
            {Object.keys(CITIES).map((cityName) => (
              <option key={cityName} value={cityName}>
                {cityName} ({CITIES[cityName].country})
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', gap: '16px', fontSize: '14px' }}>
          <span>
            🌿 City Freshness: <strong>{freshnessPercent}%</strong> ({freshSites}/{citySites.length} fresh)
          </span>
          <span>
            ⭐ Adopted by you: <strong>{adoptedSiteIds.length}</strong>
          </span>
        </div>
      </div>

      <StreamMap
        sites={citySites}
        center={CITIES[selectedCity].center}
        zoom={CITIES[selectedCity].zoom}
        adoptedSiteIds={adoptedSiteIds}
        onToggleAdopt={toggleAdoptSite}
      />

      <QuestBoard
        sites={citySites}
        adoptedSiteIds={adoptedSiteIds}
        onToggleAdopt={toggleAdoptSite}
      />
    </div>
  );
}