import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useMap } from '@/hooks/useMap';
import { createPropertyMarker, createWildlifeMarker, createFishingSpotMarker } from '@/lib/mapUtils';
import { Button } from '@/components/ui/button';
import { MapPin, Ruler, ZoomIn, ZoomOut, Navigation } from 'lucide-react';
import { PropertyModal } from './PropertyModal';
import { LegendPanel } from './LegendPanel';
import type { Property, WildlifeData, FishingSpot } from '@shared/schema';
import L from 'leaflet';

interface MapContainerProps {
  activeLayers: {
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
  };
  baseLayer: string;
  onPropertyClick: (property: Property) => void;
}

export function MapContainer({ activeLayers, baseLayer, onPropertyClick }: MapContainerProps) {
  const mapContainerId = 'map-container';
  const { map, mapLoaded, switchBaseLayer, addMarkersToLayer, toggleLayer, zoomIn, zoomOut, getCurrentLocation, addClickListener } = useMap(mapContainerId);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [currentBounds, setCurrentBounds] = useState<string | null>(null);

  // Update bounds when map moves
  useEffect(() => {
    if (!map) return;
    
    const updateBounds = () => {
      const bounds = map.getBounds();
      const boundsObj = {
        north: bounds.getNorth(),
        south: bounds.getSouth(),
        east: bounds.getEast(),
        west: bounds.getWest()
      };
      setCurrentBounds(JSON.stringify(boundsObj));
    };

    // Initial bounds
    updateBounds();

    // Listen for map events
    map.on('moveend', updateBounds);
    map.on('zoomend', updateBounds);

    return () => {
      map.off('moveend', updateBounds);
      map.off('zoomend', updateBounds);
    };
  }, [map]);

  // Fetch properties data based on current bounds
  const { data: properties = [] } = useQuery<Property[]>({
    queryKey: currentBounds ? [`/api/properties?bounds=${encodeURIComponent(currentBounds)}`] : ['/api/properties'],
    enabled: mapLoaded,
  });

  // Fetch wildlife data based on current bounds
  const { data: wildlifeData = [] } = useQuery<WildlifeData[]>({
    queryKey: currentBounds ? [`/api/wildlife?bounds=${encodeURIComponent(currentBounds)}`] : ['/api/wildlife'],
    enabled: mapLoaded,
  });

  // Fetch fishing spots based on current bounds
  const { data: fishingSpots = [] } = useQuery<FishingSpot[]>({
    queryKey: currentBounds ? [`/api/fishing-spots?bounds=${encodeURIComponent(currentBounds)}`] : ['/api/fishing-spots'],
    enabled: mapLoaded,
  });

  // Update base layer when changed
  useEffect(() => {
    if (mapLoaded) {
      switchBaseLayer(baseLayer);
    }
  }, [baseLayer, mapLoaded, switchBaseLayer]);

  // Update property markers based on layer toggles
  useEffect(() => {
    if (!mapLoaded || !properties.length) return;

    const filteredProperties = properties.filter(property => {
      if (property.type === 'public' && !activeLayers.publicLand) return false;
      if (property.type === 'private' && !activeLayers.privateLand) return false;
      return true;
    });

    const propertyMarkers = filteredProperties.map(property => {
      const marker = createPropertyMarker(property);
      marker.on('click', () => {
        setSelectedProperty(property);
        onPropertyClick(property);
      });
      return marker;
    });

    addMarkersToLayer('properties', propertyMarkers);
  }, [properties, activeLayers.publicLand, activeLayers.privateLand, mapLoaded, addMarkersToLayer, onPropertyClick]);

  // Update wildlife markers based on layer toggles
  useEffect(() => {
    if (!mapLoaded || !wildlifeData.length) return;

    const filteredWildlife = wildlifeData.filter(wildlife => {
      if (wildlife.species === 'white-tailed-deer' && !activeLayers.deer) return false;
      if (wildlife.species === 'elk' && !activeLayers.elk) return false;
      if (wildlife.species === 'wild-turkey' && !activeLayers.turkey) return false;
      if (wildlife.species === 'waterfowl' && !activeLayers.waterfowl) return false;
      return true;
    });

    const wildlifeMarkers = filteredWildlife.map(wildlife => 
      createWildlifeMarker(wildlife)
    );

    addMarkersToLayer('wildlife', wildlifeMarkers);
  }, [wildlifeData, activeLayers.deer, activeLayers.elk, activeLayers.turkey, activeLayers.waterfowl, mapLoaded, addMarkersToLayer]);

  // Update fishing spots markers
  useEffect(() => {
    if (!mapLoaded || !fishingSpots.length) return;

    const filteredFishingSpots = fishingSpots.filter(spot => {
      if (!activeLayers.fishSpecies && !activeLayers.waterDepth && !activeLayers.boatRamps) return false;
      return true;
    });

    const fishingMarkers = filteredFishingSpots.map(spot => 
      createFishingSpotMarker(spot)
    );

    addMarkersToLayer('fishing', fishingMarkers);
  }, [fishingSpots, activeLayers.fishSpecies, activeLayers.waterDepth, activeLayers.boatRamps, mapLoaded, addMarkersToLayer]);

  return (
    <div className="relative w-full h-full">
      <div id={mapContainerId} className="w-full h-full" />
      
      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-40 space-y-2">
        <Button
          size="sm"
          variant="secondary"
          className="bg-white shadow-lg hover:bg-gray-50"
          onClick={zoomIn}
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="secondary"
          className="bg-white shadow-lg hover:bg-gray-50"
          onClick={zoomOut}
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="secondary"
          className="bg-white shadow-lg hover:bg-gray-50"
          onClick={getCurrentLocation}
        >
          <Navigation className="h-4 w-4" />
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="absolute bottom-4 right-4 z-40 space-y-2">
        <Button
          size="sm"
          className="bg-forest text-white shadow-lg hover:bg-forest/90 rounded-full p-3"
        >
          <Ruler className="h-5 w-5" />
        </Button>
        <Button
          size="sm"
          className="bg-hunter text-white shadow-lg hover:bg-hunter/90 rounded-full p-3"
        >
          <MapPin className="h-5 w-5" />
        </Button>
      </div>

      {/* Legend Panel */}
      <LegendPanel />

      {/* Property Modal */}
      {selectedProperty && (
        <PropertyModal
          property={selectedProperty}
          open={!!selectedProperty}
          onClose={() => setSelectedProperty(null)}
        />
      )}
    </div>
  );
}
