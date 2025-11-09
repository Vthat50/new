import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Users,
  Phone,
  BarChart3,
  Settings,
  Rocket,
  Menu,
  X,
  Bell,
  User,
  LogOut,
  HelpCircle,
  TrendingUp,
  Target,
} from 'lucide-react';
import { colors, spacing, typography, layout } from '../../lib/design-system';

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  demoMode?: boolean;
  onDemoModeToggle?: () => void;
}

export default function DashboardLayout({ children, activeTab, onTabChange, demoMode = false, onDemoModeToggle }: DashboardLayoutProps) {
  // Auto-collapse sidebar on mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'patients', label: 'Patients', icon: Users },
    { id: 'conversations', label: 'Conversations', icon: Phone },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'marketing', label: 'Marketing Insights', icon: TrendingUp },
    { id: 'outcomes', label: 'Outcomes', icon: Target },
    { id: 'configuration', label: 'Configuration', icon: Settings },
  ];

  const handleTabChange = (tab: string) => {
    onTabChange(tab);
    // Auto-close sidebar on mobile after selecting tab
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: colors.background.page }}>
      {/* Mobile Overlay */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsSidebarOpen(false)}
          style={{ transition: 'opacity 0.3s' }}
        />
      )}

      {/* Sidebar */}
      <aside
        className="bg-white border-r transition-all duration-300 flex flex-col"
        style={{
          width: isSidebarOpen ? layout.sidebarWidth : (isMobile ? '0' : '80px'),
          borderColor: colors.neutral[200],
          position: isMobile ? 'fixed' : 'relative',
          height: isMobile ? '100vh' : 'auto',
          zIndex: isMobile ? 50 : 'auto',
          transform: isMobile && !isSidebarOpen ? 'translateX(-100%)' : 'translateX(0)',
          overflow: 'hidden',
        }}
      >
        {/* Logo */}
        <div
          className="flex items-center justify-between border-b"
          style={{
            height: layout.headerHeight,
            padding: `0 ${spacing[6]}`,
            borderColor: colors.neutral[200]
          }}
        >
          {isSidebarOpen && (
            <h1
              className="text-neutral-900"
              style={{
                fontSize: typography.fontSize['2xl'],
                fontWeight: typography.fontWeight.semibold
              }}
            >
              Vevara
            </h1>
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="hover:bg-neutral-100 rounded transition-colors"
            style={{ padding: spacing[2] }}
          >
            {isSidebarOpen ? (
              <X style={{ width: '20px', height: '20px', color: colors.neutral[600] }} />
            ) : (
              <Menu style={{ width: '20px', height: '20px', color: colors.neutral[600] }} />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto" style={{ paddingTop: spacing[6], paddingBottom: spacing[6] }}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className="w-full flex items-center transition-colors"
                style={{
                  gap: spacing[3],
                  padding: `${spacing[3]} ${spacing[6]}`,
                  backgroundColor: isActive ? colors.neutral[50] : 'transparent',
                  color: isActive ? colors.neutral[900] : colors.neutral[600],
                  borderRight: isActive ? `3px solid ${colors.primary[500]}` : 'none',
                  fontSize: typography.fontSize.sm,
                  fontWeight: isActive ? typography.fontWeight.medium : typography.fontWeight.normal
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = colors.neutral[50];
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <Icon style={{ width: '20px', height: '20px', flexShrink: 0 }} />
                {isSidebarOpen && <span>{tab.label}</span>}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header
          className="bg-white border-b flex items-center justify-between"
          style={{
            height: layout.headerHeight,
            borderColor: colors.neutral[200],
            padding: `0 ${spacing[4]}`
          }}
        >
          <div className="flex items-center" style={{ gap: spacing[3] }}>
            {isMobile && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="hover:bg-neutral-100 rounded transition-colors"
                style={{ padding: spacing[2] }}
              >
                <Menu style={{ width: '24px', height: '24px', color: colors.neutral[600] }} />
              </button>
            )}
          </div>
          <div className="flex items-center" style={{ gap: spacing[4] }}>
            {/* Customer Branding Slot */}
            <div className="flex items-center" style={{ gap: spacing[3] }}>
              <div
                className="rounded flex items-center justify-center"
                style={{
                  width: '120px',
                  height: '36px',
                  backgroundColor: colors.neutral[100],
                  border: `1px dashed ${colors.neutral[300]}`
                }}
              >
                <span style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500] }}>
                  Pharma Logo
                </span>
              </div>
            </div>

            {/* Demo Mode Toggle */}
            {onDemoModeToggle && (
              <div className="flex items-center" style={{ gap: spacing[2] }}>
                <span style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600] }}>
                  Demo Mode
                </span>
                <button
                  onClick={onDemoModeToggle}
                  className="relative rounded-full transition-colors"
                  style={{
                    width: '44px',
                    height: '24px',
                    backgroundColor: demoMode ? colors.primary[500] : colors.neutral[300]
                  }}
                >
                  <div
                    className="absolute top-1 rounded-full bg-white transition-all"
                    style={{
                      width: '16px',
                      height: '16px',
                      left: demoMode ? '24px' : '4px'
                    }}
                  />
                </button>
              </div>
            )}

            {/* Notification Bell */}
            <div className="relative">
              <button
                className="hover:bg-neutral-100 rounded-full transition-colors relative"
                style={{ padding: spacing[2] }}
              >
                <Bell style={{ width: '20px', height: '20px', color: colors.neutral[600] }} />
                {notificationCount > 0 && (
                  <div
                    className="absolute -top-1 -right-1 rounded-full flex items-center justify-center"
                    style={{
                      width: '18px',
                      height: '18px',
                      backgroundColor: colors.status.error,
                      fontSize: typography.fontSize.xs,
                      color: 'white',
                      fontWeight: typography.fontWeight.semibold
                    }}
                  >
                    {notificationCount}
                  </div>
                )}
              </button>
            </div>

            {/* User Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="rounded-full flex items-center justify-center hover:bg-neutral-100 transition-colors"
                style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: colors.neutral[100]
                }}
              >
                <span
                  className="text-neutral-700"
                  style={{
                    fontSize: typography.fontSize.sm,
                    fontWeight: typography.fontWeight.medium
                  }}
                >
                  AD
                </span>
              </button>

              {/* Dropdown Menu */}
              {showUserDropdown && (
                <div
                  className="absolute right-0 mt-2 bg-white rounded-lg shadow-lg border z-50"
                  style={{
                    width: '200px',
                    borderColor: colors.neutral[200]
                  }}
                  onMouseLeave={() => setShowUserDropdown(false)}
                >
                  <div className="p-3 border-b" style={{ borderColor: colors.neutral[200] }}>
                    <div style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold }}>
                      Admin User
                    </div>
                    <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500] }}>
                      admin@pharmai.com
                    </div>
                  </div>
                  <div className="py-2">
                    <button
                      className="w-full flex items-center hover:bg-neutral-50 transition-colors"
                      style={{ gap: spacing[3], padding: `${spacing[2]} ${spacing[3]}`, fontSize: typography.fontSize.sm }}
                    >
                      <User style={{ width: '16px', height: '16px' }} />
                      <span>Profile Settings</span>
                    </button>
                    <button
                      className="w-full flex items-center hover:bg-neutral-50 transition-colors"
                      style={{ gap: spacing[3], padding: `${spacing[2]} ${spacing[3]}`, fontSize: typography.fontSize.sm }}
                    >
                      <HelpCircle style={{ width: '16px', height: '16px' }} />
                      <span>Help & Support</span>
                    </button>
                    <button
                      className="w-full flex items-center hover:bg-neutral-50 transition-colors"
                      style={{ gap: spacing[3], padding: `${spacing[2]} ${spacing[3]}`, fontSize: typography.fontSize.sm, color: colors.status.error }}
                    >
                      <LogOut style={{ width: '16px', height: '16px' }} />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <div>
          {children}
        </div>
      </main>
    </div>
  );
}
