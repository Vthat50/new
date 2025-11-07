import React, { ReactNode } from 'react';
import NavigationBar from './NavigationBar';
import StatusBar from './StatusBar';

interface MainLayoutProps {
  children: ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, activeTab, onTabChange }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationBar activeTab={activeTab} onTabChange={onTabChange} />
      <StatusBar />
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
