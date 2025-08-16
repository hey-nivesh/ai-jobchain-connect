import React, { useState } from 'react';
import { 
  Home, 
  Briefcase, 
  User, 
  Settings, 
  PlusCircle, 
  BarChart3,
  Search,
  Bell
} from 'lucide-react';

const Sidebar: React.FC = () => {
  // Mock state for demonstration
  const [userRole, setUserRole] = useState<'jobseeker' | 'employer'>('jobseeker');
  const [currentView, setCurrentView] = useState<string>('dashboard');

  const jobSeekerMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'jobs', label: 'Browse Jobs', icon: Search },
    { id: 'applications', label: 'My Applications', icon: Briefcase },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const employerMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'post-job', label: 'Post Job', icon: PlusCircle },
    { id: 'manage-jobs', label: 'Manage Jobs', icon: Briefcase },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'profile', label: 'Company Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const menuItems = userRole === 'jobseeker' ? jobSeekerMenuItems : employerMenuItems;

  return (
    <div className="w-64 bg-black/20 backdrop-blur-md border-r border-white/10 h-full">
      <div className="p-6">
        <nav className="space-y-2">
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
