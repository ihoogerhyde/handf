import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export interface MapLayers {
  publicLand: boolean;
  privateLand: boolean;
  landownerInfo: boolean;
  elevation: boolean;
  waterways: boolean;
  vegetation: boolean;
  deer: boolean;
  elk: boolean;
  turkey: boolean;
  waterfowl: boolean;
  fishSpecies: boolean;
  waterDepth: boolean;
  boatRamps: boolean;
}

export const useMap = (containerId: string) => {
  const mapRef = useRef<L.Map | null>(null);
  const layerGroupsRef = useRef<{ [key: string]: L.LayerGroup }>({});
  const [mapLoaded, setMapLoaded] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<[number, number] | null>(null);

  const initializeMap = () => {
    if (mapRef.current) return;

    const map = L.map(containerId, {
      center: [39.8283, -98.5795], // Geographic center of US
      zoom: 5,
      zoomControl: false,
    });

    // Add tile layers
    const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
      maxZoom: 18,
    });

    const terrainLayer = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
      maxZoom: 17,
    });

    const topoLayer = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
      maxZoom: 17,
    });

    // Add default layer
    satelliteLayer.addTo(map);

    // Store base layers
    const baseLayers = {
      'Satellite': satelliteLayer,
      'Terrain': terrainLayer,
      'Topographic': topoLayer,
    };

    // Initialize layer groups
    const layerGroups = {
      properties: L.layerGroup(),
      wildlife: L.layerGroup(),
      fishing: L.layerGroup(),
      waypoints: L.layerGroup(),
      elevation: L.layerGroup(),
      waterways: L.layerGroup(),
      vegetation: L.layerGroup(),
    };

    Object.values(layerGroups).forEach(group => group.addTo(map));

    mapRef.current = map;
    layerGroupsRef.current = layerGroups;
    setMapLoaded(true);

    // Store base layers on map instance for layer switching
    (map as any).baseLayers = baseLayers;
  };

  const switchBaseLayer = (layerName: string) => {
    if (!mapRef.current) return;
    
    const baseLayers = (mapRef.current as any).baseLayers;
    if (!baseLayers || !baseLayers[layerName]) return;

    // Remove current base layer
    mapRef.current.eachLayer((layer) => {
      if (layer.options && (layer.options as any).attribution) {
        mapRef.current!.removeLayer(layer);
      }
    });

    // Add new base layer
    baseLayers[layerName].addTo(mapRef.current);
  };

  const addMarkersToLayer = (layerName: string, markers: L.Marker[]) => {
    const layerGroup = layerGroupsRef.current[layerName];
    if (!layerGroup) return;

    layerGroup.clearLayers();
    markers.forEach(marker => layerGroup.addLayer(marker));
  };

  const toggleLayer = (layerName: string, visible: boolean) => {
    const layerGroup = layerGroupsRef.current[layerName];
    if (!layerGroup || !mapRef.current) return;

    if (visible) {
      layerGroup.addTo(mapRef.current);
    } else {
      mapRef.current.removeLayer(layerGroup);
    }
  };

  const zoomIn = () => {
    if (mapRef.current) {
      mapRef.current.zoomIn();
    }
  };

  const zoomOut = () => {
    if (mapRef.current) {
      mapRef.current.zoomOut();
    }
  };

  const panTo = (lat: number, lng: number, zoom?: number) => {
    if (mapRef.current) {
      mapRef.current.setView([lat, lng], zoom || mapRef.current.getZoom());
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation([latitude, longitude]);
        panTo(latitude, longitude, 10);
      },
      (error) => {
        console.error('Error getting location:', error);
      }
    );
  };

  const addClickListener = (callback: (lat: number, lng: number) => void) => {
    if (!mapRef.current) return;

    mapRef.current.on('click', (e) => {
      callback(e.latlng.lat, e.latlng.lng);
    });
  };

  const fitBounds = (bounds: L.LatLngBounds) => {
    if (mapRef.current) {
      mapRef.current.fitBounds(bounds);
    }
  };

  useEffect(() => {
    initializeMap();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [containerId]);

  return {
    map: mapRef.current,
    mapLoaded,
    currentLocation,
    switchBaseLayer,
    addMarkersToLayer,
    toggleLayer,
    zoomIn,
    zoomOut,
    panTo,
    getCurrentLocation,
    addClickListener,
    fitBounds,
  };
};
