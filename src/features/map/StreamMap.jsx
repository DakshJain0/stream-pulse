import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { createPinIcon, getPinColor } from './mapIcons';

function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

export function StreamMap({ sites, center, zoom, adoptedSiteIds, onToggleAdopt }) {
  return (
    <div style={{ height: '460px', width: '100%', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
      <MapContainer center={center} zoom={zoom} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
        <ChangeView center={center} zoom={zoom} />
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
            >
              <Popup>
                <div style={{ minWidth: '180px', fontFamily: 'sans-serif' }}>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '15px' }}>{site.name}</h4>
                  <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>
                    🌊 {site.waterBody} ({site.streamType?.replace('_', ' ')})
                  </div>
                  
                  <div style={{ fontSize: '13px', marginBottom: '10px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    <div>
                      <strong>Last check: </strong>
                      <span style={{ color: pinColor, fontWeight: 'bold' }}>
                        {site.daysSinceLastCheck === null ? 'Never' : `${site.daysSinceLastCheck} days ago`}
                      </span>
                    </div>
                    <div>
                      <strong>Last rating: </strong>
                      <span>{site.lastRating || 'Unchecked'}</span>
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
                      padding: '7px 10px',
                      backgroundColor: isAdopted ? '#10b981' : '#2563eb',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontWeight: '600',
                      cursor: 'pointer',
                    }}
                  >
                    {isAdopted ? 'Adopted ✓' : 'Adopt Stream'}
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}