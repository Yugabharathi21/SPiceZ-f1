import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, 
  Users, 
  Trophy, 
  Clock, 
  BarChart3, 
  Settings, 
  TrendingUp, 
  TrendingDown
} from 'lucide-react';
import Header from '../components/Header';
import { mockApiService } from '../api/mockApi';

interface TeamImage {
  logo: string;
  car: string;
  drivers: {
    [id: number]: string;
  };
}

interface Team {
  id: number;
  name: string;
  logo: string;
  color: string;
  position: number;
  points: number;
  drivers: Driver[];
  stats: {
    wins: number;
    podiums: number;
    fastestLaps: number;
    polePositions: number;
    dnfs: number;
  };
  performance: {
    qualifyingPace: number;
    racePace: number;
    reliability: number;
    pitStops: number;
    development: number;
  };
  images?: TeamImage;
}

interface Driver {
  id: number;
  code: string;
  name: string;
  points: number;
  position: number;
}

const Teams: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);
  
  // Team colors from F1 official branding - wrapped in useMemo to avoid dependency issues
  const teamColors = React.useMemo(() => ({
    'Red Bull Racing': {
      primary: '#0600EF',
      secondary: '#121F45'
    },
    'Mercedes': {
      primary: '#00D2BE',
      secondary: '#2F4550'
    },
    'Ferrari': {
      primary: '#DC0000',
      secondary: '#500000'
    },
    'McLaren': {
      primary: '#FF8700',
      secondary: '#5E3629'
    },
    'Aston Martin': {
      primary: '#006F62',
      secondary: '#1D3130'
    },
    'Williams': {
      primary: '#005AFF',
      secondary: '#00294F'
    },
    'Alpine': {
      primary: '#0090FF',
      secondary: '#0D3D69'
    },
    'Haas F1 Team': {
      primary: '#FFFFFF',
      secondary: '#241F21'
    },
    'Alfa Romeo': {
      primary: '#900000',
      secondary: '#331919'
    },
    'AlphaTauri': {
      primary: '#2B4562',
      secondary: '#1F2E3D'
    },
    'RB': {
      primary: '#0090FF',
      secondary: '#0D3D69'
    },
    'Kick Sauber': {
      primary: '#52E252',
      secondary: '#1D3130'
    }
  }), []);
  
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const predictions = await mockApiService.getRacePredictions(1050);
        
        // Get all team images from Wikipedia via API
        interface TeamImageItem extends TeamImage {
          name: string;
        }
        
        const teamImagesData: TeamImageItem[] = await mockApiService.getTeamImages("");
        
        // Group by constructor and create teams array
        type ConstructorGroup = {
          drivers: Driver[];
        };
        
        type DriverData = {
          driverId: number;
          driver: {
            code: string;
            forename: string;
            surname: string;
          };
          constructor: {
            name: string;
          };
          predicted_position: number;
        };
        
        const constructorGroups = predictions.reduce((groups: {[key: string]: ConstructorGroup}, driver: DriverData) => {
          const team = driver.constructor.name;
          if (!groups[team]) {
            groups[team] = {
              drivers: []
            };
          }
          
          groups[team].drivers.push({
            id: driver.driverId,
            code: driver.driver.code,
            name: `${driver.driver.forename} ${driver.driver.surname}`,
            points: Math.max(25 - Math.floor(driver.predicted_position), 0),
            position: Math.round(driver.predicted_position)
          });
          
          return groups;
        }, {});
        
        // Transform into teams array with mock data
        const teamsData: Team[] = [];
        
        Object.entries(constructorGroups as Record<string, ConstructorGroup>).forEach(([name, groupData]: [string, ConstructorGroup], index) => {
          const teamId = index + 1;
          const totalPoints = groupData.drivers.reduce((sum: number, driver: Driver) => sum + driver.points, 0);
          
          // Find matching team images from API
          const teamImageData = teamImagesData.find(t => 
            t.name === name || t.name.includes(name) || name.includes(t.name)
          );
          
          teamsData.push({
            id: teamId,
            name,
            logo: teamImageData?.logo || `team-${name.toLowerCase().replace(/\s+/g, '-')}.svg`,
            color: teamColors[name as keyof typeof teamColors]?.primary || '#888',
            position: 0, // Will be calculated after sorting
            points: totalPoints,
            drivers: groupData.drivers,
            stats: {
              wins: Math.floor(Math.random() * 5),
              podiums: Math.floor(Math.random() * 10) + 2,
              fastestLaps: Math.floor(Math.random() * 3),
              polePositions: Math.floor(Math.random() * 4),
              dnfs: Math.floor(Math.random() * 4)
            },
            performance: {
              qualifyingPace: Math.random() * 10,
              racePace: Math.random() * 10,
              reliability: Math.random() * 10,
              pitStops: Math.random() * 10,
              development: Math.random() * 10
            },
            images: teamImageData
          });
        });
        
        // Sort by points and assign positions
        teamsData.sort((a, b) => b.points - a.points);
        teamsData.forEach((team, index) => {
          team.position = index + 1;
        });
        
        setTeams(teamsData);
        
        // Select first team by default
        if (teamsData.length > 0) {
          setSelectedTeam(teamsData[0].id);
        }
      } catch (error) {
        console.error('Error loading teams data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [teamColors]);

  // Get the currently selected team
  const currentTeam = teams.find(team => team.id === selectedTeam);

  // Function to render performance bar with label
  const renderPerformanceBar = (value: number, label: string) => {
    const percentage = Math.round(value * 10);
    return (
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
          <span className="text-sm font-bold">{percentage}/100</span>
        </div>
        <div className="bg-gray-200 dark:bg-f1-gray/30 rounded-full h-2 overflow-hidden">
          <div 
            className="h-full rounded-full" 
            style={{
              width: `${percentage}%`,
              backgroundColor: currentTeam?.color || '#E10600'
            }}
          ></div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      <Header currentRace={null} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="f1-heading-2 flex items-center">
            Teams
            <ChevronRight className="h-6 w-6 mx-1 text-gray-400" />
            <span className="text-f1-red">2024 Season</span>
          </h1>
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
            <span className="text-gray-500 dark:text-gray-400">Loading teams data...</span>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Teams List */}
          <div className="lg:col-span-1">
            <div className="f1-card overflow-hidden">
              <div className="p-4 border-b border-gray-200 dark:border-f1-gray/20">
                <h2 className="font-bold uppercase font-f1">Constructor Standings</h2>
              </div>
              
              <div className="divide-y divide-gray-200 dark:divide-f1-gray/20">
                {teams.map(team => (
                  <button 
                    key={team.id}
                    onClick={() => setSelectedTeam(team.id)}
                    className={`w-full text-left p-4 flex items-center transition-colors ${
                      selectedTeam === team.id 
                        ? 'bg-gray-100 dark:bg-f1-gray/20' 
                        : 'hover:bg-gray-50 dark:hover:bg-f1-gray/10'
                    }`}
                  >
                    <div 
                      className="w-1 self-stretch mr-3" 
                      style={{ backgroundColor: team.color }}
                    ></div>
                    <div className="w-8 text-center font-bold">{team.position}</div>
                    <div className="flex-1 ml-3">
                      <div className="font-medium">{team.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {team.drivers.map(d => d.code).join(' / ')}
                      </div>
                    </div>
                    <div className="font-bold font-f1mono text-f1-red">
                      {team.points}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Team Details */}
          <div className="lg:col-span-3">
            {currentTeam ? (
              <div className="space-y-6">
                {/* Team Header */}
                <div className="f1-card">
                  <div 
                    className="h-32 bg-gradient-to-r relative overflow-hidden" 
                    style={{ 
                      background: `linear-gradient(to right, ${currentTeam.color}, ${
                        teamColors[currentTeam.name as keyof typeof teamColors]?.secondary || 'rgba(0,0,0,0.5)'
                      })` 
                    }}
                  >
                    {currentTeam.images?.car && (
                      <img 
                        src={currentTeam.images.car}
                        alt={`${currentTeam.name} car`}
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 h-28 object-contain"
                      />
                    )}
                  </div>
                  
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                      <div className="flex items-center">
                        {currentTeam.images?.logo && (
                          <img 
                            src={currentTeam.images.logo}
                            alt={`${currentTeam.name} logo`}
                            className="h-12 mr-4 object-contain"
                          />
                        )}
                        <div>
                          <h2 className="f1-heading-3 mb-1">{currentTeam.name}</h2>
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-1">
                              <Trophy className="w-4 h-4 text-yellow-500" />
                              <span className="text-sm">{currentTeam.stats.wins} wins</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <BarChart3 className="w-4 h-4 text-blue-500" />
                              <span className="text-sm">{currentTeam.stats.podiums} podiums</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4 text-green-500" />
                              <span className="text-sm">{currentTeam.stats.fastestLaps} fastest laps</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 md:mt-0 flex items-center bg-gray-100 dark:bg-f1-gray/20 rounded-xl px-5 py-2">
                        <div className="text-center">
                          <div className="text-sm text-gray-500 dark:text-gray-400">POINTS</div>
                          <div className="text-2xl font-bold font-f1mono">{currentTeam.points}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Team Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Drivers */}
                  <div className="f1-card p-6">
                    <h3 className="f1-heading-4 mb-4 flex items-center">
                      <Users className="w-5 h-5 mr-2" />
                      Drivers
                    </h3>
                    
                    <div className="space-y-4">
                      {currentTeam.drivers.map(driver => (
                        <div key={driver.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-f1-dark rounded-lg">
                          <div className="flex items-center">
                            {currentTeam.images?.drivers && currentTeam.images.drivers[driver.id] ? (
                              <div className="w-12 h-12 rounded-full mr-3 overflow-hidden border-2 flex-shrink-0" style={{ borderColor: currentTeam.color }}>
                                <img 
                                  src={currentTeam.images.drivers[driver.id]}
                                  alt={driver.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Driver';
                                  }}
                                />
                              </div>
                            ) : (
                              <div 
                                className="w-12 h-12 rounded-full mr-3 flex items-center justify-center text-white font-bold flex-shrink-0"
                                style={{ backgroundColor: currentTeam.color }}
                              >
                                {driver.code}
                              </div>
                            )}
                            <div>
                              <div className="font-medium">{driver.name}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                P{driver.position} • {driver.points} pts
                              </div>
                            </div>
                          </div>
                          
                          <div className={`text-sm font-medium ${
                            driver.position <= 3 ? 'text-green-500' : 'text-gray-500'
                          }`}>
                            {driver.position <= 3 ? 'TOP PERFORMER' : ''}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Performance Analysis */}
                  <div className="f1-card p-6">
                    <h3 className="f1-heading-4 mb-4 flex items-center">
                      <BarChart3 className="w-5 h-5 mr-2" />
                      Performance Analysis
                    </h3>
                    
                    <div className="mt-4">
                      {renderPerformanceBar(currentTeam.performance.qualifyingPace, 'Qualifying Pace')}
                      {renderPerformanceBar(currentTeam.performance.racePace, 'Race Pace')}
                      {renderPerformanceBar(currentTeam.performance.reliability, 'Reliability')}
                      {renderPerformanceBar(currentTeam.performance.pitStops, 'Pit Stops')}
                      {renderPerformanceBar(currentTeam.performance.development, 'Development Rate')}
                    </div>
                  </div>
                </div>
                
                {/* Team Strengths & Weaknesses */}
                <div className="f1-card p-6">
                  <h3 className="f1-heading-4 mb-4 flex items-center">
                    <Settings className="w-5 h-5 mr-2" />
                    Team Analysis
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Strengths */}
                    <div>
                      <h4 className="text-base font-bold mb-3 flex items-center text-green-500">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        Strengths
                      </h4>
                      
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 mt-1.5 bg-green-500 rounded-full mr-2"></div>
                          <span className="text-sm">
                            {currentTeam.name === 'Red Bull Racing' ? 'Superior aerodynamic efficiency' : 'Strong driver lineup with consistent performance'}
                          </span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 mt-1.5 bg-green-500 rounded-full mr-2"></div>
                          <span className="text-sm">
                            {currentTeam.performance.pitStops > 8 ? 'Excellent pit stop execution and strategy' : 'Good tire management in long stints'}
                          </span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 mt-1.5 bg-green-500 rounded-full mr-2"></div>
                          <span className="text-sm">
                            {currentTeam.position <= 3 ? 'Competitive pace across different circuit types' : 'Strong performance on specific track characteristics'}
                          </span>
                        </li>
                      </ul>
                    </div>
                    
                    {/* Weaknesses */}
                    <div>
                      <h4 className="text-base font-bold mb-3 flex items-center text-red-500">
                        <TrendingDown className="w-4 h-4 mr-1" />
                        Areas for Improvement
                      </h4>
                      
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 mt-1.5 bg-red-500 rounded-full mr-2"></div>
                          <span className="text-sm">
                            {currentTeam.performance.reliability < 7 ? 'Reliability issues affecting race finishes' : 'Inconsistent qualifying performance'}
                          </span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 mt-1.5 bg-red-500 rounded-full mr-2"></div>
                          <span className="text-sm">
                            {currentTeam.performance.racePace < 6 ? 'Lacking straight-line speed on power circuits' : 'Struggles in wet weather conditions'}
                          </span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 mt-1.5 bg-red-500 rounded-full mr-2"></div>
                          <span className="text-sm">
                            {currentTeam.performance.development < 5 ? 'Slow development pace during season' : 'Strategic decision-making under pressure'}
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="f1-card p-6 flex items-center justify-center">
                <p className="text-gray-500 dark:text-gray-400">Select a team to view details</p>
              </div>
            )}
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default Teams;
