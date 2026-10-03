import L from 'leaflet';

export function getPinColor(daysSinceLastCheck) {
  if (daysSinceLastCheck === null || daysSinceLastCheck === undefined || daysSinceLastCheck > 90) {
    return '#ef4444'; // Red (> 90 days or never)
  }
  if (daysSinceLastCheck >= 30) {
    return '#f59e0b'; // Amber (30 - 90 days)
  }
  return '#10b981'; // Green (< 30 days)
}

export function createPinIcon(daysSinceLastCheck) {
  const color = getPinColor(daysSinceLastCheck);

  const svgHtml = `
    <div style="display:flex; justify-content:center; align-items:center; width:30px; height:30px;">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="${color}" stroke="#ffffff" stroke-width="2" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
        <circle cx="12" cy="9" r="3" fill="#ffffff"/>
      </svg>
    </div>
  `;

  return L.divIcon({
    html: svgHtml,
    className: 'custom-stream-pin',
    iconSize: [30, 30],
    iconAnchor: [15, 28],
    popupAnchor: [0, -28],
  });
}