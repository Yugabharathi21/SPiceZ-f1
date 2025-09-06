import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Trophy, TrendingUp, Flag, Calendar } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { mockApiService } from '../api/mockApi';

const DriverProfile: React.FC = () => {
  const { driverId } = useParams<{ driverId: string }>();
  const [driver, setDriver] = useState<any>(null);
  const [performance, setPerformance] = useState<any[]>([]);
  const [shapData, setShapData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDriverData = async () => {
      if (driverId) {
        try {
          const [driverData, performanceData, explanations] = await Promise.all([
            mockApiService.getDriver(parseInt(driverId)),
            mockApiService.getDriverPerformance(parseInt(driverId)),
            mockApiService.getDriverExplanations(parseInt(driverId)),
          ]);
          
          setDriver(driverData);
          setPerformance(performanceData);
          setShapData(explanations);
        } catch (error) {
          console.error('Error loading driver data:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadDriverData();
  }, [driverId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-white font-bold">Loading driver profile...</span>
        </div>
      </div>
    );
  }

  if (!driver) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Driver not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Link 
        to="/race-overview" 
        className="inline-flex items-center space-x-2 text-gray-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Race Overview</span>
      </Link>

      {/* Driver Header */}
      <div className="bg-gradient-to-r from-red-900/20 to-black border border-red-600/20 rounded-2xl p-8 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center space-x-6">
            {/* Driver Avatar */}
            <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center text-3xl font-bold text-white">
              {driver.code}
            </div>
            
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                {driver.forename} {driver.surname}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-gray-300">
                <div className="flex items-center gap-2">
                  <Flag className="w-5 h-5 text-red-600" />
                  <span>{driver.nationality}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-red-600" />
                  <span>{driver.dob}</span>
                </div>
                <div className="bg-gray-800 px-3 py-1 rounded-full text-sm">
                  #{driver.number}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 lg:mt-0 grid grid-cols-3 gap-4">
            <div className="bg-gray-800/50 rounded-xl p-4 text-center">
              <Trophy className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{driver.wins || 0}</p>
              <p className="text-xs text-gray-400">Wins</p>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-4 text-center">
              <TrendingUp className="w-6 h-6 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{driver.podiums || 0}</p>
              <p className="text-xs text-gray-400">Podiums</p>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-4 text-center">
              <Flag className="w-6 h-6 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{driver.points || 0}</p>
              <p className="text-xs text-gray-400">Points</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Performance Chart */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-white mb-6">Recent Performance</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="race" 
                  stroke="#9CA3AF"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  fontSize={12}
                  domain={[1, 20]}
                  reversed
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F3F4F6'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="position" 
                  stroke="#DC2626" 
                  strokeWidth={3}
                  dot={{ fill: '#DC2626', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#EF4444' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 text-sm text-gray-400">
            <p>Lower positions are better • Last 10 races</p>
          </div>
        </div>

        {/* SHAP Explanations */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-white mb-6">Prediction Factors</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={shapData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  type="number" 
                  stroke="#9CA3AF"
                  fontSize={12}
                />
                <YAxis 
                  type="category"
                  dataKey="feature" 
                  stroke="#9CA3AF"
                  fontSize={10}
                  width={80}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F3F4F6'
                  }}
                />
                <Bar 
                  dataKey="contribution" 
                  fill={(entry: any) => entry.contribution > 0 ? '#10B981' : '#EF4444'}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span className="text-gray-400">Positive Impact</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded"></div>
                <span className="text-gray-400">Negative Impact</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Season Stats</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Championship Position</span>
              <span className="text-white font-bold">{driver.championshipPosition || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Avg Finish</span>
              <span className="text-white font-bold">{driver.avgFinish || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">DNFs</span>
              <span className="text-white font-bold">{driver.dnfs || 0}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Qualifying</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Avg Grid Position</span>
              <span className="text-white font-bold">{driver.avgGrid || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Q3 Appearances</span>
              <span className="text-white font-bold">{driver.q3Count || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Pole Positions</span>
              <span className="text-white font-bold">{driver.poles || 0}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Race Pace</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Avg Lap Time</span>
              <span className="text-white font-bold">{driver.avgLapTime || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Fastest Laps</span>
              <span className="text-white font-bold">{driver.fastestLaps || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Consistency</span>
              <span className="text-white font-bold">{driver.consistency || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverProfile;