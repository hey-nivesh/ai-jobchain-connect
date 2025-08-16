import React, { useState } from 'react';
import { AuthProvider } from '../../hooks/useAuth';
import ProfileWizard from './ProfileWizard';

const TestProfileSetup: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    // Simulate login with a test user
    const testUser = {
      id: 'test-user-123',
      email: 'test@example.com',
      name: 'Test User'
    };
    
    localStorage.setItem('user', JSON.stringify(testUser));
    localStorage.setItem('userId', testUser.id);
    localStorage.setItem('authToken', 'test-token-123');
    
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Profile Setup Test
            </h1>
            
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Authentication Status</h2>
              
              {!isAuthenticated ? (
                <div className="space-y-4">
                  <p className="text-gray-600">
                    Click the button below to simulate a user login and test the profile setup.
                  </p>
                  <button
                    onClick={handleLogin}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Simulate Login
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-green-600 font-medium">Authenticated</span>
                  </div>
                  <p className="text-gray-600">
                    User ID: <code className="bg-gray-100 px-2 py-1 rounded">test-user-123</code>
                  </p>
                  <button
                    onClick={handleLogout}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Profile Setup Component */}
          <ProfileWizard />
        </div>
      </div>
    </AuthProvider>
  );
};

export default TestProfileSetup;
