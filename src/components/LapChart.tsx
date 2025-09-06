import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Brush } from 'recharts';

interface LapChartProps {
  data: any[];
  currentLap: number;
}

const LapChart: React.FC<LapChartProps> = ({ data, currentLap }) => {
  // Generate lap time data for visualization
  const lapTimeData = React.useMemo(() => {
    if (!data.length) {
      // Generate mock data for demonstration
      const drivers = [
        { id: 1, name: 'VER', color: '#0600EF' },
        { id: 2, name: 'HAM', color: '#00D2BE' },
        { id: 3, name: 'LEC', color: '#DC143C' },
        { id: 4, name: 'RUS', color: '#00D2BE' },
        { id: 5, name: 'NOR', color: '#FF8700' },
      ];

      return Array.from({ length: Math.min(currentLap, 58) }, (_, lap) => {
        const lapObj: any = { lap: lap + 1 };
        drivers.forEach(driver => {
          const baseTime = 90000 + Math.random() * 5000; // 90-95 seconds
          const variation = (Math.random() - 0.5) * 2000; // ±1 second
          lapObj[driver.name] = Math.round(baseTime + variation);
        });
        return lapObj;
      });
    }
    return data.slice(0, currentLap);
  }, [data, currentLap]);

  const drivers = [
    { name: 'VER', color: '#0600EF' },
    { name: 'HAM', color: '#00D2BE' },
    { name: 'LEC', color: '#DC143C' },
    { name: 'RUS', color: '#6CD3BF' },
    { name: 'NOR', color: '#FF8700' },
  ];

  const formatTime = (milliseconds: number) => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = ((milliseconds % 60000) / 1000).toFixed(3);
    return `${minutes}:${parseFloat(seconds).toFixed(3).padStart(6, '0')}`;
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Lap Times</h2>
        <div className="text-sm text-gray-400">
          Showing lap {currentLap} of {Math.max(...lapTimeData.map(d => d.lap || 0)) || 58}
        </div>
      </div>

      <div className="h-80 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={lapTimeData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="lap" 
              stroke="#9CA3AF"
              fontSize={12}
              label={{ value: 'Lap', position: 'insideBottom', offset: -10, style: { textAnchor: 'middle', fill: '#9CA3AF' } }}
            />
            <YAxis 
              stroke="#9CA3AF"
              fontSize={12}
              domain={['dataMin - 1000', 'dataMax + 1000']}
              tickFormatter={(value) => `${(value / 1000).toFixed(1)}s`}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#F3F4F6'
              }}
              labelFormatter={(label) => `Lap ${label}`}
              formatter={(value: number, name: string) => [formatTime(value), name]}
            />
            <Legend />
            {drivers.map((driver) => (
              <Line
                key={driver.name}
                type="monotone"
                dataKey={driver.name}
                stroke={driver.color}
                strokeWidth={3}
                dot={{ fill: driver.color, strokeWidth: 2, r: 3 }}
                activeDot={{ r: 5, fill: driver.color }}
                connectNulls={false}
              />
            ))}
            <Brush 
              dataKey="lap" 
              height={30} 
              stroke="#DC2626"
              fill="#1F2937"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Driver Legend with Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {drivers.map((driver) => {
          const lastLapTime = lapTimeData[lapTimeData.length - 1]?.[driver.name];
          const bestLap = Math.min(...lapTimeData.map(d => d[driver.name] || Infinity).filter(t => t !== Infinity));
          
          return (
            <div key={driver.name} className="bg-gray-900/50 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: driver.color }}
                />
                <span className="font-bold text-white text-sm">{driver.name}</span>
              </div>
              <div className="text-xs text-gray-400 space-y-1">
                <div>Last: {lastLapTime ? formatTime(lastLapTime) : 'N/A'}</div>
                <div>Best: {bestLap !== Infinity ? formatTime(bestLap) : 'N/A'}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LapChart;