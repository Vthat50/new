import { useState } from 'react';
import DashboardLayout from './components/layout/DashboardLayout';
import EnhancedDashboardTab from './components/tabs/EnhancedDashboardTab';
import PatientsTab from './components/tabs/PatientsTab';
import ConversationsTab from './components/tabs/ConversationsTab';
import AnalyticsTab from './components/tabs/AnalyticsTab';
import ConfigurationTab from './components/tabs/ConfigurationTab';
import DemoModeTab from './components/tabs/DemoModeTab';
import InstallPrompt from './components/shared/InstallPrompt';
import OfflineIndicator from './components/shared/OfflineIndicator';
import DemoControlPanel from './components/demo/DemoControlPanel';
import LiveNotifications from './components/shared/LiveNotifications';
import { useRealtimeService } from './hooks/useRealtimeUpdates';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [demoMode, setDemoMode] = useState<boolean>(false);

  // Enable realtime updates when demo mode is active
  useRealtimeService(demoMode);

  const renderTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <EnhancedDashboardTab onNavigate={setActiveTab} demoMode={demoMode} />;
      case 'patients':
        return <PatientsTab demoMode={demoMode} />;
      case 'conversations':
        return <ConversationsTab />;
      case 'analytics':
        return <AnalyticsTab />;
      case 'configuration':
        return <ConfigurationTab />;
      case 'demo':
        return <DemoModeTab />;
      default:
        return <EnhancedDashboardTab onNavigate={setActiveTab} demoMode={demoMode} />;
    }
  };

  return (
    <ErrorBoundary>
      <OfflineIndicator />
      <DashboardLayout
        activeTab={activeTab}
        onTabChange={setActiveTab}
        demoMode={demoMode}
        onDemoModeToggle={() => setDemoMode(!demoMode)}
      >
        {renderTab()}
      </DashboardLayout>
      <InstallPrompt />
      {demoMode && <DemoControlPanel />}
      {demoMode && <LiveNotifications />}
    </ErrorBoundary>
  );
}

export default App;
