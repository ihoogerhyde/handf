import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bookmark, Navigation, Share2, Info } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import type { Property } from '@shared/schema';

interface PropertyModalProps {
  property: Property;
  open: boolean;
  onClose: () => void;
}

export function PropertyModal({ property, open, onClose }: PropertyModalProps) {
  const [showFullInfo, setShowFullInfo] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const savePropertyMutation = useMutation({
    mutationFn: (waypoint: any) => apiRequest('POST', '/api/waypoints', waypoint),
    onSuccess: () => {
      toast({
        title: "Property Saved",
        description: "Property has been added to your saved locations",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/waypoints'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save property",
        variant: "destructive",
      });
    }
  });

  const handleSaveProperty = () => {
    savePropertyMutation.mutate({
      userId: 'current-user', // In a real app, this would come from auth
      name: property.name,
      latitude: property.latitude,
      longitude: property.longitude,
      category: 'hunting',
      notes: `${property.type} property - ${property.size} acres`,
    });
  };

  const handleGetDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${property.latitude},${property.longitude}`;
    window.open(url, '_blank');
  };

  const handleShare = async () => {
    const shareData = {
      title: property.name,
      text: `Check out this ${property.type} property: ${property.name}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(shareData.url);
      toast({
        title: "Link Copied",
        description: "Property link has been copied to clipboard",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto z-50">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-charcoal">
            {property.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Property Image */}
          <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500">
              <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-sm">Property aerial view</p>
            </div>
          </div>
          
          {/* Property Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-600 mb-1">Property Type</h3>
              <Badge variant={property.type === 'private' ? 'destructive' : 'default'}>
                {property.type === 'private' ? 'Private Land' : 'Public Land'}
              </Badge>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-600 mb-1">Size</h3>
              <p className="text-charcoal">{property.size} acres</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-600 mb-1">Elevation</h3>
              <p className="text-charcoal">
                {property.elevation 
                  ? `${property.elevation.min} - ${property.elevation.max} ft`
                  : 'Not available'
                }
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-600 mb-1">Water Features</h3>
              <p className="text-charcoal">
                {property.waterFeatures?.join(', ') || 'None listed'}
              </p>
            </div>
          </div>
          
          {/* Vegetation */}
          {property.vegetation && property.vegetation.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-600 mb-2">Vegetation</h3>
              <div className="flex flex-wrap gap-2">
                {property.vegetation.map((veg, index) => (
                  <Badge key={index} variant="secondary" className="bg-forest/10 text-forest">
                    {veg}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {/* Access Information */}
          <div>
            <h3 className="text-sm font-semibold text-gray-600 mb-2">Access Information</h3>
            <p className="text-sm text-charcoal bg-gray-50 p-3 rounded-lg">
              {property.access || 'Access information not available'}
            </p>
          </div>
          
          {/* Landowner Info (if available and enabled) */}
          {property.landowner && showFullInfo && (
            <div>
              <h3 className="text-sm font-semibold text-gray-600 mb-2">Landowner</h3>
              <p className="text-sm text-charcoal">{property.landowner}</p>
            </div>
          )}
          
          {/* Show More Info Button */}
          {property.landowner && !showFullInfo && (
            <Button
              variant="outline"
              onClick={() => setShowFullInfo(true)}
              className="w-full"
            >
              <Info className="h-4 w-4 mr-2" />
              Show Additional Information
            </Button>
          )}
          
          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4 border-t">
            <Button
              onClick={handleSaveProperty}
              className="flex-1 bg-forest text-white hover:bg-forest/90"
              disabled={savePropertyMutation.isPending}
            >
              <Bookmark className="h-4 w-4 mr-2" />
              Save Property
            </Button>
            <Button
              onClick={handleGetDirections}
              className="flex-1 bg-hunter text-white hover:bg-hunter/90"
            >
              <Navigation className="h-4 w-4 mr-2" />
              Get Directions
            </Button>
            <Button
              onClick={handleShare}
              variant="outline"
              className="px-4"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
