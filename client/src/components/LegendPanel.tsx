import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronDown, ChevronUp } from 'lucide-react';

export function LegendPanel() {
  const [isExpanded, setIsExpanded] = useState(true);

  const legendItems = [
    { color: 'bg-green-500', label: 'Public Land' },
    { color: 'bg-red-500', label: 'Private Land' },
    { color: 'bg-blue-500', label: 'Waterways' },
    { color: 'bg-saddle', label: 'Wildlife Activity' },
    { color: 'border-2 border-gray-600', label: 'Elevation Lines' },
    { symbol: '🦌', label: 'Deer Habitat' },
    { symbol: '🫎', label: 'Elk Habitat' },
    { symbol: '🦃', label: 'Turkey Habitat' },
    { symbol: '🦆', label: 'Waterfowl Habitat' },
    { symbol: '🎣', label: 'Fishing Spots' },
  ];

  return (
    <Card className="absolute bottom-4 left-4 bg-white shadow-lg z-40 max-w-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-charcoal">
            Legend
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-6 w-6 p-0"
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="pt-0">
          <div className="space-y-2">
            {legendItems.map((item, index) => (
              <div key={index} className="flex items-center space-x-2 text-xs">
                {item.color ? (
                  <div className={`w-4 h-4 rounded ${item.color}`} />
                ) : (
                  <span className="text-base w-4 h-4 flex items-center justify-center">
                    {item.symbol}
                  </span>
                )}
                <span className="text-charcoal">{item.label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
