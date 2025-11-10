import { useState } from 'react';
import DashboardLayout from './layout/DashboardLayout';
import EnhancedDashboardTab from './tabs/EnhancedDashboardTab';
import PatientsTab from './tabs/PatientsTab';
import ConversationsTab from './tabs/ConversationsTab';
import AnalyticsTab from './tabs/AnalyticsTab';
import ConfigurationTab from './tabs/ConfigurationTab';
import MarketingInsightsTab from './tabs/MarketingInsightsTab';
import OutcomesTab from './tabs/OutcomesTab';
import InstallPrompt from './shared/InstallPrompt';
import OfflineIndicator from './shared/OfflineIndicator';
import DemoControlPanel from './demo/DemoControlPanel';
import LiveNotifications from './shared/LiveNotifications';
import { useRealtimeService } from '../hooks/useRealtimeUpdates';

export default function Dashboard() {
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
      case 'marketing':
        return <MarketingInsightsTab />;
      case 'outcomes':
        return <OutcomesTab />;
      case 'configuration':
        return <ConfigurationTab />;
      default:
        return <EnhancedDashboardTab onNavigate={setActiveTab} demoMode={demoMode} />;
    }
  };

  return (
    <>
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
    </>
  );
}
