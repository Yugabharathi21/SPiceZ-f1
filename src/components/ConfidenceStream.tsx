import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';

interface ConfidenceStreamProps {
  data: any[];
  currentLap: number;
}

const ConfidenceStream: React.FC<ConfidenceStreamProps> = ({ data, currentLap }) => {
  // Generate mock confidence data
  const confidenceData = React.useMemo(() => {
    if (!data.length) {
      const drivers = ['VER', 'HAM', 'LEC', 'RUS', 'NOR'];
      return Array.from({ length: Math.min(currentLap, 58) }, (_, lap) => {
        const lapData: any = { lap: lap + 1 };
        drivers.forEach(driver => {
          // Simulate confidence changes based on position and lap
          const baseConfidence = 0.7 + Math.random() * 0.2;
          const volatility = 0.05 + Math.random() * 0.1;
          lapData[`${driver}_confidence`] = Math.min(1, Math.max(0.3, baseConfidence + (Math.random() - 0.5) * volatility));
        });
        return lapData;
      });
    }
    return data.slice(0, currentLap);
  }, [data, currentLap]);

  const drivers = [
    { name: 'VER', color: '#0600EF', key: 'VER_confidence' },
    { name: 'HAM', color: '#00D2BE', key: 'HAM_confidence' },
    { name: 'LEC', color: '#DC143C', key: 'LEC_confidence' },
    { name: 'RUS', color: '#6CD3BF', key: 'RUS_confidence' },
    { name: 'NOR', color: '#FF8700', key: 'NOR_confidence' },
  ];

  const currentConfidence = confidenceData[confidenceData.length - 1] || {};
  
  const sortedDrivers = drivers
    .map(driver => ({
      ...driver,
      confidence: currentConfidence[driver.key] || 0
    }))
    .sort((a, b) => b.confidence - a.confidence);

  const getConfidenceLevel = (confidence: number) => {
    if (confidence >= 0.8) return { level: 'High', color: 'text-green-400', icon: TrendingUp };
    if (confidence >= 0.6) return { level: 'Medium', color: 'text-yellow-400', icon: TrendingUp };
    return { level: 'Low', color: 'text-red-400', icon: AlertTriangle };
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Prediction Confidence</h2>
        <div className="text-sm text-gray-400">
          Lap {currentLap}
        </div>
      </div>

      {/* Confidence Chart */}
      <div className="h-48 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={confidenceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="lap" 
              stroke="#9CA3AF"
              fontSize={12}
            />
            <YAxis 
              stroke="#9CA3AF"
              fontSize={12}
              domain={[0, 1]}
              tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#F3F4F6'
              }}
              labelFormatter={(label) => `Lap ${label}`}
              formatter={(value: number, name: string) => [`${(value * 100).toFixed(1)}%`, name.replace('_confidence', '')]}
            />
            {drivers.map((driver) => (
              <Area
                key={driver.name}
                type="monotone"
                dataKey={driver.key}
                stackId="1"
                stroke={driver.color}
                fill={driver.color}
                fillOpacity={0.3}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Current Confidence Levels */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-white mb-3">Current Confidence Levels</h3>
        {sortedDrivers.map((driver, index) => {
          const confidenceInfo = getConfidenceLevel(driver.confidence);
          const Icon = confidenceInfo.icon;
          
          return (
            <div key={driver.name} className="flex items-center justify-between p-3 bg-gray-900/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-8 h-8 bg-gray-700 rounded-lg">
                  <span className="font-bold text-white text-sm">{index + 1}</span>
                </div>
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: driver.color }}
                />
                <span className="font-medium text-white">{driver.name}</span>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="flex items-center space-x-1">
                    <Icon className={`w-4 h-4 ${confidenceInfo.color}`} />
                    <span className={`text-sm font-medium ${confidenceInfo.color}`}>
                      {confidenceInfo.level}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400">
                    {(driver.confidence * 100).toFixed(1)}%
                  </div>
                </div>
                
                <div className="w-16 bg-gray-700 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${driver.confidence * 100}%`,
                      backgroundColor: driver.color
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Confidence Summary */}
      <div className="mt-6 pt-4 border-t border-gray-700/50">
        <div className="grid grid-cols-3 gap-4 text-center text-sm">
          <div>
            <p className="text-green-400 font-bold">
              {sortedDrivers.filter(d => d.confidence >= 0.8).length}
            </p>
            <p className="text-gray-400">High Confidence</p>
          </div>
          <div>
            <p className="text-yellow-400 font-bold">
              {sortedDrivers.filter(d => d.confidence >= 0.6 && d.confidence < 0.8).length}
            </p>
            <p className="text-gray-400">Medium</p>
          </div>
          <div>
            <p className="text-red-400 font-bold">
              {sortedDrivers.filter(d => d.confidence < 0.6).length}
            </p>
            <p className="text-gray-400">Low</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfidenceStream;