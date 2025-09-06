import React from 'react';
import { Wrench, Clock, TrendingDown } from 'lucide-react';

interface PitTimelineProps {
  data: any[];
  currentLap: number;
}

const PitTimeline: React.FC<PitTimelineProps> = ({ data, currentLap }) => {
  // Generate mock pit stop data
  const pitStops = React.useMemo(() => {
    if (!data.length) {
      return [
        { driverId: 1, driver: 'VER', lap: 15, duration: 2.4, stop: 1, tireChange: 'Medium → Soft' },
        { driverId: 2, driver: 'HAM', lap: 18, duration: 2.8, stop: 1, tireChange: 'Hard → Medium' },
        { driverId: 3, driver: 'LEC', lap: 22, duration: 2.1, stop: 1, tireChange: 'Soft → Hard' },
        { driverId: 4, driver: 'RUS', lap: 24, duration: 3.2, stop: 1, tireChange: 'Medium → Soft' },
        { driverId: 5, driver: 'NOR', lap: 28, duration: 2.5, stop: 1, tireChange: 'Soft → Medium' },
        { driverId: 1, driver: 'VER', lap: 35, duration: 2.3, stop: 2, tireChange: 'Soft → Hard' },
        { driverId: 3, driver: 'LEC', lap: 38, duration: 2.7, stop: 2, tireChange: 'Hard → Soft' },
      ].filter(stop => stop.lap <= currentLap);
    }
    return data.filter((stop: any) => stop.lap <= currentLap);
  }, [data, currentLap]);

  const getDurationColor = (duration: number) => {
    if (duration <= 2.5) return 'text-green-400';
    if (duration <= 3.0) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getDurationBg = (duration: number) => {
    if (duration <= 2.5) return 'bg-green-500/20 border-green-500/30';
    if (duration <= 3.0) return 'bg-yellow-500/20 border-yellow-500/30';
    return 'bg-red-500/20 border-red-500/30';
  };

  const getTireColor = (tire: string) => {
    if (tire.includes('Soft')) return 'bg-red-500';
    if (tire.includes('Medium')) return 'bg-yellow-500';
    if (tire.includes('Hard')) return 'bg-gray-300';
    return 'bg-blue-500';
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Wrench className="w-6 h-6 text-red-600" />
          <h2 className="text-2xl font-bold text-white">Pit Stops</h2>
        </div>
        <div className="text-sm text-gray-400">
          {pitStops.length} stops completed
        </div>
      </div>

      {pitStops.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <Wrench className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No pit stops yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pitStops.map((stop, index) => (
            <div 
              key={`${stop.driverId}-${stop.stop}`}
              className={`border rounded-xl p-4 transition-all duration-500 ${getDurationBg(stop.duration)}`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
                    <span className="font-bold text-white text-sm">{stop.driver}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-white">Pit Stop #{stop.stop}</h3>
                    <p className="text-sm text-gray-400">Lap {stop.lap}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={`text-2xl font-bold ${getDurationColor(stop.duration)}`}>
                    {stop.duration}s
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-gray-400">
                    <Clock className="w-3 h-3" />
                    <span>Duration</span>
                  </div>
                </div>
              </div>

              {/* Tire Change Visualization */}
              <div className="flex items-center justify-between bg-gray-900/30 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-400">Tires:</span>
                  <span className="text-sm text-white font-medium">{stop.tireChange}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  {stop.duration <= 2.5 && (
                    <div className="flex items-center space-x-1 text-green-400">
                      <TrendingDown className="w-3 h-3" />
                      <span className="text-xs">Fast</span>
                    </div>
                  )}
                  {stop.duration > 3.0 && (
                    <div className="flex items-center space-x-1 text-red-400">
                      <TrendingDown className="w-3 h-3 rotate-180" />
                      <span className="text-xs">Slow</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Pit Stop Impact */}
              <div className="mt-3 text-xs text-gray-400">
                <div className="flex justify-between">
                  <span>Positions lost/gained:</span>
                  <span className="text-white">-2 / +1</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pit Stop Statistics */}
      <div className="mt-6 pt-4 border-t border-gray-700/50">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-gray-900/30 rounded-lg p-3">
            <p className="text-lg font-bold text-white">
              {pitStops.length > 0 ? (pitStops.reduce((sum, stop) => sum + stop.duration, 0) / pitStops.length).toFixed(2) : '0.0'}s
            </p>
            <p className="text-xs text-gray-400">Avg Duration</p>
          </div>
          <div className="bg-gray-900/30 rounded-lg p-3">
            <p className="text-lg font-bold text-white">
              {pitStops.length > 0 ? Math.min(...pitStops.map(s => s.duration)).toFixed(1) : '0.0'}s
            </p>
            <p className="text-xs text-gray-400">Fastest</p>
          </div>
          <div className="bg-gray-900/30 rounded-lg p-3">
            <p className="text-lg font-bold text-white">{pitStops.length}</p>
            <p className="text-xs text-gray-400">Total Stops</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PitTimeline;