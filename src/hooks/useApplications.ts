import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';

export interface Application {
  id: string;
  job: {
    id: string;
    title: string;
    company: string;
    location: string;
    salary: string;
    type: string;
    description: string;
    requirements: string[];
    benefits: string[];
  };
  status: 'pending' | 'under_review' | 'shortlisted' | 'interview_scheduled' | 'rejected' | 'hired';
  overallMatchScore: number;
  skillMatchScore: number;
  experienceMatchScore: number;
  locationMatchScore: number;
  appliedAt: string;
  coverLetter?: string;
  customResume?: string;
  employerNotes?: string;
  updatedAt: string;
}

export interface ApplicationData {
  coverLetter: string;
  resume?: string;
  expectedSalary?: string;
  portfolio?: string;
}

export interface ApplicationStats {
  total: number;
  pending: number;
  under_review: number;
  shortlisted: number;
  interview_scheduled: number;
  rejected: number;
  hired: number;
  active: number;
}

const useApplications = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { userId } = useAuth();

  // Fetch user's applications
  const fetchApplications = useCallback(async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/applications/user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch applications');
      }
      
      const data = await response.json();
      setApplications(data.applications || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      console.error('Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Create a new application
  const createApplication = useCallback(async (jobId: string, applicationData: ApplicationData): Promise<Application> => {
    if (!userId) {
      throw new Error('User not authenticated');
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/applications/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          job: jobId,
          applicant: userId,
          cover_letter: applicationData.coverLetter,
          custom_resume: applicationData.resume,
          expected_salary: applicationData.expectedSalary,
          portfolio_url: applicationData.portfolio
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit application');
      }
      
      const newApplication = await response.json();
      setApplications(prev => [...prev, newApplication]);
      
      return newApplication;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Update application status (for employers)
  const updateApplicationStatus = useCallback(async (
    applicationId: string, 
    status: Application['status'], 
    notes: string = ''
  ): Promise<Application> => {
    if (!userId) {
      throw new Error('User not authenticated');
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/applications/${applicationId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status,
          employer_notes: notes
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update application status');
      }
      
      const updatedApplication = await response.json();
      setApplications(prev => 
        prev.map(app => 
          app.id === applicationId ? updatedApplication : app
        )
      );
      
      return updatedApplication;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Withdraw application
  const withdrawApplication = useCallback(async (applicationId: string): Promise<boolean> => {
    if (!userId) {
      throw new Error('User not authenticated');
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/applications/${applicationId}/withdraw`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to withdraw application');
      }
      
      // Remove the application from the list
      setApplications(prev => 
        prev.filter(app => app.id !== applicationId)
      );
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Get application by ID
  const getApplicationById = useCallback((applicationId: string): Application | undefined => {
    return applications.find(app => app.id === applicationId);
  }, [applications]);

  // Get applications by status
  const getApplicationsByStatus = useCallback((status?: Application['status']): Application[] => {
    if (!status) return applications;
    return applications.filter(app => app.status === status);
  }, [applications]);

  // Get applications by job
  const getApplicationsByJob = useCallback((jobId: string): Application[] => {
    return applications.filter(app => app.job.id === jobId);
  }, [applications]);

  // Check if user has applied to a job
  const hasAppliedToJob = useCallback((jobId: string): boolean => {
    return applications.some(app => app.job.id === jobId);
  }, [applications]);

  // Get application statistics
  const getApplicationStats = useCallback((): ApplicationStats => {
    const stats: ApplicationStats = {
      total: applications.length,
      pending: 0,
      under_review: 0,
      shortlisted: 0,
      interview_scheduled: 0,
      rejected: 0,
      hired: 0,
      active: 0
    };
    
    applications.forEach(app => {
      if (Object.prototype.hasOwnProperty.call(stats, app.status)) {
        stats[app.status]++;
      }
    });
    
    stats.active = stats.pending + stats.under_review + stats.shortlisted + stats.interview_scheduled;
    
    return stats;
  }, [applications]);

  // Refresh applications
  const refreshApplications = useCallback(() => {
    fetchApplications();
  }, [fetchApplications]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Initialize applications on mount
  useEffect(() => {
    if (userId) {
      fetchApplications();
    }
  }, [userId, fetchApplications]);

  return {
    // State
    applications,
    loading,
    error,
    
    // Actions
    fetchApplications,
    createApplication,
    updateApplicationStatus,
    withdrawApplication,
    refreshApplications,
    clearError,
    
    // Queries
    getApplicationById,
    getApplicationsByStatus,
    getApplicationsByJob,
    hasAppliedToJob,
    getApplicationStats
  };
};

export default useApplications;
