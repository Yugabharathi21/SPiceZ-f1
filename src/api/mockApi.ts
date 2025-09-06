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
  },

  // Get team and driver images from Wikipedia
  getTeamImages: async (teamName: string) => {
    if (USE_REAL_API) {
      try {
        return await apiService.getTeamImages(teamName);
      } catch (error) {
        console.warn('Real API failed, falling back to mock data:', error);
      }
    }
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Mock data with Wikipedia image URLs for F1 teams and cars
    const teamImages: { [key: string]: any } = {
      'Red Bull Racing': {
        logo: 'https://upload.wikimedia.org/wikipedia/en/f/ff/Oracle_Red_Bull_Racing_logo.svg',
        car: 'https://upload.wikimedia.org/wikipedia/commons/3/3d/Max_Verstappen_-_RB20_-_2024_%28cropped%29.jpg',
        drivers: {
          1: 'https://upload.wikimedia.org/wikipedia/commons/7/7d/Max_Verstappen_2017_Malaysia_3.jpg',
          9: 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Sergio_P%C3%A9rez_2023_Monaco_%28cropped%29.jpg'
        }
      },
      'Ferrari': {
        logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/d/d1/Ferrari-Logo.svg/800px-Ferrari-Logo.svg.png',
        car: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Charles_Leclerc_-_SF-24_-_Circuit_de_Barcelona-Catalunya_-_2024_%28cropped%29.jpg',
        drivers: {
          3: 'https://upload.wikimedia.org/wikipedia/commons/0/08/FIA_F1_Austria_2022_Nr._16_Leclerc_%28side%2C_squared%29.jpg',
          6: 'https://upload.wikimedia.org/wikipedia/commons/5/5a/Carlos_Sainz_at_Ferrari_%28cropped%29.jpg'
        }
      },
      'Mercedes': {
        logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fb/Mercedes_AMG_Petronas_F1_Logo.svg',
        car: 'https://upload.wikimedia.org/wikipedia/commons/9/9b/Lewis_Hamilton_-_W15_-_2024_%28cropped%29.jpg',
        drivers: {
          2: 'https://upload.wikimedia.org/wikipedia/commons/1/18/Lewis_Hamilton_2016_Malaysia_2.jpg',
          4: 'https://upload.wikimedia.org/wikipedia/commons/3/36/George_Russell_2021_in_Williams_Racing_uniform.jpg'
        }
      },
      'McLaren': {
        logo: 'https://upload.wikimedia.org/wikipedia/commons/6/66/McLaren_Racing_logo.svg',
        car: 'https://upload.wikimedia.org/wikipedia/commons/f/f0/Lando_Norris_-_MCL38_-_2024_%28cropped%29.jpg',
        drivers: {
          5: 'https://upload.wikimedia.org/wikipedia/commons/3/31/Lando_Norris_2021_in_McLaren_uniform.jpg',
          7: 'https://upload.wikimedia.org/wikipedia/commons/c/ce/Oscar_Piastri_2022_%28cropped%29.jpg'
        }
      },
      'Aston Martin': {
        logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/1/1f/Aston_Martin_F1_Team_logo.svg/1200px-Aston_Martin_F1_Team_logo.svg.png',
        car: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Fernando_Alonso_-_AMR24_-_2024_%28cropped%29.jpg',
        drivers: {
          8: 'https://upload.wikimedia.org/wikipedia/commons/8/8c/Fernando_Alonso_McLaren_2017_Cropped.jpg',
          10: 'https://upload.wikimedia.org/wikipedia/commons/f/fb/Lance_Stroll_2019_%28cropped%29.jpg'
        }
      },
      'Alpine': {
        logo: 'https://upload.wikimedia.org/wikipedia/en/c/c4/BWT_Alpine_F1_Team_logo.svg',
        car: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Pierre_Gasly_-_A524_-_2024_%28cropped%29.jpg',
        drivers: {
          11: 'https://upload.wikimedia.org/wikipedia/commons/6/66/F1_2019_test_Barcelona%2C_Gasly_%2833376134568%29_%28cropped%29.jpg',
          12: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Esteban_Ocon_2017_Malaysia.jpg'
        }
      },
      'Williams': {
        logo: 'https://upload.wikimedia.org/wikipedia/en/4/45/Williams_Racing_logo_2022.png',
        car: 'https://upload.wikimedia.org/wikipedia/commons/c/c6/Alex_Albon_-_FW46_-_2024_%28cropped%29.jpg',
        drivers: {
          13: 'https://upload.wikimedia.org/wikipedia/commons/9/98/Alex_Albon_2019_%28cropped%29.jpg',
          14: 'https://upload.wikimedia.org/wikipedia/commons/c/c7/Logan_Sargeant_2022_%28cropped%29.jpg'
        }
      },
      'RB': {
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Visa_Cash_App_RB_F1_Team.svg/1280px-Visa_Cash_App_RB_F1_Team.svg.png',
        car: 'https://upload.wikimedia.org/wikipedia/commons/c/c4/Daniel_Ricciardo_-_VCARB_01_-_2024_%28cropped%29.jpg',
        drivers: {
          15: 'https://upload.wikimedia.org/wikipedia/commons/5/58/Yuki_Tsunoda_2021_%28cropped%29.jpg',
          16: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Daniel_Ricciardo_2022_Australian_GP_%28cropped%29.jpg'
        }
      },
      'Haas F1 Team': {
        logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/MoneyGram_Haas_F1_Team_logo.png',
        car: 'https://upload.wikimedia.org/wikipedia/commons/e/ee/Nico_H%C3%BClkenberg_-_VF-24_-_2024_%28cropped%29.jpg',
        drivers: {
          17: 'https://upload.wikimedia.org/wikipedia/commons/2/26/Nico_Hülkenberg_2017_Malaysia.jpg',
          18: 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Kevin_Magnussen_2022_%28cropped%29.jpg'
        }
      },
      'Kick Sauber': {
        logo: 'https://upload.wikimedia.org/wikipedia/en/e/e1/Stake_F1_Team_Kick_Sauber.png',
        car: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Valtteri_Bottas_-_C44_-_2024_%28cropped%29.jpg',
        drivers: {
          19: 'https://upload.wikimedia.org/wikipedia/commons/2/29/Valtteri_Bottas_2023_United_States_GP.jpg',
          20: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Zhou_Guanyu_2022_%28cropped%29.jpg'
        }
      }
    };
    
    // Return specific team or all teams if no name provided
    if (teamName && teamImages[teamName]) {
      return teamImages[teamName];
    }
    
    return Object.entries(teamImages).map(([name, data]) => ({
      name,
      ...data
    }));
  }
};