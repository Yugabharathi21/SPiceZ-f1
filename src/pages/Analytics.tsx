import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Sigma, 
  LineChart, 
  Layers, 
  Filter, 
  ChevronRight,
  BarChart,
  PieChart,
  TrendingUp
} from 'lucide-react';
import { 
  LineChart as RechartsLineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from 'recharts';
import { mockApiService } from '../api/mockApi';

const Analytics: React.FC = () => {
  const [selectedSeason, setSelectedSeason] = useState<string>('2024');
  const [selectedAnalysis, setSelectedAnalysis] = useState<string>('driver-performance');
  const [isLoading, setIsLoading] = useState(true);
  const [driverData, setDriverData] = useState<any[]>([]);
  const [constructorData, setConstructorData] = useState<any[]>([]);
  
  const analysisOptions = [
    { id: 'driver-performance', label: 'Driver Performance', icon: LineChart },
    { id: 'constructor-comparison', label: 'Constructor Comparison', icon: BarChart },
    { id: 'prediction-accuracy', label: 'Prediction Accuracy', icon: PieChart },
    { id: 'season-trends', label: 'Season Trends', icon: TrendingUp },
  ];

  const seasons = ['2024', '2023', '2022', '2021', '2020'];
  
  // Sample colors for constructors
  const constructorColors = {
    'Red Bull Racing': '#0600EF',
    'Mercedes': '#00D2BE',
    'Ferrari': '#DC0000',
    'McLaren': '#FF8700',
    'Aston Martin': '#006F62',
    'Williams': '#005AFF',
    'Alpine': '#0090FF',
    'Haas F1 Team': '#FFFFFF',
    'Alfa Romeo': '#900000',
    'AlphaTauri': '#2B4562'
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Load driver data
        const predictions = await mockApiService.getRacePredictions(1050);
        setDriverData(predictions);
        
        // Create constructor data from predictions
        const constructors = predictions.reduce((acc: any, curr: any) => {
          const constructor = curr.constructor.name;
          if (!acc[constructor]) {
            acc[constructor] = {
              name: constructor,
              points: 0,
              drivers: 0,
              avgPosition: 0
            };
          }
          
          acc[constructor].drivers += 1;
          acc[constructor].points += Math.max(25 - Math.floor(curr.predicted_position), 0);
          acc[constructor].avgPosition += curr.predicted_position;
          
          return acc;
        }, {});
        
        // Calculate averages and convert to array
        const constructorArray = Object.values(constructors).map((c: any) => ({
          ...c,
          avgPosition: parseFloat((c.avgPosition / c.drivers).toFixed(2))
        })).sort((a: any, b: any) => b.points - a.points);
        
        setConstructorData(constructorArray);
      } catch (error) {
        console.error('Error loading analytics data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [selectedSeason]);

  // Sample prediction accuracy data
  const predictionAccuracyData = [
    { name: 'Correct', value: 68 },
    { name: 'Within 1 Position', value: 17 },
    { name: 'Within 2 Positions', value: 10 },
    { name: 'Off by 3+', value: 5 },
  ];
  
  // Sample season trends data
  const seasonTrendsData = [
    { race: 'Bahrain', avg_overtakes: 32, red_flags: 0, safety_cars: 1 },
    { race: 'Saudi Arabia', avg_overtakes: 28, red_flags: 0, safety_cars: 2 },
    { race: 'Australia', avg_overtakes: 45, red_flags: 1, safety_cars: 2 },
    { race: 'Japan', avg_overtakes: 22, red_flags: 0, safety_cars: 0 },
    { race: 'China', avg_overtakes: 38, red_flags: 0, safety_cars: 2 },
    { race: 'Miami', avg_overtakes: 35, red_flags: 0, safety_cars: 1 },
    { race: 'Imola', avg_overtakes: 18, red_flags: 0, safety_cars: 0 },
    { race: 'Monaco', avg_overtakes: 12, red_flags: 1, safety_cars: 2 },
  ];
  
  // Colors for pie chart
  const COLORS = ['#00C49F', '#FFBB28', '#FF8042', '#FF0000'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="f1-heading-2 flex items-center">
          Analytics
          <ChevronRight className="h-6 w-6 mx-1 text-gray-400" />
          <span className="text-f1-red">{selectedSeason} Season</span>
        </h1>
        
        <div className="flex space-x-3">
          <select
            value={selectedSeason}
            onChange={(e) => setSelectedSeason(e.target.value)}
            className="bg-gray-100 dark:bg-f1-gray/30 rounded-lg p-2 border-none focus:outline-none focus:ring-2 focus:ring-f1-red"
          >
            {seasons.map((season) => (
              <option key={season} value={season}>Season {season}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Analysis Type Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {analysisOptions.map((option) => {
          const Icon = option.icon;
          return (
            <button
              key={option.id}
              onClick={() => setSelectedAnalysis(option.id)}
              className={`flex items-center justify-center flex-col p-4 rounded-xl transition-all ${
                selectedAnalysis === option.id 
                ? 'bg-f1-red text-white shadow-lg' 
                : 'bg-white dark:bg-f1-dark hover:bg-gray-100 dark:hover:bg-f1-gray/20 border border-gray-200 dark:border-f1-gray/20'
              }`}
            >
              <Icon className="w-6 h-6 mb-2" />
              <span className="text-sm font-medium">{option.label}</span>
            </button>
          );
        })}
      </div>

      {isLoading ? (
        <div className="f1-card p-12 flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="w-8 h-8 border-4 border-f1-red border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-4 h-4 bg-f1-red rounded-full"></div>
              </div>
            </div>
            <span className="text-gray-500 dark:text-gray-400">Loading analytics data...</span>
          </div>
        </div>
      ) : (
        <>
          {selectedAnalysis === 'driver-performance' && (
            <div className="space-y-6">
              {/* Driver Performance Chart */}
              <div className="f1-card p-6">
                <h2 className="f1-heading-3 mb-4">Driver Performance Analysis</h2>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart
                      data={driverData}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" horizontal={false} />
                      <XAxis type="number" domain={[1, 10]} />
                      <YAxis 
                        type="category" 
                        dataKey="driver.code" 
                        tick={{ fill: '#F3F4F6' }} 
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: '#1F2937',
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#F3F4F6'
                        }}
                        formatter={(value: number) => [`Position: ${value.toFixed(1)}`, 'Predicted']}
                        labelFormatter={(label) => `Driver: ${label}`}
                      />
                      <Bar 
                        dataKey="predicted_position" 
                        fill="#E10600"
                        radius={[0, 4, 4, 0]} 
                      />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex items-center justify-between mt-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-2">
                    <div className="h-3 w-3 bg-f1-red rounded"></div>
                    <span>Predicted Position</span>
                  </div>
                  <span>Lower is better</span>
                </div>
              </div>
              
              {/* Driver Confidence Scores */}
              <div className="f1-card p-6">
                <h2 className="f1-heading-3 mb-4">Prediction Confidence by Driver</h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={driverData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="driver.code" tick={{ fill: '#F3F4F6' }} />
                      <YAxis domain={[0, 1]} tickFormatter={(tick) => `${(tick * 100).toFixed(0)}%`} />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: '#1F2937',
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#F3F4F6'
                        }}
                        formatter={(value: number) => [`${(value * 100).toFixed(1)}%`, 'Confidence']}
                      />
                      <Bar 
                        dataKey="confidence" 
                        fill={(entry) => {
                          if (entry.confidence > 0.8) return '#10B981';
                          if (entry.confidence > 0.6) return '#F59E0B';
                          return '#EF4444';
                        }}
                        radius={[4, 4, 0, 0]} 
                      />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex items-center justify-center gap-6 mt-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="h-3 w-3 bg-green-500 rounded"></div>
                    <span className="text-gray-500 dark:text-gray-400">High Confidence</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="h-3 w-3 bg-yellow-500 rounded"></div>
                    <span className="text-gray-500 dark:text-gray-400">Medium Confidence</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="h-3 w-3 bg-red-500 rounded"></div>
                    <span className="text-gray-500 dark:text-gray-400">Low Confidence</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedAnalysis === 'constructor-comparison' && (
            <div className="space-y-6">
              {/* Constructor Points */}
              <div className="f1-card p-6">
                <h2 className="f1-heading-3 mb-4">Constructor Championship Points</h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart
                      data={constructorData}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" horizontal={false} />
                      <XAxis type="number" />
                      <YAxis 
                        type="category" 
                        dataKey="name" 
                        tick={{ fill: '#F3F4F6' }} 
                        width={110}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: '#1F2937',
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#F3F4F6'
                        }}
                        formatter={(value: number) => [`${value} points`, 'Predicted']}
                      />
                      <Bar 
                        dataKey="points" 
                        radius={[0, 4, 4, 0]} 
                        fill={(entry) => constructorColors[entry.name as keyof typeof constructorColors] || '#888'}
                      />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              {/* Constructor Average Position */}
              <div className="f1-card p-6">
                <h2 className="f1-heading-3 mb-4">Average Driver Position by Constructor</h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={constructorData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="name" tick={{ fill: '#F3F4F6' }} />
                      <YAxis domain={[0, 15]} reversed />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: '#1F2937',
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#F3F4F6'
                        }}
                        formatter={(value: number) => [`P${value.toFixed(1)}`, 'Avg Position']}
                      />
                      <Bar 
                        dataKey="avgPosition" 
                        radius={[4, 4, 0, 0]} 
                        fill={(entry) => constructorColors[entry.name as keyof typeof constructorColors] || '#888'}
                      />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
                <div className="text-center mt-4 text-sm text-gray-500 dark:text-gray-400">
                  <span>Lower position is better (P1 is the highest)</span>
                </div>
              </div>
            </div>
          )}
          
          {selectedAnalysis === 'prediction-accuracy' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Prediction Accuracy Chart */}
              <div className="f1-card p-6">
                <h2 className="f1-heading-3 mb-4">Model Prediction Accuracy</h2>
                <div className="h-80 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={predictionAccuracyData}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={120}
                        paddingAngle={3}
                        dataKey="value"
                        label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {predictionAccuracyData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: '#1F2937',
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#F3F4F6'
                        }}
                        formatter={(value: number) => [`${value}%`, 'Predictions']}
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap justify-center gap-6 mt-4 text-sm">
                  {predictionAccuracyData.map((entry, index) => (
                    <div key={`legend-${index}`} className="flex items-center space-x-2">
                      <div 
                        className="h-3 w-3 rounded" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }} 
                      />
                      <span className="text-gray-500 dark:text-gray-400">{entry.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Prediction Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 content-start">
                <div className="f1-card p-6">
                  <h3 className="f1-heading-4 mb-3">Prediction Accuracy</h3>
                  <div className="flex items-end justify-between">
                    <div className="text-4xl font-bold font-f1mono text-f1-red">85%</div>
                    <div className="text-sm text-green-500 flex items-center">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      +2.3% vs last race
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Percentage of predictions within 2 positions
                  </p>
                </div>
                
                <div className="f1-card p-6">
                  <h3 className="f1-heading-4 mb-3">Model Confidence</h3>
                  <div className="flex items-end justify-between">
                    <div className="text-4xl font-bold font-f1mono text-f1-red">72%</div>
                    <div className="text-sm text-green-500 flex items-center">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      +1.5% vs last race
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Average confidence score across predictions
                  </p>
                </div>
                
                <div className="f1-card p-6 sm:col-span-2">
                  <h3 className="f1-heading-4 mb-3">Accuracy Breakdown</h3>
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    {['Qualifying', 'Race Pace', 'Strategy'].map((category, i) => (
                      <div key={category} className="text-center">
                        <div className="font-medium mb-1">{category}</div>
                        <div className="text-2xl font-bold font-f1mono text-f1-red">
                          {90 - i * 7}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {selectedAnalysis === 'season-trends' && (
            <div className="space-y-6">
              {/* Season Trends Chart */}
              <div className="f1-card p-6">
                <h2 className="f1-heading-3 mb-4">Season Progression Analysis</h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart data={seasonTrendsData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="race" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" domain={[0, 5]} />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: '#1F2937',
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#F3F4F6'
                        }}
                      />
                      <Line 
                        yAxisId="left"
                        type="monotone" 
                        dataKey="avg_overtakes" 
                        stroke="#E10600" 
                        strokeWidth={3}
                        dot={{ stroke: '#E10600', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, fill: '#FF1801' }}
                      />
                      <Line 
                        yAxisId="right"
                        type="monotone" 
                        dataKey="safety_cars" 
                        stroke="#FFBA08" 
                        strokeWidth={2}
                        dot={{ stroke: '#FFBA08', strokeWidth: 2, r: 4 }}
                      />
                      <Line 
                        yAxisId="right"
                        type="monotone" 
                        dataKey="red_flags" 
                        stroke="#3DD2CC" 
                        strokeWidth={2}
                        dot={{ stroke: '#3DD2CC', strokeWidth: 2, r: 4 }}
                      />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex items-center justify-center gap-6 mt-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="h-3 w-3 bg-f1-red rounded"></div>
                    <span className="text-gray-500 dark:text-gray-400">Overtakes</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="h-3 w-3 bg-yellow-500 rounded"></div>
                    <span className="text-gray-500 dark:text-gray-400">Safety Cars</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="h-3 w-3 bg-f1-accent rounded"></div>
                    <span className="text-gray-500 dark:text-gray-400">Red Flags</span>
                  </div>
                </div>
              </div>
              
              {/* Season Highlights Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="f1-card p-6">
                  <h3 className="f1-heading-4 mb-3">Most Exciting Race</h3>
                  <div className="text-2xl font-bold text-f1-red mb-2">Australian GP</div>
                  <div className="space-y-2 mt-4">
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Overtakes</span>
                      <span className="font-bold">45</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Lead Changes</span>
                      <span className="font-bold">8</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Safety Cars</span>
                      <span className="font-bold">2</span>
                    </div>
                  </div>
                </div>
                
                <div className="f1-card p-6">
                  <h3 className="f1-heading-4 mb-3">Most Predictable Race</h3>
                  <div className="text-2xl font-bold text-f1-red mb-2">Monaco GP</div>
                  <div className="space-y-2 mt-4">
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Prediction Accuracy</span>
                      <span className="font-bold">94%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Position Changes</span>
                      <span className="font-bold">3</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Overtakes</span>
                      <span className="font-bold">12</span>
                    </div>
                  </div>
                </div>
                
                <div className="f1-card p-6">
                  <h3 className="f1-heading-4 mb-3">Most Strategic Race</h3>
                  <div className="text-2xl font-bold text-f1-red mb-2">Miami GP</div>
                  <div className="space-y-2 mt-4">
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Different Strategies</span>
                      <span className="font-bold">7</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Pit Stop Delta</span>
                      <span className="font-bold">18.4s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Tire Sets Used</span>
                      <span className="font-bold">45</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Analytics;
