import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getPatients, analyzeCall } from '../../services/api';
import { Card, CardHeader, CardContent } from '../shared/Card';
import Badge from '../shared/Badge';
import Button from '../shared/Button';
import type { CallAnalysis } from '../../types';
import {
  Phone,
  Play,
  Pause,
  MapPin,
  Shield,
  AlertTriangle,
  Target,
  TrendingUp,
  CheckCircle,
} from 'lucide-react';

const LiveCallsTab: React.FC = () => {
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [callAnalysis, setCallAnalysis] = useState<CallAnalysis | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const { data: patients } = useQuery({
    queryKey: ['patients'],
    queryFn: () => getPatients({ limit: 20 }),
  });

  const analyzeMutation = useMutation({
    mutationFn: (patientId: string) => analyzeCall(patientId),
    onSuccess: (data) => {
      setCallAnalysis(data);
    },
  });

  const handleStartCall = async () => {
    if (!selectedPatientId) {
      alert('Please select a patient first');
      return;
    }

    setIsSimulating(true);
    setCallAnalysis(null);

    // Simulate call delay
    setTimeout(() => {
      analyzeMutation.mutate(selectedPatientId);
      setIsSimulating(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Live Call Analysis</h1>

      {/* Call Setup */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Initiate Call</h2>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <select
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
            >
              <option value="">Select a patient...</option>
              {patients?.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.first_name} {patient.last_name} - {patient.mrn}
                </option>
              ))}
            </select>
            <Button
              variant="success"
              onClick={handleStartCall}
              disabled={!selectedPatientId || isSimulating || analyzeMutation.isPending}
            >
              <Phone className="h-4 w-4 mr-2 inline" />
              {isSimulating ? 'Simulating Call...' : 'Start Call Simulation'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {callAnalysis && (
        <div className="grid grid-cols-5 gap-6">
          {/* Left Panel: Call Interface */}
          <div className="col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Active Call</h2>
                  <Badge variant="success">Recording</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Waveform Placeholder */}
                <div className="h-24 bg-gradient-to-r from-primary/20 to-success/20 rounded-lg flex items-center justify-center">
                  <div className="flex items-end space-x-1 h-16">
                    {[...Array(20)].map((_, i) => (
                      <div
                        key={i}
                        className="w-1 bg-primary rounded animate-pulse"
                        style={{
                          height: `${Math.random() * 100}%`,
                          animationDelay: `${i * 0.1}s`,
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Transcript */}
                <div>
                  <h3 className="font-semibold mb-2">Live Transcript:</h3>
                  <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto text-sm space-y-2">
                    {callAnalysis.transcript.split('\n').map((line, idx) => (
                      <p key={idx} className={line.startsWith('AI:') ? 'text-primary font-medium' : ''}>
                        {line}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Suggested Responses */}
                <div>
                  <h3 className="font-semibold mb-2">Suggested Actions:</h3>
                  <div className="space-y-2">
                    {callAnalysis.recommendations.slice(0, 3).map((rec, idx) => (
                      <Button key={idx} variant="secondary" size="sm" className="w-full text-left justify-start">
                        {rec.action.replace(/_/g, ' ')}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel: Intelligence Dashboard */}
          <div className="col-span-3 space-y-6">
            {/* Geographic Intelligence */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Geographic Profile</h3>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-600">Area Type:</span>
                    <p className="font-medium capitalize">
                      {callAnalysis.enrichment_data.sdoh.urban_rural}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Transportation Access:</span>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full ${
                            callAnalysis.enrichment_data.sdoh.transportation_score < 40
                              ? 'bg-danger'
                              : callAnalysis.enrichment_data.sdoh.transportation_score < 70
                              ? 'bg-warning'
                              : 'bg-success'
                          }`}
                          style={{
                            width: `${callAnalysis.enrichment_data.sdoh.transportation_score}%`,
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium">
                        {callAnalysis.enrichment_data.sdoh.transportation_score}%
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Health Literacy:</span>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full ${
                            callAnalysis.enrichment_data.sdoh.health_literacy < 40
                              ? 'bg-danger'
                              : callAnalysis.enrichment_data.sdoh.health_literacy < 70
                              ? 'bg-warning'
                              : 'bg-success'
                          }`}
                          style={{
                            width: `${callAnalysis.enrichment_data.sdoh.health_literacy}%`,
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium">
                        {callAnalysis.enrichment_data.sdoh.health_literacy}%
                      </span>
                    </div>
                  </div>
                  {callAnalysis.enrichment_data.sdoh.nearest_pharmacy_miles && (
                    <div>
                      <span className="text-sm text-gray-600">Nearest Pharmacy:</span>
                      <p className="font-medium">
                        {callAnalysis.enrichment_data.sdoh.nearest_pharmacy_miles} miles
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-4">
                  <h4 className="font-semibold text-sm mb-2">Regional Insights:</h4>
                  <ul className="text-sm space-y-1 text-gray-700">
                    <li>• {callAnalysis.enrichment_data.sdoh.transportation_score < 50 ? 'Limited transportation options' : 'Good transportation access'}</li>
                    <li>• {callAnalysis.enrichment_data.sdoh.nearest_pharmacy_miles && callAnalysis.enrichment_data.sdoh.nearest_pharmacy_miles > 10 ? 'Pharmacy access challenge' : 'Pharmacy within reasonable distance'}</li>
                    <li>• {callAnalysis.enrichment_data.sdoh.health_literacy < 60 ? 'Consider simplified instructions' : 'Standard communication appropriate'}</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Insurance Coverage */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Coverage Analysis</h3>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-600">Insurance Status:</span>
                    <p className="font-medium">
                      {callAnalysis.enrichment_data.coverage.has_insurance
                        ? 'Insured'
                        : 'Uninsured'}
                    </p>
                  </div>
                  {callAnalysis.enrichment_data.coverage.estimated_copay && (
                    <div>
                      <span className="text-sm text-gray-600">Estimated Copay:</span>
                      <p className="font-medium text-xl text-primary">
                        ${callAnalysis.enrichment_data.coverage.estimated_copay}
                      </p>
                    </div>
                  )}
                </div>

                {callAnalysis.enrichment_data.coverage.estimated_copay &&
                  callAnalysis.enrichment_data.coverage.estimated_copay > 100 && (
                    <div className="mt-4 p-3 bg-warning/10 border border-warning rounded-lg">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="h-5 w-5 text-warning" />
                        <p className="text-sm font-medium">
                          High copay detected - Patient assistance recommended
                        </p>
                      </div>
                    </div>
                  )}
              </CardContent>
            </Card>

            {/* AI Recommendations */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">AI Recommendations</h3>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Barriers Identified */}
                <div>
                  <h4 className="font-semibold text-sm mb-2">Barriers Identified:</h4>
                  <div className="flex flex-wrap gap-2">
                    {callAnalysis.barriers.map((barrier) => (
                      <Badge key={barrier} variant="warning">
                        {barrier.replace(/_/g, ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Immediate Actions */}
                <div>
                  <h4 className="font-semibold text-sm mb-2">
                    <TrendingUp className="inline h-4 w-4 mr-1" />
                    Immediate Actions:
                  </h4>
                  <div className="space-y-3">
                    {callAnalysis.recommendations.map((rec, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-lg border-l-4 ${
                          rec.priority === 'high'
                            ? 'bg-danger/5 border-danger'
                            : 'bg-blue-50 border-blue-500'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium capitalize">
                              {rec.action.replace(/_/g, ' ')}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">{rec.rationale}</p>
                            {rec.estimated_savings && (
                              <p className="text-sm font-semibold text-success mt-1">
                                Est. Savings: ${rec.estimated_savings}
                              </p>
                            )}
                          </div>
                          <Badge variant={rec.priority === 'high' ? 'danger' : 'info'}>
                            {rec.priority}
                          </Badge>
                        </div>
                        <Button size="sm" variant="primary" className="mt-2">
                          <CheckCircle className="h-3 w-3 mr-1 inline" />
                          Execute
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Call Summary */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-sm mb-2">Call Summary:</h4>
                  <p className="text-sm text-gray-700">{callAnalysis.call_summary}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {!callAnalysis && !isSimulating && (
        <div className="text-center py-20 text-gray-500">
          <Phone className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg">Select a patient and start a call simulation to see AI analysis</p>
        </div>
      )}
    </div>
  );
};

export default LiveCallsTab;
