import React from 'react';
import { MapPin, Gauge, Clock } from 'lucide-react';

interface TrackMapProps {
  circuit: any;
}

const TrackMap: React.FC<TrackMapProps> = ({ circuit }) => {
  // Mock track layout data
  const sectors = [
    { id: 1, name: 'Sector 1', fastestTime: '28.234', avgSpeed: '195 km/h', difficulty: 'high' },
    { id: 2, name: 'Sector 2', fastestTime: '31.567', avgSpeed: '168 km/h', difficulty: 'medium' },
    { id: 3, name: 'Sector 3', fastestTime: '25.891', avgSpeed: '212 km/h', difficulty: 'low' },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 h-fit">
      <h2 className="text-2xl font-bold text-white mb-6">Circuit Overview</h2>

      {/* Track Visual (Simplified) */}
      <div className="relative bg-gray-900 rounded-xl p-6 mb-6 min-h-[200px]">
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Simplified track layout visualization */}
          <div className="relative w-48 h-32">
            <div className="absolute inset-0 border-4 border-red-600/30 rounded-full"></div>
            <div className="absolute top-4 left-4 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <div className="absolute top-8 right-8 w-2 h-2 bg-yellow-500 rounded-full"></div>
            <div className="absolute bottom-8 left-1/2 w-2 h-2 bg-red-500 rounded-full"></div>
          </div>
        </div>
        
        {/* Checkered flag pattern overlay */}
        <div className="absolute top-4 right-4 w-8 h-6 bg-gradient-to-br from-black via-white to-black opacity-20 rounded"></div>
      </div>

      {/* Circuit Details */}
      <div className="space-y-4 mb-6">
        <div className="flex items-center space-x-3">
          <MapPin className="w-5 h-5 text-red-600" />
          <div>
            <p className="font-medium text-white">{circuit?.name || 'Circuit Name'}</p>
            <p className="text-sm text-gray-400">{circuit?.location || 'Location'}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-900/50 rounded-lg p-3">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Length</p>
            <p className="font-bold text-white">{circuit?.length || '5.412'} km</p>
          </div>
          <div className="bg-gray-900/50 rounded-lg p-3">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Laps</p>
            <p className="font-bold text-white">{circuit?.laps || '58'}</p>
          </div>
        </div>
      </div>

      {/* Sector Analysis */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-white">Sector Performance</h3>
        {sectors.map((sector) => (
          <div key={sector.id} className="bg-gray-900/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-white">{sector.name}</span>
              <div className={`w-3 h-3 rounded-full ${getDifficultyColor(sector.difficulty)}`}></div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300">{sector.fastestTime}s</span>
              </div>
              <div className="flex items-center space-x-2">
                <Gauge className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300">{sector.avgSpeed}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-gray-700/50">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span>High Difficulty</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span>Medium</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Low</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackMap;