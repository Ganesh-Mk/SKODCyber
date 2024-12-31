import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Lock } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path) => {
    if (path === '/' && currentPath === '/') return true;
    if (path !== '/' && currentPath.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="bg-gradient-to-r from-purple-50 to-blue-50 fixed w-full top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-3">
              <div className="relative">
                <Shield className="h-8 w-8 text-indigo-500" />
                <Lock className="h-4 w-4 text-purple-500 absolute -bottom-1 -right-1" />
              </div>
              <span className="text-xl font-bold relative">
                <span className="text-indigo-600">SKOD</span>
                <span className="text-purple-600">Cyber</span>
              </span>
            </Link>
          </div>

          {/* Centered Navigation Links */}
          <div className="flex-1 flex justify-center">
            <div className="flex items-center space-x-8">
              <Link 
                to="/" 
                className={`relative group px-3 py-2 ${isActive('/') ? 'text-indigo-600' : ''}`}
              >
                <span className={`font-medium relative z-10 transition-colors duration-200 ${
                  isActive('/') ? 'text-indigo-600' : 'text-gray-700 group-hover:text-gray-900'
                }`}>
                  Home
                </span>
                <div className={`absolute inset-0 h-full w-full bg-indigo-100 rounded-lg transition-transform duration-200 -z-0 ${
                  isActive('/') ? 'scale-100' : 'scale-0 group-hover:scale-100'
                }`}></div>
              </Link>
              <Link 
                to="/learn" 
                className={`relative group px-3 py-2 ${isActive('/learn') ? 'text-indigo-600' : ''}`}
              >
                <span className={`font-medium relative z-10 transition-colors duration-200 ${
                  isActive('/learn') ? 'text-indigo-600' : 'text-gray-700 group-hover:text-gray-900'
                }`}>
                  Learn
                </span>
                <div className={`absolute inset-0 h-full w-full bg-indigo-100 rounded-lg transition-transform duration-200 -z-0 ${
                  isActive('/learn') ? 'scale-100' : 'scale-0 group-hover:scale-100'
                }`}></div>
              </Link>
              <Link 
                to="/news" 
                className={`relative group px-3 py-2 ${isActive('/news') ? 'text-indigo-600' : ''}`}
              >
                <span className={`font-medium relative z-10 transition-colors duration-200 ${
                  isActive('/news') ? 'text-indigo-600' : 'text-gray-700 group-hover:text-gray-900'
                }`}>
                  News
                </span>
                <div className={`absolute inset-0 h-full w-full bg-indigo-100 rounded-lg transition-transform duration-200 -z-0 ${
                  isActive('/news') ? 'scale-100' : 'scale-0 group-hover:scale-100'
                }`}></div>
              </Link>
            </div>
          </div>

          {/* Account Button */}
          <div className="flex-shrink-0">
            <Link 
              to="/account" 
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:shadow-indigo-200 hover:-translate-y-0.5 ${
                isActive('/account')
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
              }`}
            >
              Account
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;