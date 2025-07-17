import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { X, Mountain, Dog, Fish, Trees, Waves, Navigation } from 'lucide-react';

interface LayerPanelProps {
  open: boolean;
  onClose: () => void;
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
  onLayerToggle: (layer: string, enabled: boolean) => void;
  baseLayer: string;
  onBaseLayerChange: (layer: string) => void;
}

export function LayerPanel({ 
  open, 
  onClose, 
  activeLayers, 
  onLayerToggle, 
  baseLayer, 
  onBaseLayerChange 
}: LayerPanelProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    baseMap: true,
    property: true,
    terrain: true,
    wildlife: true,
    fishing: true,
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const layerSections = [
    {
      id: 'baseMap',
      title: 'Base Map',
      icon: <Navigation className="h-4 w-4" />,
      content: (
        <RadioGroup
          value={baseLayer}
          onValueChange={onBaseLayerChange}
          className="space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Satellite" id="satellite" />
            <Label htmlFor="satellite">Satellite</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Terrain" id="terrain" />
            <Label htmlFor="terrain">Terrain</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Topographic" id="topo" />
            <Label htmlFor="topo">Topographic</Label>
          </div>
        </RadioGroup>
      )
    },
    {
      id: 'property',
      title: 'Property Data',
      icon: <Mountain className="h-4 w-4" />,
      content: (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="publicLand" className="text-sm">Public Land</Label>
            <Switch
              id="publicLand"
              checked={activeLayers.publicLand}
              onCheckedChange={(checked) => onLayerToggle('publicLand', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="privateLand" className="text-sm">Private Land</Label>
            <Switch
              id="privateLand"
              checked={activeLayers.privateLand}
              onCheckedChange={(checked) => onLayerToggle('privateLand', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="landownerInfo" className="text-sm">Landowner Info</Label>
            <Switch
              id="landownerInfo"
              checked={activeLayers.landownerInfo}
              onCheckedChange={(checked) => onLayerToggle('landownerInfo', checked)}
            />
          </div>
        </div>
      )
    },
    {
      id: 'terrain',
      title: 'Terrain Features',
      icon: <Trees className="h-4 w-4" />,
      content: (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="elevation" className="text-sm">Elevation Contours</Label>
            <Switch
              id="elevation"
              checked={activeLayers.elevation}
              onCheckedChange={(checked) => onLayerToggle('elevation', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="waterways" className="text-sm">Waterways</Label>
            <Switch
              id="waterways"
              checked={activeLayers.waterways}
              onCheckedChange={(checked) => onLayerToggle('waterways', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="vegetation" className="text-sm">Vegetation</Label>
            <Switch
              id="vegetation"
              checked={activeLayers.vegetation}
              onCheckedChange={(checked) => onLayerToggle('vegetation', checked)}
            />
          </div>
        </div>
      )
    },
    {
      id: 'wildlife',
      title: 'Wildlife Overlays',
      icon: <Dog className="h-4 w-4" />,
      content: (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="deer" className="text-sm flex items-center">
              <span className="mr-2">🦌</span>
              White-tailed Deer
            </Label>
            <Switch
              id="deer"
              checked={activeLayers.deer}
              onCheckedChange={(checked) => onLayerToggle('deer', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="elk" className="text-sm flex items-center">
              <span className="mr-2">🫎</span>
              Elk
            </Label>
            <Switch
              id="elk"
              checked={activeLayers.elk}
              onCheckedChange={(checked) => onLayerToggle('elk', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="turkey" className="text-sm flex items-center">
              <span className="mr-2">🦃</span>
              Wild Turkey
            </Label>
            <Switch
              id="turkey"
              checked={activeLayers.turkey}
              onCheckedChange={(checked) => onLayerToggle('turkey', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="waterfowl" className="text-sm flex items-center">
              <span className="mr-2">🦆</span>
              Waterfowl
            </Label>
            <Switch
              id="waterfowl"
              checked={activeLayers.waterfowl}
              onCheckedChange={(checked) => onLayerToggle('waterfowl', checked)}
            />
          </div>
        </div>
      )
    },
    {
      id: 'fishing',
      title: 'Fishing Data',
      icon: <Fish className="h-4 w-4" />,
      content: (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="fishSpecies" className="text-sm">Fish Species</Label>
            <Switch
              id="fishSpecies"
              checked={activeLayers.fishSpecies}
              onCheckedChange={(checked) => onLayerToggle('fishSpecies', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="waterDepth" className="text-sm">Water Depth</Label>
            <Switch
              id="waterDepth"
              checked={activeLayers.waterDepth}
              onCheckedChange={(checked) => onLayerToggle('waterDepth', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="boatRamps" className="text-sm">Boat Ramps</Label>
            <Switch
              id="boatRamps"
              checked={activeLayers.boatRamps}
              onCheckedChange={(checked) => onLayerToggle('boatRamps', checked)}
            />
          </div>
        </div>
      )
    }
  ];

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="left" className="w-80 p-0 z-50">
        <SheetHeader className="p-4 border-b">
          <div className="flex items-center justify-between">
            <SheetTitle>Map Layers</SheetTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>
        
        <div className="p-4 space-y-6 overflow-y-auto">
          {layerSections.map((section) => (
            <div key={section.id} className="space-y-3">
              <Button
                variant="ghost"
                className="w-full justify-between p-0 h-auto font-medium text-left"
                onClick={() => toggleSection(section.id)}
              >
                <div className="flex items-center space-x-2">
                  {section.icon}
                  <span>{section.title}</span>
                </div>
                <div className={`transform transition-transform ${expandedSections[section.id] ? 'rotate-90' : ''}`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Button>
              
              {expandedSections[section.id] && (
                <div className="pl-6 space-y-2">
                  {section.content}
                </div>
              )}
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
