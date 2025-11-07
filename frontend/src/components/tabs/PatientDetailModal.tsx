import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getPatient } from '../../services/api';
import { Card, CardHeader, CardContent } from '../shared/Card';
import Badge from '../shared/Badge';
import Button from '../shared/Button';
import { X, MapPin, Shield, Target, TrendingUp, Package } from 'lucide-react';

interface PatientDetailModalProps {
  patientId: string;
  onClose: () => void;
}

const PatientDetailModal: React.FC<PatientDetailModalProps> = ({ patientId, onClose }) => {
  const { data: patient, isLoading } = useQuery({
    queryKey: ['patient', patientId],
    queryFn: () => getPatient(patientId),
  });

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!patient) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold">
            {patient.first_name} {patient.last_name}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Patient Information</h3>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-600">MRN:</span>
                  <p className="font-medium">{patient.mrn}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Date of Birth:</span>
                  <p className="font-medium">
                    {patient.date_of_birth
                      ? new Date(patient.date_of_birth).toLocaleDateString()
                      : 'N/A'}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Phone:</span>
                  <p className="font-medium">{patient.phone || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Email:</span>
                  <p className="font-medium">{patient.email || 'N/A'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Geographic Profile */}
          {patient.geographic_profile && (
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Geographic Profile</h3>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <span className="text-sm text-gray-600">Location:</span>
                  <p className="font-medium capitalize">
                    {patient.geographic_profile.urban_rural} - {patient.zip_code},{' '}
                    {patient.state}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-600 block mb-2">SDOH Factors:</span>
                  <div className="space-y-2">
                    {Object.entries(patient.geographic_profile.sdoh_factors).map(
                      ([key, value]) => (
                        <div key={key} className="flex items-center space-x-2">
                          <span className="text-sm capitalize w-40">
                            {key.replace(/_/g, ' ')}:
                          </span>
                          <div className="flex-1 bg-gray-200 rounded-full h-4">
                            <div
                              className={`h-4 rounded-full ${
                                value < 40
                                  ? 'bg-danger'
                                  : value < 70
                                  ? 'bg-warning'
                                  : 'bg-success'
                              }`}
                              style={{ width: `${value}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium w-12">{value}%</span>
                        </div>
                      )
                    )}
                  </div>
                </div>
                {patient.geographic_profile.nearest_pharmacy_miles && (
                  <div>
                    <span className="text-sm text-gray-600">Nearest Pharmacy:</span>
                    <p className="font-medium">
                      {patient.geographic_profile.nearest_pharmacy_miles} miles
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Insurance Coverage */}
          {patient.coverage_info && (
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Insurance Coverage</h3>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-600">Plan:</span>
                    <p className="font-medium">{patient.coverage_info.plan_name}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Tier:</span>
                    <p className="font-medium">Tier {patient.coverage_info.tier}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Prior Auth Required:</span>
                    <p className="font-medium">
                      {patient.coverage_info.pa_required ? 'Yes' : 'No'}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Estimated Copay:</span>
                    <p className="font-medium text-lg">
                      ${patient.coverage_info.estimated_copay || 'N/A'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Eligible Programs */}
          {patient.eligible_programs && patient.eligible_programs.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Eligible Assistance Programs</h3>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {patient.eligible_programs.map((program) => (
                    <div
                      key={program.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{program.name}</p>
                        <p className="text-sm text-gray-600 capitalize">
                          {program.type.replace(/_/g, ' ')}
                        </p>
                      </div>
                      <div className="text-right">
                        {program.max_benefit && (
                          <p className="font-semibold text-success">
                            Up to ${program.max_benefit}
                          </p>
                        )}
                        <Button size="sm" variant="primary" className="mt-1">
                          Enroll
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex space-x-3">
            <Button variant="primary" className="flex-1">
              Initiate Call
            </Button>
            <Button variant="secondary" className="flex-1">
              View Call History
            </Button>
            <Button variant="secondary" className="flex-1">
              Edit Patient
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDetailModal;
