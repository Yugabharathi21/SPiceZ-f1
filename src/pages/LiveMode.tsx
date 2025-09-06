import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Activity } from 'lucide-react';
import LapChart from '../components/LapChart';
import PitTimeline from '../components/PitTimeline';
import ConfidenceStream from '../components/ConfidenceStream';
import { mockApiService } from '../api/mockApi';

interface LiveModeProps {
  race: any;
}

const LiveMode: React.FC<LiveModeProps> = ({ race }) => {
  const [isLive, setIsLive] = useState(false);
  const [currentLap, setCurrentLap] = useState(1);
  const [lapData, setLapData] = useState<any[]>([]);
  const [pitData, setPitData] = useState<any[]>([]);
  const [confidenceData, setConfidenceData] = useState<any[]>([]);

  useEffect(() => {
    const loadLiveData = async () => {
      if (race) {
        try {
          const [laps, pits, confidence] = await Promise.all([
            mockApiService.getLapData(race.raceId),
            mockApiService.getPitData(race.raceId),
            mockApiService.getConfidenceStream(race.raceId),
          ]);
          
          setLapData(laps);
          setPitData(pits);
          setConfidenceData(confidence);
        } catch (error) {
          console.error('Error loading live data:', error);
        }
      }
    };

    loadLiveData();
  }, [race]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isLive) {
      interval = setInterval(() => {
        setCurrentLap(prev => {
          const maxLap = Math.max(...lapData.map(d => d.lap || 1));
          return prev < maxLap ? prev + 1 : prev;
        });
      }, 2000); // Simulate 2-second lap updates
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLive, lapData]);

  const handlePlayPause = () => {
    setIsLive(!isLive);
  };

  const handleReset = () => {
    setIsLive(false);
    setCurrentLap(1);
  };

  if (!race) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">No race data available</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Live Controls */}
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-2 ${isLive ? 'text-red-500' : 'text-gray-400'}`}>
              <Activity className={`w-5 h-5 ${isLive ? 'animate-pulse' : ''}`} />
              <span className="font-bold">{isLive ? 'LIVE' : 'PAUSED'}</span>
            </div>
            <div className="text-white">
              <span className="text-2xl font-bold font-f1">Lap {currentLap}</span>
              <span className="text-gray-400 ml-2">/ {Math.max(...lapData.map(d => d.lap || 58))}</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleReset}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </button>
            <button
              onClick={handlePlayPause}
              className={`flex items-center space-x-2 px-6 py-2 rounded-lg font-medium transition-colors ${
                isLive 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {isLive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isLive ? 'Pause' : 'Play'}</span>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-red-600 to-red-400 h-2 rounded-full transition-all duration-1000"
              style={{ 
                width: `${(currentLap / Math.max(...lapData.map(d => d.lap || 58))) * 100}%` 
              }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Lap Chart */}
        <div className="xl:col-span-2">
          <LapChart data={lapData} currentLap={currentLap} />
        </div>

        {/* Confidence Stream */}
        <div>
          <ConfidenceStream data={confidenceData} currentLap={currentLap} />
        </div>

        {/* Pit Timeline */}
        <div>
          <PitTimeline data={pitData} currentLap={currentLap} />
        </div>
      </div>
    </div>
  );
};

export default LiveMode;