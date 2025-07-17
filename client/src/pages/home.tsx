import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapContainer } from '@/components/MapContainer';
import { LayerPanel } from '@/components/LayerPanel';
import { MobileNavigation } from '@/components/MobileNavigation';
import { Crosshair, Search, Layers, Menu } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import type { Property } from '@shared/schema';

export default function Home() {
  const isMobile = useIsMobile();
  const [layerPanelOpen, setLayerPanelOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('map');
  const [searchQuery, setSearchQuery] = useState('');
  const [baseLayer, setBaseLayer] = useState('Satellite');

  const [activeLayers, setActiveLayers] = useState({
    publicLand: true,
    privateLand: true,
    landownerInfo: false,
    elevation: false,
    waterways: true,
    vegetation: false,
    deer: false,
    elk: false,
    turkey: false,
    waterfowl: false,
    fishSpecies: false,
    waterDepth: false,
    boatRamps: false,
  });

  const { data: searchResults = [] } = useQuery<Property[]>({
    queryKey: searchQuery.length > 2 ? [`/api/properties?q=${encodeURIComponent(searchQuery)}`] : ['/api/properties'],
    enabled: searchQuery.length > 2,
  });

  const handleLayerToggle = (layer: string, enabled: boolean) => {
    setActiveLayers(prev => ({
      ...prev,
      [layer]: enabled,
    }));
  };

  const handlePropertyClick = (property: Property) => {
    console.log('Property clicked:', property);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Search for:', searchQuery);
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="bg-forest text-white shadow-lg relative z-50">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Crosshair className="text-hunter text-2xl" />
                <h1 className="text-xl font-bold">WildTracker</h1>
              </div>
            </div>
            
            {/* Desktop Search Bar */}
            {!isMobile && (
              <div className="flex-1 max-w-md mx-4">
                <form onSubmit={handleSearchSubmit} className="relative">
                  <Input
                    type="text"
                    placeholder="Search locations, properties..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 text-gray-900 bg-white rounded-lg focus:ring-2 focus:ring-hunter"
                  />
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                </form>
              </div>
            )}
            
            <div className="flex items-center space-x-3">
              {isMobile && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMobileSearchOpen(true)}
                  className="text-white hover:text-hunter"
                >
                  <Search className="h-5 w-5" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLayerPanelOpen(true)}
                className="text-white hover:text-hunter"
              >
                <Layers className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:text-hunter"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative">
        <MapContainer
          activeLayers={activeLayers}
          baseLayer={baseLayer}
          onPropertyClick={handlePropertyClick}
        />
        
        {/* Layer Panel */}
        <LayerPanel
          open={layerPanelOpen}
          onClose={() => setLayerPanelOpen(false)}
          activeLayers={activeLayers}
          onLayerToggle={handleLayerToggle}
          baseLayer={baseLayer}
          onBaseLayerChange={setBaseLayer}
        />
      </main>

      {/* Mobile Navigation */}
      {isMobile && (
        <MobileNavigation
          onLayersToggle={() => setLayerPanelOpen(true)}
          onSearchToggle={() => setMobileSearchOpen(true)}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      )}

      {/* Mobile Search Overlay */}
      {isMobile && mobileSearchOpen && (
        <div className="fixed inset-0 bg-white z-60 md:hidden">
          <div className="p-4">
            <div className="flex items-center space-x-3 mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileSearchOpen(false)}
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Button>
              <form onSubmit={handleSearchSubmit} className="flex-1">
                <Input
                  type="text"
                  placeholder="Search locations, properties..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                  autoFocus
                />
              </form>
            </div>
            
            {searchResults.length > 0 && (
              <div className="space-y-2">
                {searchResults.map((property) => (
                  <div
                    key={property.id}
                    className="p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50"
                    onClick={() => {
                      handlePropertyClick(property);
                      setMobileSearchOpen(false);
                    }}
                  >
                    <div className="font-medium text-charcoal">{property.name}</div>
                    <div className="text-sm text-gray-600">
                      {property.type === 'private' ? 'Private' : 'Public'} Land - {property.size} acres
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
