import axios from 'axios';
import type {
  Patient,
  PatientWithEnrichment,
  Call,
  CallAnalysis,
  DataIntegration,
  AnalyticsDashboard,
} from '../types';

// In production (Vercel), use relative path to access serverless functions
// In development, use localhost backend
const API_URL = import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? '' : 'http://localhost:8000');

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Patients
export const getPatients = async (params?: {
  insurance_type?: string;
  state?: string;
  status?: string;
  risk_level?: string;
  search?: string;
}): Promise<Patient[]> => {
  const { data } = await api.get('/api/patients/', { params });
  return data;
};

export const getPatient = async (id: string): Promise<PatientWithEnrichment> => {
  const { data } = await api.get(`/api/patients/${id}`);
  return data;
};

export const createPatient = async (patient: Partial<Patient>): Promise<Patient> => {
  const { data } = await api.post('/api/patients/', patient);
  return data;
};

// Calls
export const getCalls = async (patientId?: string): Promise<Call[]> => {
  const { data } = await api.get('/api/calls/', {
    params: patientId ? { patient_id: patientId } : {},
  });
  return data;
};

export const getCall = async (id: string): Promise<Call> => {
  const { data } = await api.get(`/api/calls/${id}`);
  return data;
};

export const analyzeCall = async (
  patientId: string,
  transcript?: string
): Promise<CallAnalysis> => {
  const { data } = await api.post('/api/calls/analyze', {
    patient_id: patientId,
    transcript,
  });
  return data;
};

// Analytics
export const getAnalyticsDashboard = async (): Promise<AnalyticsDashboard> => {
  const { data } = await api.get('/api/analytics/dashboard');
  return data;
};

export const getKPIMetrics = async () => {
  const { data } = await api.get('/api/analytics/kpi');
  return data;
};

// Integrations
export const getIntegrations = async (): Promise<DataIntegration[]> => {
  const { data } = await api.get('/api/integrations/');
  return data;
};

export const getIntegrationHealth = async () => {
  const { data } = await api.get('/api/integrations/health');
  return data;
};

// Initialize mock data
export const initializeMockData = async () => {
  const { data } = await api.post('/api/init-data');
  return data;
};

export default api;
