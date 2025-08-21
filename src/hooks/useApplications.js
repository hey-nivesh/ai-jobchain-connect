import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';

const useApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Fetch user's applications
  const fetchApplications = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/applications/user/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch applications');
      }
      
      const data = await response.json();
      setApplications(data.applications || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Create a new application
  const createApplication = useCallback(async (jobId, applicationData) => {
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/applications/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          job: jobId,
          applicant: user.id,
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
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Update application status (for employers)
  const updateApplicationStatus = useCallback(async (applicationId, status, notes = '') => {
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/applications/${applicationId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${user.token}`,
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
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Withdraw application
  const withdrawApplication = useCallback(async (applicationId) => {
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/applications/${applicationId}/withdraw`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${user.token}`,
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
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Get application by ID
  const getApplicationById = useCallback((applicationId) => {
    return applications.find(app => app.id === applicationId);
  }, [applications]);

  // Get applications by status
  const getApplicationsByStatus = useCallback((status) => {
    if (!status) return applications;
    return applications.filter(app => app.status === status);
  }, [applications]);

  // Get applications by job
  const getApplicationsByJob = useCallback((jobId) => {
    return applications.filter(app => app.job.id === jobId);
  }, [applications]);

  // Check if user has applied to a job
  const hasAppliedToJob = useCallback((jobId) => {
    return applications.some(app => app.job.id === jobId);
  }, [applications]);

  // Get application statistics
  const getApplicationStats = useCallback(() => {
    const stats = {
      total: applications.length,
      pending: 0,
      under_review: 0,
      shortlisted: 0,
      interview_scheduled: 0,
      rejected: 0,
      hired: 0
    };
    
    applications.forEach(app => {
      if (stats.hasOwnProperty(app.status)) {
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
    if (user) {
      fetchApplications();
    }
  }, [user, fetchApplications]);

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
