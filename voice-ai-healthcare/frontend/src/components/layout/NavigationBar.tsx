import React from 'react';
import { Activity } from 'lucide-react';

interface NavigationBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'integrations', label: 'Integrations' },
  { id: 'patients', label: 'Patient List' },
  { id: 'calls', label: 'Live Calls' },
  { id: 'analytics', label: 'Analytics' },
];

const NavigationBar: React.FC<NavigationBarProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav className="bg-primary text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <Activity className="h-8 w-8" />
              <span className="text-xl font-bold">Voice AI Healthcare</span>
            </div>
            <div className="flex space-x-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`px-4 py-2 rounded-t-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-white text-primary font-semibold'
                      : 'text-white hover:bg-blue-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm">
              <div className="font-semibold">Admin User</div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
