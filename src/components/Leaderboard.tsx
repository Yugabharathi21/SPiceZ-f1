import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown, Minus, Trophy, Zap } from 'lucide-react';

interface LeaderboardProps {
  predictions: any[];
  isLoading: boolean;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ predictions, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-white mb-6">Predicted Finishing Order</h2>
        <div className="space-y-4">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-700/50 rounded-xl h-16"></div>
          ))}
        </div>
      </div>
    );
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPositionIcon = (position: number) => {
    if (position === 1) return <Trophy className="w-5 h-5 text-yellow-500" />;
    if (position <= 3) return <Trophy className="w-5 h-5 text-gray-400" />;
    if (position <= 10) return <Zap className="w-5 h-5 text-blue-500" />;
    return null;
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Predicted Finishing Order</h2>
        <div className="text-sm text-gray-400">
          Updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      <div className="space-y-3">
        {predictions.map((prediction, index) => (
          <Link
            key={prediction.driverId}
            to={`/driver/${prediction.driverId}`}
            className="block group transition-all duration-200 hover:transform hover:scale-[1.02]"
          >
            <div className="bg-gray-900/50 border border-gray-700/30 rounded-xl p-4 group-hover:bg-gray-900/80 group-hover:border-red-600/30 transition-all duration-200">
              <div className="flex items-center space-x-4">
                {/* Position */}
                <div className="flex items-center justify-center w-12 h-12 bg-gray-800 rounded-xl">
                  <span className="text-xl font-bold text-white">{Math.round(prediction.predicted_position)}</span>
                  {getPositionIcon(Math.round(prediction.predicted_position)) && (
                    <div className="ml-1">
                      {getPositionIcon(Math.round(prediction.predicted_position))}
                    </div>
                  )}
                </div>

                {/* Driver Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3">
                    <h3 className="font-bold text-white text-lg truncate">
                      {prediction.driver?.forename} {prediction.driver?.surname}
                    </h3>
                    <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
                      {prediction.driver?.code}
                    </span>
                    {getTrendIcon(prediction.trend)}
                  </div>
                  <p className="text-sm text-gray-400">{prediction.constructor?.name}</p>
                </div>

                {/* Confidence */}
                <div className="flex flex-col items-end space-y-2">
                  <div className="text-right">
                    <p className="text-sm font-medium text-white">
                      {(prediction.confidence * 100).toFixed(1)}%
                    </p>
                    <p className="text-xs text-gray-400">confidence</p>
                  </div>
                  <div className="w-24 bg-gray-700 rounded-full h-2">
                    <div
                      className="h-2 bg-gradient-to-r from-red-600 to-red-400 rounded-full transition-all duration-500"
                      style={{ width: `${prediction.confidence * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-gray-700/50">
        <div className="flex flex-wrap gap-4 text-xs text-gray-400">
          <div className="flex items-center space-x-1">
            <Trophy className="w-3 h-3 text-yellow-500" />
            <span>Podium</span>
          </div>
          <div className="flex items-center space-x-1">
            <Zap className="w-3 h-3 text-blue-500" />
            <span>Points</span>
          </div>
          <div className="flex items-center space-x-1">
            <TrendingUp className="w-3 h-3 text-green-500" />
            <span>Rising</span>
          </div>
          <div className="flex items-center space-x-1">
            <TrendingDown className="w-3 h-3 text-red-500" />
            <span>Falling</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;