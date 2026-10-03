import React, { useState } from 'react';
import initialSitesData from './data/sites.json';
import { StreamMap } from './features/map/StreamMap';
import { QuestBoard } from './features/map/quests/QuestBoard';
import { Dashboard } from './features/dashboard/Dashboard';
import { CheckWizardModal } from './features/streamkeeper/CheckWizardModal';
import { MyStreams } from './features/streamkeeper/MyStreams';

const CITIES = {
  Coimbra: { center: [40.208, -8.43], zoom: 13, country: 'Portugal' },
  Benevento: { center: [41.128, 14.76], zoom: 13, country: 'Italy' },
  Ghent: { center: [51.054, 3.715], zoom: 13, country: 'Belgium' },
  Oslo: { center: [59.915, 10.75], zoom: 13, country: 'Norway' },
  Toulouse: { center: [43.60, 1.44], zoom: 13, country: 'France' },
};

export default function App() {
  const [sites, setSites] = useState(initialSitesData);
  const [activeTab, setActiveTab] = useState('map'); // 'map' | 'my-streams' | 'dashboard'
  const [selectedCity, setSelectedCity] = useState('Coimbra');
  const [adoptedSiteIds, setAdoptedSiteIds] = useState(['COI-001']);
  const [focusedSite, setFocusedSite] = useState(null);

  // Check Wizard State
  const [checkTargetSite, setCheckTargetSite] = useState(null);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [successBanner, setSuccessBanner] = useState(null);

  const citySites = sites.filter((site) => site.city === selectedCity);

  const handleToggleAdopt = (siteId) => {
    setAdoptedSiteIds((prev) =>
      prev.includes(siteId) ? prev.filter((id) => id !== siteId) : [...prev, siteId]
    );
  };

  const handleStartCheck = (site) => {
    setCheckTargetSite(site);
    setIsWizardOpen(true);
  };

  // Submitting check turns the stream GREEN (0d ago) & boosts coverage
  const handleSubmitCheck = (siteId, checkData) => {
    setSites((prevSites) =>
      prevSites.map((site) =>
        site.id === siteId
          ? {
              ...site,
              daysSinceLastCheck: 0,
              lastRating: checkData.lastRating,
            }
          : site
      )
    );

    setSuccessBanner(`🎉 Fresh verification recorded for ${checkTargetSite?.name}! Stream verified and updated live on the map!`);
    setTimeout(() => setSuccessBanner(null), 6000);
  };

  const handleSelectSite = (site) => {
    setSelectedCity(site.city);
    setActiveTab('map');
    setFocusedSite(site);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const freshSites = citySites.filter(
    (s) => s.daysSinceLastCheck !== null && s.daysSinceLastCheck < 30
  ).length;
  const freshnessPercent = citySites.length ? Math.round((freshSites / citySites.length) * 100) : 0;

  return (
    <div style={{ maxWidth: '980px', margin: '0 auto', padding: '24px 16px', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#0f172a' }}>
      
      {/* Success Notification */}
      {successBanner && (
        <div
          style={{
            position: 'sticky',
            top: '12px',
            zIndex: 10000,
            backgroundColor: '#065f46',
            color: '#ffffff',
            padding: '12px 20px',
            borderRadius: '10px',
            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.2)',
            marginBottom: '16px',
            fontWeight: '600',
            fontSize: '14px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span>{successBanner}</span>
          <button
            onClick={() => setSuccessBanner(null)}
            style={{ background: 'none', border: 'none', color: '#fff', fontSize: '18px', cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Header */}
      <header style={{ marginBottom: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <h1 style={{ margin: 0, fontSize: '28px', color: '#0f172a', fontWeight: '800' }}>
              🌊 Urban Stream Pulse
            </h1>
            <span
              style={{
                fontSize: '11px',
                fontWeight: '700',
                letterSpacing: '0.04em',
                backgroundColor: '#fef3c7',
                color: '#92400e',
                border: '1px solid #fcd34d',
                padding: '3px 8px',
                borderRadius: '6px',
                textTransform: 'uppercase',
              }}
            >
              🧪 Demo Data (Synthetic)
            </span>
          </div>
          <p style={{ margin: '6px 0 0 0', color: '#475569', fontSize: '14px', maxWidth: '620px' }}>
            OneAquaHealth pilot: directing volunteers to streams that need revisits right now to keep urban catchment data fresh.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '4px', backgroundColor: '#e2e8f0', padding: '4px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
          <button
            onClick={() => setActiveTab('map')}
            style={{
              padding: '8px 14px',
              borderRadius: '6px',
              border: 'none',
              fontWeight: '700',
              fontSize: '13px',
              cursor: 'pointer',
              backgroundColor: activeTab === 'map' ? '#ffffff' : 'transparent',
              color: activeTab === 'map' ? '#0f172a' : '#64748b',
              boxShadow: activeTab === 'map' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            }}
          >
            🗺️ Map & Quests
          </button>

          <button
            onClick={() => setActiveTab('my-streams')}
            style={{
              padding: '8px 14px',
              borderRadius: '6px',
              border: 'none',
              fontWeight: '700',
              fontSize: '13px',
              cursor: 'pointer',
              backgroundColor: activeTab === 'my-streams' ? '#ffffff' : 'transparent',
              color: activeTab === 'my-streams' ? '#0f172a' : '#64748b',
              boxShadow: activeTab === 'my-streams' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            }}
          >
            ⭐ My Streams ({adoptedSiteIds.length})
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            style={{
              padding: '8px 14px',
              borderRadius: '6px',
              border: 'none',
              fontWeight: '700',
              fontSize: '13px',
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

      {/* City Switcher Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px',
          padding: '14px 20px',
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #cbd5e1',
          boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
          marginBottom: '20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label htmlFor="city-select" style={{ fontWeight: '700', fontSize: '14px', color: '#0f172a' }}>
            Pilot City:
          </label>
          <select
            id="city-select"
            value={selectedCity}
            onChange={(e) => {
              setSelectedCity(e.target.value);
              setFocusedSite(null);
            }}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              border: '1.5px solid #94a3b8',
              fontWeight: '600',
              fontSize: '14px',
              backgroundColor: '#ffffff',
              color: '#0f172a',
              cursor: 'pointer',
              outline: 'none',
              minWidth: '220px',
            }}
          >
            {Object.keys(CITIES).map((cityName) => (
              <option key={cityName} value={cityName} style={{ color: '#0f172a', backgroundColor: '#ffffff' }}>
                {cityName} ({CITIES[cityName].country})
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', gap: '20px', fontSize: '14px', fontWeight: '600' }}>
          <span style={{ color: '#047857' }}>
            🌿 City Freshness: <strong>{freshnessPercent}%</strong> ({freshSites}/{citySites.length} fresh)
          </span>
          <span style={{ color: '#2563eb' }}>
            ⭐ Adopted Streams: <strong>{adoptedSiteIds.length}</strong>
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
            onStartCheck={handleStartCheck}
            focusedSite={focusedSite}
          />

          <QuestBoard
            sites={citySites}
            adoptedSiteIds={adoptedSiteIds}
            onToggleAdopt={handleToggleAdopt}
            onStartCheck={handleStartCheck}
            onSelectSite={handleSelectSite}
            focusedSiteId={focusedSite?.id}
          />
        </>
      )}

      {/* Tab 2: My Streams */}
      {activeTab === 'my-streams' && (
        <MyStreams
          sites={sites}
          adoptedSiteIds={adoptedSiteIds}
          onToggleAdopt={handleToggleAdopt}
          onStartCheck={handleStartCheck}
          onSelectSite={handleSelectSite}
        />
      )}

      {/* Tab 3: City Dashboard */}
      {activeTab === 'dashboard' && (
        <Dashboard
          sites={sites}
          selectedCity={selectedCity}
          onStartCheck={handleStartCheck}
          onSelectSite={handleSelectSite}
        />
      )}

      {/* Check Wizard Modal */}
      <CheckWizardModal
        site={checkTargetSite}
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onSubmitCheck={handleSubmitCheck}
      />
    </div>
  );
}