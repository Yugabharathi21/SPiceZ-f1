import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Trophy, Activity, User, Flag, Moon, Sun, Menu, X, BarChart3, Settings, Layout, Users } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface HeaderProps {
  currentRace: any;
}

const Header: React.FC<HeaderProps> = ({ currentRace }) => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { path: '/race-overview', label: 'Race Overview', icon: Trophy },
    { path: '/live', label: 'Live Mode', icon: Activity },
    { path: '/driver/1', label: 'Drivers', icon: User },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/teams', label: 'Teams', icon: Users },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/90 dark:bg-f1-black/95 backdrop-blur-md border-b border-gray-200 dark:border-f1-gray/20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="bg-f1-red p-1.5 rounded-md">
              <Flag className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold font-f1 text-f1-black dark:text-white flex items-center uppercase">
                SPiceZ
                <span className="text-f1-red ml-1">F1</span>
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-medium font-body">Analytics Platform</p>
            </div>
          </div>

          {/* Current Race Info (Desktop) */}
          {currentRace && (
            <div className="hidden lg:block text-center">
              <div className="flex items-center space-x-2">
                <span className="h-2 w-2 bg-f1-red rounded-full animate-pulse"></span>
                <p className="text-sm font-bold text-f1-black dark:text-white">{currentRace.name}</p>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">{currentRace.date} • {currentRace.location}</p>
            </div>
          )}

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                  location.pathname === path
                    ? 'bg-f1-red text-white'
                    : 'text-f1-black dark:text-gray-300 hover:text-f1-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-f1-gray/20'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{label}</span>
              </Link>
            ))}
            
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="ml-2 p-2 rounded-lg text-f1-black dark:text-white hover:bg-gray-100 dark:hover:bg-f1-gray/20"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Settings */}
            <Link
              to="/settings"
              className="p-2 rounded-lg text-f1-black dark:text-white hover:bg-gray-100 dark:hover:bg-f1-gray/20"
            >
              <Settings className="w-5 h-5" />
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-2 md:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-f1-black dark:text-white hover:bg-gray-100 dark:hover:bg-f1-gray/20"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-f1-black dark:text-white hover:bg-gray-100 dark:hover:bg-f1-gray/20"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <nav className="md:hidden bg-white dark:bg-f1-dark border-t border-gray-200 dark:border-f1-gray/20 animate-slide-in-bottom">
          <div className="px-4 py-3">
            {/* Current Race Info (Mobile) */}
            {currentRace && (
              <div className="mb-3 pb-3 border-b border-gray-200 dark:border-f1-gray/20">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="h-2 w-2 bg-f1-red rounded-full animate-pulse"></span>
                  <p className="text-sm font-bold text-f1-black dark:text-white">{currentRace.name}</p>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{currentRace.date} • {currentRace.location}</p>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-2">
              {navigationItems.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                    location.pathname === path
                      ? 'bg-f1-red text-white'
                      : 'text-f1-black dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-f1-gray/20'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{label}</span>
                </Link>
              ))}
              <Link
                to="/layouts"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center space-x-3 p-3 rounded-lg text-f1-black dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-f1-gray/20"
              >
                <Layout className="w-5 h-5" />
                <span className="text-sm font-medium">Layouts</span>
              </Link>
              <Link
                to="/settings"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center space-x-3 p-3 rounded-lg text-f1-black dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-f1-gray/20"
              >
                <Settings className="w-5 h-5" />
                <span className="text-sm font-medium">Settings</span>
              </Link>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;