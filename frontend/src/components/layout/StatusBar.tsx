import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getKPIMetrics } from '../../services/api';
import { Clock } from 'lucide-react';

const StatusBar: React.FC = () => {
  const { data: kpi } = useQuery({
    queryKey: ['kpi'],
    queryFn: getKPIMetrics,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  return (
    <div className="bg-gray-100 border-b border-gray-300">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between text-sm">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <span className="font-semibold">Active Calls:</span>
            <span className="text-primary font-bold">{kpi?.active_calls || 0}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-semibold">Queue Length:</span>
            <span>{kpi?.queue_length || 0}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-semibold">Calls Today:</span>
            <span>{kpi?.calls_today || 0}</span>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-gray-600">
          <Clock className="h-4 w-4" />
          <span>System Status: </span>
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-success text-white">
            Online
          </span>
        </div>
      </div>
    </div>
  );
};

export default StatusBar;
