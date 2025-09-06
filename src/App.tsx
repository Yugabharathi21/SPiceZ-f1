import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import RaceOverview from './pages/RaceOverview';
import DriverProfile from './pages/DriverProfile';
import LiveMode from './pages/LiveMode';
import CopilotChat from './components/CopilotChat';
import { ThemeProvider } from './contexts/ThemeContext';
import { mockApiService } from './api/mockApi';
import './styles/globals.css';

// Define types for consistency
interface Race {
  raceId: number;
  name: string;
  date: string;
  time: string;
  location: string;
  round: number;
  circuit: {
    name: string;
    location: string;
    length: number;
    laps: number;
    country: string;
  };
}

function App() {
  const [currentRace, setCurrentRace] = useState<Race | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const race = await mockApiService.getCurrentRace();
        setCurrentRace(race);
      } catch (error) {
        console.error('Error loading initial data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-f1-black flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-f1-red border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 bg-f1-red rounded-full"></div>
            </div>
          </div>
          <span className="text-f1-black dark:text-white font-bold font-f1 uppercase">Loading SPiceZ F1 Analytics...</span>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-f1-silver dark:bg-f1-black text-f1-black dark:text-white">
          <Header currentRace={currentRace} />
          <main className="pt-16 md:pt-20">
            <Routes>
              <Route path="/" element={<Navigate to="/race-overview" replace />} />
              <Route path="/race-overview" element={<RaceOverview race={currentRace} />} />
              <Route path="/driver/:driverId" element={<DriverProfile />} />
              <Route path="/live" element={<LiveMode race={currentRace} />} />
              <Route path="*" element={<Navigate to="/race-overview" replace />} />
            </Routes>
          </main>
          
          {/* Floating Copilot Chat Widget */}
          <CopilotChat />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;