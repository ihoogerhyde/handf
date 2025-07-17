import L from 'leaflet';

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export const createPropertyMarker = (property: any) => {
  const color = property.type === 'private' ? '#ef4444' : '#10b981';
  const icon = L.divIcon({
    html: `<div class="w-6 h-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white font-bold text-xs" style="background-color: ${color}">
      ${property.type === 'private' ? 'P' : 'PU'}
    </div>`,
    className: 'custom-div-icon',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });

  return L.marker([property.latitude, property.longitude], { icon })
    .bindPopup(`
      <div class="p-2">
        <h3 class="font-bold text-sm">${property.name}</h3>
        <p class="text-xs text-gray-600">${property.type === 'private' ? 'Private' : 'Public'} Land</p>
        <p class="text-xs">${property.size} acres</p>
      </div>
    `);
};

export const createWildlifeMarker = (wildlife: any) => {
  const getSpeciesIcon = (species: string) => {
    const icons: { [key: string]: string } = {
      'white-tailed-deer': '🦌',
      'elk': '🫎',
      'wild-turkey': '🦃',
      'waterfowl': '🦆',
    };
    return icons[species] || '🐾';
  };

  const getActivityColor = (level: string) => {
    const colors: { [key: string]: string } = {
      'high': '#ef4444',
      'medium': '#f59e0b',
      'low': '#10b981',
    };
    return colors[level] || '#6b7280';
  };

  const icon = L.divIcon({
    html: `<div class="text-2xl transform -translate-x-1/2 -translate-y-1/2 drop-shadow-lg">
      ${getSpeciesIcon(wildlife.species)}
    </div>`,
    className: 'custom-wildlife-icon',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });

  return L.marker([wildlife.latitude, wildlife.longitude], { icon })
    .bindPopup(`
      <div class="p-2">
        <h3 class="font-bold text-sm capitalize">${wildlife.species.replace('-', ' ')}</h3>
        <p class="text-xs text-gray-600">Activity: ${wildlife.activityLevel}</p>
        <p class="text-xs">Season: ${wildlife.season}</p>
        <p class="text-xs">Habitat: ${wildlife.habitat}</p>
      </div>
    `);
};

export const createFishingSpotMarker = (spot: any) => {
  const getWaterIcon = (type: string) => {
    const icons: { [key: string]: string } = {
      'lake': '🏞️',
      'river': '🏞️',
      'stream': '🏞️',
      'pond': '🏞️',
    };
    return icons[type] || '🎣';
  };

  const icon = L.divIcon({
    html: `<div class="text-2xl transform -translate-x-1/2 -translate-y-1/2 drop-shadow-lg">
      ${getWaterIcon(spot.waterType)}
    </div>`,
    className: 'custom-fishing-icon',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });

  return L.marker([spot.latitude, spot.longitude], { icon })
    .bindPopup(`
      <div class="p-2">
        <h3 class="font-bold text-sm">${spot.name}</h3>
        <p class="text-xs text-gray-600">${spot.waterType} - ${spot.depth}ft deep</p>
        <p class="text-xs">Fish: ${spot.fishSpecies?.join(', ')}</p>
        ${spot.hasBoatRamp ? '<p class="text-xs text-green-600">Boat ramp available</p>' : ''}
      </div>
    `);
};

export const createUserWaypointMarker = (waypoint: any) => {
  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      'hunting': '🏹',
      'fishing': '🎣',
      'camping': '⛺',
      'other': '📍',
    };
    return icons[category] || '📍';
  };

  const icon = L.divIcon({
    html: `<div class="text-2xl transform -translate-x-1/2 -translate-y-1/2 drop-shadow-lg">
      ${getCategoryIcon(waypoint.category)}
    </div>`,
    className: 'custom-waypoint-icon',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });

  return L.marker([waypoint.latitude, waypoint.longitude], { icon })
    .bindPopup(`
      <div class="p-2">
        <h3 class="font-bold text-sm">${waypoint.name}</h3>
        <p class="text-xs text-gray-600">${waypoint.category}</p>
        ${waypoint.notes ? `<p class="text-xs">${waypoint.notes}</p>` : ''}
      </div>
    `);
};

export const getMapBounds = (items: Array<{ latitude: number; longitude: number }>): MapBounds => {
  if (items.length === 0) {
    return { north: 49, south: 25, east: -66, west: -125 }; // Continental US bounds
  }

  const lats = items.map(item => item.latitude);
  const lngs = items.map(item => item.longitude);

  return {
    north: Math.max(...lats),
    south: Math.min(...lats),
    east: Math.max(...lngs),
    west: Math.min(...lngs),
  };
};
