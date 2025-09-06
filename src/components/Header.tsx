import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Trophy, Activity, User, Flag } from 'lucide-react';

interface HeaderProps {
  currentRace: any;
}

const Header: React.FC<HeaderProps> = ({ currentRace }) => {
  const location = useLocation();

  const navigationItems = [
    { path: '/race-overview', label: 'Race Overview', icon: Trophy },
    { path: '/live', label: 'Live Mode', icon: Activity },
    { path: '/driver/1', label: 'Drivers', icon: User },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-b border-red-600/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Flag className="w-8 h-8 text-red-600" />
            <div>
              <h1 className="text-xl font-bold text-white">F1 ANALYTICS</h1>
              <p className="text-xs text-gray-400 uppercase tracking-wider">Predictive Platform</p>
            </div>
          </div>

          {/* Current Race Info */}
          {currentRace && (
            <div className="hidden md:block text-center">
              <p className="text-sm font-bold text-white">{currentRace.name}</p>
              <p className="text-xs text-gray-400">{currentRace.date} • {currentRace.location}</p>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex space-x-1">
            {navigationItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  location.pathname === path
                    ? 'bg-red-600 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline text-sm font-medium">{label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;