import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import RaceOverview from './pages/RaceOverview';
import DriverProfile from './pages/DriverProfile';
import LiveMode from './pages/LiveMode';
import { mockApiService } from './api/mockApi';
import './styles/globals.css';

function App() {
  const [currentRace, setCurrentRace] = useState(null);
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
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-white font-bold">Loading F1 Analytics...</span>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white">
        <Header currentRace={currentRace} />
        <main className="pt-20">
          <Routes>
            <Route path="/" element={<Navigate to="/race-overview" replace />} />
            <Route path="/race-overview" element={<RaceOverview race={currentRace} />} />
            <Route path="/driver/:driverId" element={<DriverProfile />} />
            <Route path="/live" element={<LiveMode race={currentRace} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;