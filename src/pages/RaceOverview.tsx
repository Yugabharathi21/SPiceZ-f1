import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, ChevronRight, BarChart3, Flag, ShieldAlert, Gauge, Users, SlidersHorizontal, Layers, PanelRight, PanelLeft, PlusCircle, X } from 'lucide-react';
import Leaderboard from '../components/Leaderboard';
import TrackMap from '../components/TrackMap';
import SessionTimeline from '../components/SessionTimeline';
import { mockApiService } from '../api/mockApi';

// Define Race type for type safety
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

// Define Prediction type
interface Prediction {
  driverId: number;
  driver: {
    forename: string;
    surname: string;
    code: string;
  };
  constructor: {
    name: string;
  };
  predicted_position: number;
  confidence: number;
  trend: string;
}

interface RaceOverviewProps {
  race: Race | null;
}

const RaceOverview: React.FC<RaceOverviewProps> = ({ race }) => {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [layoutMode, setLayoutMode] = useState<'grid' | 'compact' | 'detailed'>('grid');
  const [showDashboardEditor, setShowDashboardEditor] = useState(false);
  
  // Demo stats for quick insights
  const quickStats = [
    { label: 'Weather', value: 'Clear', icon: <ShieldAlert className="text-yellow-500" />, change: '+2°C' },
    { label: 'Tire Deg', value: 'Medium', icon: <Gauge className="text-orange-500" />, change: '1.2%/lap' },
    { label: 'Top Speed', value: '329 km/h', icon: <BarChart3 className="text-green-500" />, change: '+4 km/h' },
    { label: 'DNF Risk', value: '18%', icon: <Flag className="text-red-500" />, change: '-3%' },
  ];

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
        <p className="text-gray-500 dark:text-gray-400">No race data available</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="f1-heading-2 flex items-center">
          Dashboard
          <ChevronRight className="h-6 w-6 mx-1 text-gray-400" />
          <span className="text-f1-red">{race.name}</span>
        </h1>
        
        <div className="flex space-x-3">
          <div className="flex p-1 bg-gray-100 dark:bg-f1-gray/30 rounded-lg">
            <button 
              onClick={() => setLayoutMode('compact')}
              className={`p-2 rounded ${layoutMode === 'compact' ? 'bg-white dark:bg-f1-dark shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}
              aria-label="Compact view"
            >
              <PanelLeft size={18} />
            </button>
            <button 
              onClick={() => setLayoutMode('grid')}
              className={`p-2 rounded ${layoutMode === 'grid' ? 'bg-white dark:bg-f1-dark shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}
              aria-label="Grid view"
            >
              <Layers size={18} />
            </button>
            <button 
              onClick={() => setLayoutMode('detailed')}
              className={`p-2 rounded ${layoutMode === 'detailed' ? 'bg-white dark:bg-f1-dark shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}
              aria-label="Detailed view"
            >
              <PanelRight size={18} />
            </button>
          </div>
          
          <button 
            onClick={() => setShowDashboardEditor(!showDashboardEditor)}
            className={`flex items-center space-x-1 p-2 rounded-lg ${showDashboardEditor ? 'bg-f1-red text-white' : 'bg-gray-100 dark:bg-f1-gray/30 hover:bg-gray-200 dark:hover:bg-f1-gray/50'}`}
          >
            <SlidersHorizontal size={18} />
            <span className="text-sm font-medium">Customize</span>
          </button>
        </div>
      </div>

      {/* Race Header Card */}
      <div className="f1-card-highlight mb-6">
        <div className="bg-gradient-to-r from-f1-red/10 to-transparent dark:from-f1-red/5 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="f1-heading-3 mb-2">{race.name}</h2>
              <div className="flex flex-wrap items-center gap-6 text-gray-700 dark:text-gray-300">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-f1-red" />
                  <span>{race.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-f1-red" />
                  <span>{race.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-f1-red" />
                  <span>{race.time || 'TBD'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Flag className="w-5 h-5 text-f1-red" />
                  <span>{race.circuit.name}</span>
                </div>
              </div>
            </div>
            <div className="mt-4 lg:mt-0">
              <div className="bg-f1-red text-white rounded-xl p-4 text-center">
                <p className="text-xs uppercase tracking-wider mb-1 opacity-80">Round</p>
                <p className="text-3xl font-bold font-f1mono">{race.round || '1'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
        {quickStats.map((stat, index) => (
          <div key={index} className="f1-card p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{stat.label}</p>
              <div className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-f1-gray/20 rounded-md">
                {stat.icon}
              </div>
            </div>
            <div className="flex items-end justify-between">
              <p className="text-xl font-bold font-f1mono">{stat.value}</p>
              <p className={`text-xs font-medium ${
                stat.change.startsWith('+') 
                  ? 'text-green-600 dark:text-green-500' 
                  : stat.change.startsWith('-')
                    ? 'text-red-600 dark:text-red-500'
                    : 'text-gray-500 dark:text-gray-400'
              }`}>
                {stat.change}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className={`gap-6 ${layoutMode === 'compact' ? 'flex flex-col lg:flex-row' : 'grid grid-cols-1 lg:grid-cols-3'}`}>
        {/* Leaderboard */}
        <div className={layoutMode === 'compact' ? 'lg:w-2/3' : 'lg:col-span-2'}>
          <Leaderboard predictions={predictions} isLoading={isLoading} />
        </div>

        {/* Track Map */}
        <div className={layoutMode === 'compact' ? 'lg:w-1/3' : 'lg:col-span-1'}>
          <TrackMap circuit={race.circuit} />
        </div>
      </div>

      {/* Session Timeline */}
      <div className="mt-6">
        <SessionTimeline race={race} predictions={predictions} />
      </div>

      {/* Dashboard Editor */}
      {showDashboardEditor && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-f1-dark rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-f1-gray/20 flex justify-between items-center">
              <h3 className="font-bold text-xl">Customize Dashboard</h3>
              <button 
                onClick={() => setShowDashboardEditor(false)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-f1-gray/20 rounded-full"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 dark:text-white">Available Widgets</h4>
                
                <div className="grid grid-cols-2 gap-3">
                  {['Leaderboard', 'Track Map', 'Timeline', 'Driver Comparison', 'Weather', 'Telemetry', 'Tire Strategy', 'Lap Times', 'Team Radio'].map((widget, i) => (
                    <div key={i} className="border border-gray-200 dark:border-f1-gray/20 rounded-lg p-3 flex items-center justify-between hover:border-f1-red/50 cursor-pointer">
                      <span className="font-medium">{widget}</span>
                      <PlusCircle className="text-f1-red" size={18} />
                    </div>
                  ))}
                </div>
                
                <h4 className="font-semibold text-gray-900 dark:text-white mt-6">Layout Preferences</h4>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <input type="checkbox" id="auto-refresh" className="rounded text-f1-red" checked />
                    <label htmlFor="auto-refresh" className="ml-2">Auto-refresh data</label>
                  </div>
                  <div>
                    <label className="block mb-1">Update interval</label>
                    <select className="f1-input">
                      <option>10 seconds</option>
                      <option>30 seconds</option>
                      <option>1 minute</option>
                      <option>5 minutes</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button 
                  onClick={() => setShowDashboardEditor(false)} 
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-f1-gray/20 rounded-lg"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => setShowDashboardEditor(false)}
                  className="px-4 py-2 bg-f1-red text-white rounded-lg hover:bg-f1-red-light"
                >
                  Apply Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Team Comparison Widget - Commented out for future implementation */}
      {/* 
      <div className="mt-6 f1-card p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">Team Comparison</h3>
          <div className="flex gap-2">
            <select className="f1-input py-1 px-3 text-sm">
              <option>Red Bull Racing</option>
              <option>Mercedes</option>
              <option>Ferrari</option>
            </select>
            <select className="f1-input py-1 px-3 text-sm">
              <option>Mercedes</option>
              <option>Red Bull Racing</option>
              <option>Ferrari</option>
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-1 space-y-3">
            <div className="border-l-4 border-blue-500 pl-3 py-1">
              <p className="text-xs text-gray-500 dark:text-gray-400">PACE</p>
              <div className="flex items-center justify-between">
                <span className="font-bold">Mercedes</span>
                <span className="font-mono font-bold text-blue-600">+0.324s</span>
              </div>
            </div>
            
            <div className="border-l-4 border-red-500 pl-3 py-1">
              <p className="text-xs text-gray-500 dark:text-gray-400">RELIABILITY</p>
              <div className="flex items-center justify-between">
                <span className="font-bold">Red Bull</span>
                <span className="font-mono font-bold text-red-600">97%</span>
              </div>
            </div>
            
            <div className="border-l-4 border-blue-500 pl-3 py-1">
              <p className="text-xs text-gray-500 dark:text-gray-400">TIRE MANAGEMENT</p>
              <div className="flex items-center justify-between">
                <span className="font-bold">Mercedes</span>
                <span className="font-mono font-bold text-blue-600">8.4/10</span>
              </div>
            </div>
          </div>
          
          <div className="col-span-2">
            <div className="h-48 bg-gray-100 dark:bg-f1-gray/20 rounded-lg flex items-center justify-center">
              <p className="text-gray-500 dark:text-gray-400">Team comparison chart</p>
            </div>
          </div>
        </div>
      </div>
      */}
    </div>
  );
};

export default RaceOverview;