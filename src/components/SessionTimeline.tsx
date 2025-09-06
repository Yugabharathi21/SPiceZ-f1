import React from 'react';
import { Clock, Flag, Zap } from 'lucide-react';

interface SessionTimelineProps {
  race: any;
  predictions: any[];
}

const SessionTimeline: React.FC<SessionTimelineProps> = ({ race, predictions }) => {
  const sessions = [
    {
      id: 'fp1',
      name: 'Practice 1',
      time: race?.fp1_time || '10:30',
      date: race?.fp1_date || race?.date,
      status: 'completed',
      icon: Clock,
    },
    {
      id: 'fp2',
      name: 'Practice 2',
      time: race?.fp2_time || '14:00',
      date: race?.fp2_date || race?.date,
      status: 'completed',
      icon: Clock,
    },
    {
      id: 'fp3',
      name: 'Practice 3',
      time: race?.fp3_time || '11:00',
      date: race?.fp3_date || race?.date,
      status: 'completed',
      icon: Clock,
    },
    {
      id: 'qualifying',
      name: 'Qualifying',
      time: race?.quali_time || '14:00',
      date: race?.quali_date || race?.date,
      status: 'completed',
      icon: Zap,
    },
    {
      id: 'race',
      name: 'Grand Prix',
      time: race?.time || '15:00',
      date: race?.date,
      status: 'upcoming',
      icon: Flag,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'live':
        return 'bg-red-500 animate-pulse';
      case 'upcoming':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusBorder = (status: string) => {
    switch (status) {
      case 'completed':
        return 'border-green-500/30 bg-green-500/10';
      case 'live':
        return 'border-red-500/50 bg-red-500/20';
      case 'upcoming':
        return 'border-gray-500/30 bg-gray-500/10';
      default:
        return 'border-gray-500/30 bg-gray-500/10';
    }
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
      <h2 className="f1-heading-3 text-white mb-6">Weekend Timeline</h2>
      
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gray-600"></div>
        
        <div className="space-y-6">
          {sessions.map((session, index) => {
            const Icon = session.icon;
            return (
              <div key={session.id} className="relative flex items-start space-x-4">
                {/* Timeline dot */}
                <div className={`relative z-10 w-12 h-12 rounded-full border-2 ${getStatusBorder(session.status)} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${session.status === 'completed' ? 'text-green-400' : session.status === 'live' ? 'text-red-400' : 'text-gray-400'}`} />
                </div>

                {/* Session info */}
                <div className="flex-1 min-w-0 pb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold font-f1 text-white uppercase">{session.name}</h3>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(session.status)}`}></div>
                      <span className="text-sm text-gray-400 capitalize">{session.status}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-400 mb-3">
                    {session.date} • {session.time}
                  </p>

                  {/* Session-specific content */}
                  {session.id === 'qualifying' && (
                    <div className="bg-gray-900/50 rounded-lg p-4">
                      <h4 className="font-medium font-f1 text-white mb-3 uppercase">Qualifying Results</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {predictions.slice(0, 3).map((driver, i) => (
                          <div key={i} className="flex items-center space-x-2">
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? 'bg-yellow-500 text-black' : i === 1 ? 'bg-gray-400 text-black' : 'bg-orange-600 text-white'}`}>
                              {i + 1}
                            </span>
                            <span className="text-sm text-gray-300 truncate">
                              {driver.driver?.code}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {session.id === 'race' && (
                    <div className="bg-gradient-to-r from-red-900/20 to-transparent border border-red-600/20 rounded-lg p-4">
                      <h4 className="font-medium font-f1 text-white mb-2 uppercase">Race Predictions</h4>
                      <p className="text-sm text-gray-400">
                        {predictions.length} driver predictions loaded
                      </p>
                      <div className="mt-2 flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-xs text-gray-400">High Confidence</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                          <span className="text-xs text-gray-400">Medium</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <span className="text-xs text-gray-400">Low</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SessionTimeline;