import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getIntegrations, getIntegrationHealth } from '../../services/api';
import { Card, CardHeader, CardContent } from '../shared/Card';
import Badge from '../shared/Badge';
import Button from '../shared/Button';
import { CheckCircle, AlertCircle, RefreshCw, Database, Upload, Settings, TestTube } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { colors, spacing, typography } from '../../lib/design-system';

const IntegrationsTab: React.FC = () => {
  const { data: integrations, isLoading } = useQuery({
    queryKey: ['integrations'],
    queryFn: getIntegrations,
  });

  const { data: health } = useQuery({
    queryKey: ['integration-health'],
    queryFn: getIntegrationHealth,
    refetchInterval: 30000,
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-success" />;
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-danger" />;
      case 'in_progress':
        return <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />;
      case 'partial':
        return <AlertCircle className="h-5 w-5 text-warning" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge variant="success">Connected</Badge>;
      case 'failed':
        return <Badge variant="danger">Failed</Badge>;
      case 'in_progress':
        return <Badge variant="info">Syncing...</Badge>;
      case 'partial':
        return <Badge variant="warning">Partial</Badge>;
      default:
        return <Badge>Pending</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div style={{ padding: spacing[6], backgroundColor: colors.background.page, display: 'flex', flexDirection: 'column', gap: spacing[6] }}>
      {/* 3-Panel Layout */}
      <div className="grid grid-cols-10 gap-6">
        {/* Left Panel - 30%: Data Sources Status */}
        <div className="col-span-3 space-y-4">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Connected Data Sources</h2>
            </CardHeader>
            <CardContent className="space-y-3">
              {integrations?.map((integration) => (
                <div
                  key={integration.id}
                  className="flex items-start justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-start space-x-3 flex-1">
                    {getStatusIcon(integration.sync_status)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {integration.source_name}
                      </p>
                      {integration.last_sync && (
                        <p className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(integration.last_sync), { addSuffix: true })}
                        </p>
                      )}
                      <p className="text-xs text-gray-600 mt-1">
                        {integration.record_count.toLocaleString()} records
                      </p>
                    </div>
                  </div>
                  <div className="ml-2">
                    {getStatusBadge(integration.sync_status)}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Center Panel - 40%: Integration Health Monitor */}
        <div className="col-span-4 space-y-4">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Integration Health Monitor</h2>
            </CardHeader>
            <CardContent>
              {/* Health Overview */}
              {health && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">System Health</span>
                    <span className="text-2xl font-bold text-primary">{health.health_percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-primary rounded-full h-3 transition-all"
                      style={{ width: `${health.health_percentage}%` }}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-success">{health.connected}</div>
                      <div className="text-xs text-gray-600">Connected</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-warning">{health.in_progress}</div>
                      <div className="text-xs text-gray-600">Syncing</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-danger">{health.failed}</div>
                      <div className="text-xs text-gray-600">Failed</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Data Freshness Indicators */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Data Freshness</h3>
                {integrations?.slice(0, 5).map((integration) => (
                  <div key={integration.id} className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">{integration.source_name}</span>
                    <span className="text-gray-500">
                      {integration.last_sync
                        ? formatDistanceToNow(new Date(integration.last_sync), { addSuffix: true })
                        : 'Never synced'}
                    </span>
                  </div>
                ))}
              </div>

              {/* Error Logs */}
              {integrations?.some(i => i.error_log) && (
                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-danger mb-2">Error Logs</h3>
                  <div className="space-y-2">
                    {integrations
                      ?.filter(i => i.error_log)
                      .map((integration) => (
                        <div key={integration.id} className="p-2 bg-danger/10 rounded text-xs">
                          <p className="font-medium text-danger">{integration.source_name}</p>
                          <p className="text-gray-700">{integration.error_log}</p>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - 30%: Quick Actions */}
        <div className="col-span-3 space-y-4">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Quick Actions</h2>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="primary" className="w-full justify-center">
                <Database className="h-4 w-4 mr-2" />
                Sync All Sources
              </Button>
              <Button variant="secondary" className="w-full justify-center">
                <Upload className="h-4 w-4 mr-2" />
                Bulk Upload CSV
              </Button>
              <Button variant="secondary" className="w-full justify-center">
                <Settings className="h-4 w-4 mr-2" />
                Configure Scrapers
              </Button>
              <Button variant="secondary" className="w-full justify-center">
                <TestTube className="h-4 w-4 mr-2" />
                Test Connections
              </Button>
            </CardContent>
          </Card>

          {/* Sync Schedule */}
          <Card>
            <CardHeader>
              <h2 className="text-sm font-semibold">Sync Schedule</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600">AHRQ SDOH</span>
                  <span className="font-medium">Monthly</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">CDC WONDER</span>
                  <span className="font-medium">Quarterly</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">CMS Medicare</span>
                  <span className="font-medium">Monthly</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Commercial Payors</span>
                  <span className="font-medium">Weekly</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Coverage Map */}
          <Card>
            <CardHeader>
              <h2 className="text-sm font-semibold">Coverage Summary</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">States Covered</span>
                  <Badge>50/50</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Medicare Plans</span>
                  <Badge>800+</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">ZIP Codes</span>
                  <Badge>30</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default IntegrationsTab;
