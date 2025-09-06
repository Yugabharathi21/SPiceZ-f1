// Mock API service for F1 predictive platform
import { apiService } from './apiClient';

// Flag to use real API or mock data
const USE_REAL_API = import.meta.env.VITE_USE_REAL_API === 'true';

export const mockApiService = {
  // Get current race information
  getCurrentRace: async () => {
    if (USE_REAL_API) {
      try {
        return await apiService.getCurrentRace();
      } catch (error) {
        console.warn('Real API failed, falling back to mock data:', error);
      }
    }
    
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      raceId: 1050,
      name: 'Monaco Grand Prix',
      date: '2024-05-26',
      time: '15:00',
      location: 'Monte Carlo, Monaco',
      round: 8,
      circuit: {
        name: 'Circuit de Monaco',
        location: 'Monte Carlo, Monaco',
        length: 3.337,
        laps: 78,
        country: 'Monaco'
      }
    };
  },

  // Get race predictions
  getRacePredictions: async (raceId: number) => {
    if (USE_REAL_API) {
      try {
        return await apiService.getRacePredictions(raceId);
      } catch (error) {
        console.warn('Real API failed, falling back to mock data:', error);
      }
    }
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const drivers = [
      { driverId: 1, driver: { forename: 'Max', surname: 'Verstappen', code: 'VER' }, constructor: { name: 'Red Bull Racing' }, predicted_position: 1.2, confidence: 0.87, trend: 'up' },
      { driverId: 2, driver: { forename: 'Lewis', surname: 'Hamilton', code: 'HAM' }, constructor: { name: 'Mercedes' }, predicted_position: 2.1, confidence: 0.82, trend: 'up' },
      { driverId: 3, driver: { forename: 'Charles', surname: 'Leclerc', code: 'LEC' }, constructor: { name: 'Ferrari' }, predicted_position: 2.8, confidence: 0.78, trend: 'down' },
      { driverId: 4, driver: { forename: 'George', surname: 'Russell', code: 'RUS' }, constructor: { name: 'Mercedes' }, predicted_position: 4.2, confidence: 0.75, trend: 'stable' },
      { driverId: 5, driver: { forename: 'Lando', surname: 'Norris', code: 'NOR' }, constructor: { name: 'McLaren' }, predicted_position: 5.1, confidence: 0.73, trend: 'up' },
      { driverId: 6, driver: { forename: 'Carlos', surname: 'Sainz Jr.', code: 'SAI' }, constructor: { name: 'Ferrari' }, predicted_position: 6.3, confidence: 0.69, trend: 'down' },
      { driverId: 7, driver: { forename: 'Oscar', surname: 'Piastri', code: 'PIA' }, constructor: { name: 'McLaren' }, predicted_position: 7.5, confidence: 0.65, trend: 'up' },
      { driverId: 8, driver: { forename: 'Fernando', surname: 'Alonso', code: 'ALO' }, constructor: { name: 'Aston Martin' }, predicted_position: 8.2, confidence: 0.62, trend: 'stable' },
      { driverId: 9, driver: { forename: 'Sergio', surname: 'Pérez', code: 'PER' }, constructor: { name: 'Red Bull Racing' }, predicted_position: 9.8, confidence: 0.58, trend: 'down' },
      { driverId: 10, driver: { forename: 'Lance', surname: 'Stroll', code: 'STR' }, constructor: { name: 'Aston Martin' }, predicted_position: 10.4, confidence: 0.55, trend: 'stable' },
    ];

    return drivers;
  },

  // Get driver information
  getDriver: async (driverId: number) => {
    if (USE_REAL_API) {
      try {
        return await apiService.getDriver(driverId);
      } catch (error) {
        console.warn('Real API failed, falling back to mock data:', error);
      }
    }
    
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const drivers: { [key: number]: any } = {
      1: {
        driverId: 1,
        forename: 'Max',
        surname: 'Verstappen',
        code: 'VER',
        number: 1,
        nationality: 'Dutch',
        dob: '1997-09-30',
        wins: 54,
        podiums: 98,
        points: 575,
        championshipPosition: 1,
        avgFinish: 2.3,
        dnfs: 2,
        avgGrid: 1.8,
        q3Count: 22,
        poles: 12,
        avgLapTime: '1:29.456',
        fastestLaps: 8,
        consistency: '94.2%'
      },
      2: {
        driverId: 2,
        forename: 'Lewis',
        surname: 'Hamilton',
        code: 'HAM',
        number: 44,
        nationality: 'British',
        dob: '1985-01-07',
        wins: 103,
        podiums: 197,
        points: 4405,
        championshipPosition: 3,
        avgFinish: 4.2,
        dnfs: 1,
        avgGrid: 3.4,
        q3Count: 20,
        poles: 6,
        avgLapTime: '1:29.892',
        fastestLaps: 4,
        consistency: '91.8%'
      }
    };

    return drivers[driverId] || drivers[1];
  },

  // Get driver performance history
  getDriverPerformance: async (driverId: number) => {
    if (USE_REAL_API) {
      try {
        return await apiService.getDriverPerformance(driverId);
      } catch (error) {
        console.warn('Real API failed, falling back to mock data:', error);
      }
    }
    
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return Array.from({ length: 10 }, (_, i) => ({
      race: `R${10 - i}`,
      position: Math.floor(Math.random() * 15) + 1,
      points: Math.floor(Math.random() * 25),
      dnf: Math.random() < 0.1
    }));
  },

  // Get SHAP explanations for driver predictions
  getDriverExplanations: async (driverId: number) => {
    if (USE_REAL_API) {
      try {
        return await apiService.getDriverExplanations(driverId);
      } catch (error) {
        console.warn('Real API failed, falling back to mock data:', error);
      }
    }
    
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return [
      { feature: 'Qualifying Position', contribution: 2.3 },
      { feature: 'Recent Form', contribution: 1.8 },
      { feature: 'Circuit Performance', contribution: 1.2 },
      { feature: 'Constructor Pace', contribution: 0.9 },
      { feature: 'Weather Conditions', contribution: -0.4 },
      { feature: 'Tire Strategy', contribution: -0.7 },
      { feature: 'Track Temperature', contribution: -1.1 },
    ];
  },

  // Get lap time data
  getLapData: async (raceId: number) => {
    if (USE_REAL_API) {
      try {
        return await apiService.getLapData(raceId);
      } catch (error) {
        console.warn('Real API failed, falling back to mock data:', error);
      }
    }
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return Array.from({ length: 58 }, (_, lap) => ({
      lap: lap + 1,
      VER: 90000 + Math.random() * 2000,
      HAM: 91000 + Math.random() * 2000,
      LEC: 90500 + Math.random() * 2000,
      RUS: 91500 + Math.random() * 2000,
      NOR: 92000 + Math.random() * 2000,
    }));
  },

  // Get pit stop data
  getPitData: async (raceId: number) => {
    if (USE_REAL_API) {
      try {
        return await apiService.getPitData(raceId);
      } catch (error) {
        console.warn('Real API failed, falling back to mock data:', error);
      }
    }
    
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return [
      { driverId: 1, driver: 'VER', lap: 15, duration: 2.4, stop: 1, tireChange: 'Medium → Soft' },
      { driverId: 2, driver: 'HAM', lap: 18, duration: 2.8, stop: 1, tireChange: 'Hard → Medium' },
      { driverId: 3, driver: 'LEC', lap: 22, duration: 2.1, stop: 1, tireChange: 'Soft → Hard' },
      { driverId: 4, driver: 'RUS', lap: 24, duration: 3.2, stop: 1, tireChange: 'Medium → Soft' },
      { driverId: 5, driver: 'NOR', lap: 28, duration: 2.5, stop: 1, tireChange: 'Soft → Medium' },
      { driverId: 1, driver: 'VER', lap: 35, duration: 2.3, stop: 2, tireChange: 'Soft → Hard' },
      { driverId: 3, driver: 'LEC', lap: 38, duration: 2.7, stop: 2, tireChange: 'Hard → Soft' },
    ];
  },

  // Get confidence stream data
  getConfidenceStream: async (raceId: number) => {
    if (USE_REAL_API) {
      try {
        return await apiService.getConfidenceStream(raceId);
      } catch (error) {
        console.warn('Real API failed, falling back to mock data:', error);
      }
    }
    
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return Array.from({ length: 58 }, (_, lap) => ({
      lap: lap + 1,
      VER_confidence: 0.8 + Math.random() * 0.15,
      HAM_confidence: 0.75 + Math.random() * 0.2,
      LEC_confidence: 0.7 + Math.random() * 0.25,
      RUS_confidence: 0.65 + Math.random() * 0.2,
      NOR_confidence: 0.6 + Math.random() * 0.3,
    }));
  },

  // Prediction endpoint
  predict: async (request: any) => {
    if (USE_REAL_API) {
      try {
        return await apiService.predict(request);
      } catch (error) {
        console.warn('Real API failed, falling back to mock data:', error);
      }
    }
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      predicted_position: 3.2,
      predicted_rank_probs: [0.05, 0.12, 0.28, 0.22, 0.15, 0.08, 0.05, 0.03, 0.01, 0.01],
      confidence: 0.78,
      explanations: {
        top_features: [
          { feature: 'qualifying_position', contribution: 2.1 },
          { feature: 'constructor_recent_form', contribution: 1.5 },
          { feature: 'driver_experience_at_track', contribution: 0.9 },
          { feature: 'weather_conditions', contribution: -0.3 },
          { feature: 'tire_strategy_risk', contribution: -0.8 }
        ]
      }
    };
  }
};