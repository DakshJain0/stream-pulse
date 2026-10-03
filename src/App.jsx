import React, { useState } from 'react';
import sitesData from './data/sites.json';
import { StreamMap } from './features/map/StreamMap';
import { QuestBoard } from './features/map/quests/QuestBoard';

// Import Laksh's Dashboard components
import { Dashboard } from './features/dashboard/Dashboard';

const CITIES = {
  Coimbra: { center: [40.208, -8.43], zoom: 13, country: 'Portugal' },
  Benevento: { center: [41.128, 14.76], zoom: 13, country: 'Italy' },
  Ghent: { center: [51.054, 3.715], zoom: 13, country: 'Belgium' },
  Oslo: { center: [59.915, 10.75], zoom: 13, country: 'Norway' },
  Toulouse: { center: [43.60, 1.44], zoom: 13, country: 'France' },
};

export default function App() {
  const [activeTab, setActiveTab] = useState('map'); // 'map' or 'dashboard'
  const [selectedCity, setSelectedCity] = useState('Coimbra');
  const [adoptedSiteIds, setAdoptedSiteIds] = useState([]);

  const citySites = sitesData.filter((site) => site.city === selectedCity);

  // The missing function that caused the error:
  const handleToggleAdopt = (siteId) => {
    setAdoptedSiteIds((prev) =>
      prev.includes(siteId) ? prev.filter((id) => id !== siteId) : [...prev, siteId]
    );
  };

  const freshSites = citySites.filter(
    (s) => s.daysSinceLastCheck !== null && s.daysSinceLastCheck < 30
  ).length;
  const freshnessPercent = citySites.length ? Math.round((freshSites / citySites.length) * 100) : 0;

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '20px', fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <header style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ margin: '0 0 6px 0', fontSize: '26px', color: '#0f172a' }}>
            🌊 Urban Stream Pulse
          </h1>
          <p style={{ margin: 0, color: '#475569', fontSize: '14px' }}>
            OneAquaHealth Citizen Science: Directing volunteers to streams that need a revisit right now.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '8px', backgroundColor: '#e2e8f0', padding: '4px', borderRadius: '8px' }}>
          <button
            onClick={() => setActiveTab('map')}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              fontWeight: '600',
              cursor: 'pointer',
              backgroundColor: activeTab === 'map' ? '#ffffff' : 'transparent',
              color: activeTab === 'map' ? '#0f172a' : '#64748b',
              boxShadow: activeTab === 'map' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            }}
          >
            🗺️ Map & Quests
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              fontWeight: '600',
              cursor: 'pointer',
              backgroundColor: activeTab === 'dashboard' ? '#ffffff' : 'transparent',
              color: activeTab === 'dashboard' ? '#0f172a' : '#64748b',
              boxShadow: activeTab === 'dashboard' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            }}
          >
            📊 City Dashboard
          </button>
        </div>
      </header>

      {/* City Switcher & Freshness Status Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          padding: '12px 18px',
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
            🌿 Freshness: <strong>{freshnessPercent}%</strong> ({freshSites}/{citySites.length} fresh)
          </span>
          <span>
            ⭐ Adopted: <strong>{adoptedSiteIds.length}</strong>
          </span>
        </div>
      </div>

      {/* Tab 1: Map & Quests */}
      {activeTab === 'map' && (
        <>
          <StreamMap
            sites={citySites}
            center={CITIES[selectedCity].center}
            zoom={CITIES[selectedCity].zoom}
            adoptedSiteIds={adoptedSiteIds}
            onToggleAdopt={handleToggleAdopt}
          />

          <QuestBoard
            sites={citySites}
            adoptedSiteIds={adoptedSiteIds}
            onToggleAdopt={handleToggleAdopt}
          />
        </>
      )}

      {/* Tab 2: Laksh's City Dashboard */}
      {activeTab === 'dashboard' && (
        <div style={{ marginTop: '10px' }}>
          {Dashboard ? (
            <Dashboard sites={sitesData} selectedCity={selectedCity} />
          ) : (
            <p>Dashboard is loading...</p>
          )}
        </div>
      )}
    </div>
  );
}