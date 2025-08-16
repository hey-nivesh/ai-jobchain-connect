import React from 'react';
import { Star, User, LogOut } from 'lucide-react';

// Mock user data for demonstration
const userRole = 'jobseeker'; // or 'employer'
const user = { name: userRole === 'jobseeker' ? 'Alex Johnson' : 'Acme Corp' };

const Header: React.FC = () => {
  const handleLogout = () => {
    // Implement logout logic here
    alert('Logged out!');
  };

  return (
    <header className="bg-black/20 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 p-2 rounded-lg">
              <Star className="w-6 h-6 text-black" />
            </div>
            <h1 className="ml-3 text-xl font-bold text-white">
              JobPortal Pro
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-black" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">
                  {user.name}
                </p>
                <p className="text-xs text-gray-400 capitalize">
                  {userRole}
                </p>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-3 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors text-gray-300 hover:text-white"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
