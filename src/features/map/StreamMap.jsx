import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { createPinIcon, getPinColor } from './mapIcons';

// Re-centers map when the user picks a new city
function CityController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

// Smoothly flies to and opens popup when a user clicks a quest card
function FocusController({ focusedSite, markerRefs }) {
  const map = useMap();
  useEffect(() => {
    if (focusedSite) {
      const lat = focusedSite.coordinates?.lat ?? focusedSite.lat;
      const lng = focusedSite.coordinates?.lng ?? focusedSite.lng;
      map.flyTo([lat, lng], 15, { duration: 1.2 });
      
      const marker = markerRefs.current[focusedSite.id];
      if (marker) {
        setTimeout(() => marker.openPopup(), 1200);
      }
    }
  }, [focusedSite, map, markerRefs]);
  return null;
}

export function StreamMap({ sites, center, zoom, adoptedSiteIds, onToggleAdopt, focusedSite }) {
  const markerRefs = useRef({});

  return (
    <div style={{ position: 'relative', height: '480px', width: '100%', borderRadius: '14px', overflow: 'hidden', border: '1px solid #cbd5e1', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
      <MapContainer center={center} zoom={zoom} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
        <CityController center={center} zoom={zoom} />
        <FocusController focusedSite={focusedSite} markerRefs={markerRefs} />
        
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {sites.map((site) => {
          const lat = site.coordinates?.lat ?? site.lat;
          const lng = site.coordinates?.lng ?? site.lng;
          const isAdopted = adoptedSiteIds.includes(site.id);
          const pinColor = getPinColor(site.daysSinceLastCheck);

          return (
            <Marker
              key={site.id}
              position={[lat, lng]}
              icon={createPinIcon(site.daysSinceLastCheck)}
              ref={(ref) => {
                if (ref) markerRefs.current[site.id] = ref;
              }}
            >
              <Popup>
                <div style={{ minWidth: '190px', color: '#0f172a' }}>
                  <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', fontWeight: 'bold' }}>
                    {site.id} • {site.city}
                  </div>
                  <h4 style={{ margin: '4px 0 6px 0', fontSize: '15px', color: '#0f172a' }}>{site.name}</h4>
                  
                  <div style={{ fontSize: '12px', color: '#334155', marginBottom: '8px' }}>
                    🌊 <strong>{site.waterBody}</strong> ({site.streamType?.replace('_', ' ')})
                  </div>
                  
                  <div style={{ fontSize: '13px', marginBottom: '10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div>
                      <strong>Freshness: </strong>
                      <span style={{ color: pinColor, fontWeight: 'bold' }}>
                        {site.daysSinceLastCheck === null ? 'Never checked' : `${site.daysSinceLastCheck} days ago`}
                      </span>
                    </div>
                    <div>
                      <strong>Last rating: </strong>
                      <span>{site.lastRating || 'Unrecorded'}</span>
                    </div>
                    <div>
                      <strong>Access: </strong>
                      <span>{site.accessibility?.replace('_', ' ')}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onToggleAdopt(site.id)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      backgroundColor: isAdopted ? '#10b981' : '#2563eb',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      fontSize: '13px',
                      transition: 'background-color 0.2s',
                    }}
                  >
                    {isAdopted ? 'Adopted ✓' : '⭐ Adopt Stream'}
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Floating Map Legend */}
      <div
        style={{
          position: 'absolute',
          bottom: '16px',
          right: '16px',
          zIndex: 1000,
          backgroundColor: 'rgba(255, 255, 255, 0.94)',
          backdropFilter: 'blur(4px)',
          padding: '10px 14px',
          borderRadius: '10px',
          border: '1px solid #cbd5e1',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
          fontSize: '12px',
          color: '#0f172a',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
        }}
      >
        <div style={{ fontWeight: 'bold', borderBottom: '1px solid #e2e8f0', paddingBottom: '4px', marginBottom: '2px' }}>
          Pin Freshness
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10b981' }}></span>
          <span>&lt; 30 days (Fresh)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#f59e0b' }}></span>
          <span>30 – 90 days (Due soon)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ef4444' }}></span>
          <span>&gt; 90 days or never (Stale)</span>
        </div>
      </div>
    </div>
  );
}