import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LogOut, Key, ChevronDown } from 'lucide-react';

const UserProfile = ({ user, onLogout, onChangePassword }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    setIsOpen(false);
    onLogout();
  };

  const handleChangePassword = () => {
    setIsOpen(false);
    onChangePassword();
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors"
      >
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
          <User className="h-4 w-4 text-white" />
        </div>
        <span className="text-sm font-medium text-gray-300 hidden md:block">
          {user.email}
        </span>
        <ChevronDown className="h-4 w-4 text-gray-400" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-full mt-2 w-64 bg-gray-800 rounded-xl shadow-lg border border-gray-700 py-2 z-20"
            >
              <div className="px-4 py-3 border-b border-gray-700">
                <p className="text-sm font-medium text-white">Signed in as</p>
                <p className="text-sm text-gray-300 truncate">{user.email}</p>
              </div>
              
              <div className="py-1">
                <button
                  onClick={handleChangePassword}
                  className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors"
                >
                  <Key className="h-4 w-4" />
                  <span>Change Password</span>
                </button>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-red-400 hover:bg-red-900 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserProfile;