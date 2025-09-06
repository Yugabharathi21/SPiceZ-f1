import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message);
    
    // Handle specific error cases
    if (error.response?.status === 404) {
      console.warn('Resource not found');
    } else if (error.response?.status >= 500) {
      console.error('Server error occurred');
    }
    
    return Promise.reject(error);
  }
);

// API service functions
export const apiService = {
  // Health check
  async healthCheck() {
    const response = await apiClient.get('/health');
    return response.data;
  },

  // Current race
  async getCurrentRace() {
    const response = await apiClient.get('/races/current');
    return response.data;
  },

  // Race predictions
  async getRacePredictions(raceId: number) {
    const response = await apiClient.get(`/races/${raceId}/predictions`);
    return response.data.predictions;
  },

  // Driver information
  async getDriver(driverId: number) {
    const response = await apiClient.get(`/drivers/${driverId}`);
    return response.data;
  },

  // Driver performance
  async getDriverPerformance(driverId: number, limit = 10) {
    const response = await apiClient.get(`/drivers/${driverId}/performance?limit=${limit}`);
    return response.data.performance;
  },

  // Driver explanations
  async getDriverExplanations(driverId: number, raceId?: number) {
    const url = `/drivers/${driverId}/explanations${raceId ? `?race_id=${raceId}` : ''}`;
    const response = await apiClient.get(url);
    return response.data.explanations;
  },

  // Lap data
  async getLapData(raceId: number) {
    const response = await apiClient.get(`/races/${raceId}/lap-data`);
    return response.data.lap_data;
  },

  // Pit data
  async getPitData(raceId: number) {
    const response = await apiClient.get(`/races/${raceId}/pit-data`);
    return response.data.pit_data;
  },

  // Confidence stream
  async getConfidenceStream(raceId: number) {
    const response = await apiClient.get(`/races/${raceId}/confidence-stream`);
    return response.data.confidence_data;
  },

  // Telemetry data
  async getTelemetryData(sessionId: string, driverId?: number) {
    const url = `/telemetry/${sessionId}${driverId ? `?driver_id=${driverId}` : ''}`;
    const response = await apiClient.get(url);
    return response.data.telemetry;
  },

  // Make prediction
  async predict(request: {
    raceId: number;
    driverId: number;
    constructorId: number;
    qualifying_position?: number;
    live_last_3_laps_mean_ms?: number;
    live_last_3_sector_deltas_ms?: number[];
    precomputed_features?: Record<string, any>;
  }) {
    const response = await apiClient.post('/predict', request);
    return response.data;
  },

  // Model status
  async getModelStatus() {
    const response = await apiClient.get('/models/status');
    return response.data.model_status;
  },
};

export default apiClient;