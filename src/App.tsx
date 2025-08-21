import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import Index from "./pages/Index";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import JobSeekerDashboard from "./components/dashboard/JobSeekerDashboard";
import EmployerDashboard from "./components/dashboard/EmployerDashboard";
import DemoApplicationsPage from "./components/applications/DemoApplicationsPage";
import ProfileWizard from "./components/ProfileSetup/ProfileWizard";
import JobListingsPage from "./components/jobs/JobListingsPage";
import { AppProvider, useApp } from "./context/AppContext";
import { AuthProvider, useAuth, login as authLogin, signup as authSignup } from "./hooks/useAuth";
import apiClient from "@/lib/api";

const queryClient = new QueryClient();

// Wrapper to handle dashboard role-based rendering
const DashboardWrapper: React.FC = () => {
  const { userRole, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Please log in to access your dashboard</h1>
        <a href="/login" className="text-blue-500 hover:underline">Go to Login</a>
      </div>
    </div>;
  }
  
  if (userRole === "jobseeker") return <JobSeekerDashboard />;
  if (userRole === "employer") return <EmployerDashboard />;
  return <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-4">Please log in to access your dashboard</h1>
      <a href="/login" className="text-blue-500 hover:underline">Go to Login</a>
    </div>
  </div>;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppProvider>
          <ThemeProvider defaultTheme="light" storageKey="jobmatch-theme">
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<LoginWithRole />} />
                  <Route path="/signup" element={<SignupWithRole />} />
                  <Route path="/dashboard" element={<DashboardWrapper />} />
                  <Route path="/employer" element={<EmployerDashboard />} />
                  <Route path="/jobs" element={<JobListingsPage />} />
                  <Route path="/applications" element={<DemoApplicationsPage />} />
                  <Route path="/profile-setup" element={<ProfileWizard />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </ThemeProvider>
        </AppProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

// HOC for Login to set userRole in context
const LoginWithRole: React.FC = () => {
  const { login: setAuthUser, setUserRole } = useAuth();
  const navigate = useNavigate();
  
  const handleLogin = async (email: string, password: string) => {
    try {
      const userData = await authLogin(email, password);
      setAuthUser(userData);
      setUserRole(userData.userType === 'employer' ? 'employer' : 'jobseeker');
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };
  
  return <Login setUserRole={setUserRole} navigate={navigate} onLogin={handleLogin} />;
};

// HOC for Signup to set userRole in context
const SignupWithRole: React.FC = () => {
  const { login: setAuthUser, setUserRole } = useAuth();
  const navigate = useNavigate();
  
  const handleSignup = async (email: string, password: string, userType: 'jobseeker' | 'employer') => {
    try {
      const userData = await authSignup(email, password, userType);
      setAuthUser(userData);
      setUserRole(userType);
      // sync role to backend immediately
      try {
        await apiClient.post('/set-role', { role: userType === 'employer' ? 'EMPLOYER' : 'JOB_SEEKER' });
      } catch (e) {
        console.warn('Failed to sync role to backend on signup');
      }
      navigate('/dashboard');
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };
  
  return <Signup setUserRole={setUserRole} navigate={navigate} onSignup={handleSignup} />;
};

export default App;
