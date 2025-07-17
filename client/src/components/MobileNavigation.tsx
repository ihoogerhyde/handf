import { Button } from '@/components/ui/button';
import { Map, Layers, Search, Bookmark, User } from 'lucide-react';

interface MobileNavigationProps {
  onLayersToggle: () => void;
  onSearchToggle: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function MobileNavigation({ 
  onLayersToggle, 
  onSearchToggle, 
  activeTab, 
  onTabChange 
}: MobileNavigationProps) {
  const tabs = [
    { id: 'map', label: 'Map', icon: Map },
    { id: 'layers', label: 'Layers', icon: Layers, onClick: onLayersToggle },
    { id: 'search', label: 'Search', icon: Search, onClick: onSearchToggle },
    { id: 'saved', label: 'Saved', icon: Bookmark },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-50">
      <div className="grid grid-cols-5 py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <Button
              key={tab.id}
              variant="ghost"
              size="sm"
              className={`flex flex-col items-center py-2 px-1 h-auto ${
                isActive 
                  ? 'text-forest' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => {
                if (tab.onClick) {
                  tab.onClick();
                } else {
                  onTabChange(tab.id);
                }
              }}
            >
              <Icon className="h-5 w-5 mb-1" />
              <span className="text-xs">{tab.label}</span>
            </Button>
          );
        })}
      </div>
    </nav>
  );
}
