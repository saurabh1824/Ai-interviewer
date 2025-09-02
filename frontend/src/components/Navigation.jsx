import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Brain } from 'lucide-react';
import AuthModal from './AuthModal';
import UserProfile from './UserProfile';

const Navigation = ({ showAuthButtons = true }) => {
  const location = useLocation();
  const [showAuthModal, setShowAuthModal] = React.useState(false);
  const [user, setUser] = React.useState(null); // null when not logged in

  const isActive = (path) => location.pathname === path;

  const handleLogin = (userData) => {
    setUser(userData);
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleChangePassword = () => {
    // Handle change password logic
    console.log('Change password clicked');
  };

  return (
    <nav className="bg-gray-800 shadow-sm border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-white">AI Interviewer</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-6">
              <Link
                to="/"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/') 
                    ? 'text-blue-400 bg-blue-900' 
                    : 'text-gray-300 hover:text-blue-400 hover:bg-gray-700'
                }`}
              >
                Home
              </Link>
              <button className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-blue-400 hover:bg-gray-700 transition-colors">
                Services
              </button>
              {user && (
                <button className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-blue-400 hover:bg-gray-700 transition-colors">
                  History
                </button>
              )}
            </div>
          </div>

          {showAuthButtons && (
            <div className="flex items-center space-x-4">
              {user ? (
                <UserProfile 
                  user={user} 
                  onLogout={handleLogout}
                  onChangePassword={handleChangePassword}
                />
              ) : (
                <>
                  <button 
                    onClick={() => setShowAuthModal(true)}
                    className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-blue-400 transition-colors"
                  >
                    Sign In
                  </button>
                  <Link
                    to="/interview"
                    className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
      
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        onLogin={handleLogin}
      />
    </nav>
  );
};

export default Navigation;