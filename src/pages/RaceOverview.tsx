import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock } from 'lucide-react';
import Leaderboard from '../components/Leaderboard';
import TrackMap from '../components/TrackMap';
import SessionTimeline from '../components/SessionTimeline';
import { mockApiService } from '../api/mockApi';

interface RaceOverviewProps {
  race: any;
}

const RaceOverview: React.FC<RaceOverviewProps> = ({ race }) => {
  const [predictions, setPredictions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPredictions = async () => {
      if (race) {
        try {
          const data = await mockApiService.getRacePredictions(race.raceId);
          setPredictions(data);
        } catch (error) {
          console.error('Error loading predictions:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadPredictions();
  }, [race]);

  if (!race) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">No race data available</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Race Header */}
      <div className="bg-gradient-to-r from-red-900/20 to-black border border-red-600/20 rounded-2xl p-8 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">{race.name}</h1>
            <div className="flex flex-wrap items-center gap-6 text-gray-300">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-red-600" />
                <span>{race.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-red-600" />
                <span>{race.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-red-600" />
                <span>{race.time || 'TBD'}</span>
              </div>
            </div>
          </div>
          <div className="mt-4 lg:mt-0">
            <div className="bg-red-600/20 border border-red-600/50 rounded-xl p-4 text-center">
              <p className="text-xs text-red-400 uppercase tracking-wider mb-1">Round</p>
              <p className="text-3xl font-bold text-white">{race.round || '1'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Leaderboard */}
        <div className="xl:col-span-2">
          <Leaderboard predictions={predictions} isLoading={isLoading} />
        </div>

        {/* Track Map */}
        <div className="xl:col-span-1">
          <TrackMap circuit={race.circuit} />
        </div>
      </div>

      {/* Session Timeline */}
      <div className="mt-8">
        <SessionTimeline race={race} predictions={predictions} />
      </div>
    </div>
  );
};

export default RaceOverview;