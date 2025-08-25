import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { useProfileData } from './useProfileData';
import { aiService } from '@/services/aiService';
import { UserPreferences, JobRecommendation } from '@/types/recommendation';
import { useWebSocket } from './useWebSocket';

interface JobFilters {
  search?: string;
  jobType?: string;
  salaryRange?: [number, number];
  remoteWork?: boolean;
  benefits?: string[];
  industry?: string;
}

export const useJobRecommendations = (filters: JobFilters) => {
  const [recommendations, setRecommendations] = useState<JobRecommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { userId } = useAuth();
  const { profileData } = useProfileData(userId || '');
  const { socket } = useWebSocket(userId ? parseInt(userId) : 1);

  // Track job interactions
  const trackInteraction = useCallback(async (
    jobId: string, 
    type: 'view' | 'save' | 'apply'
  ) => {
    if (!userId) return;
    await aiService.trackJobInteraction(userId, jobId, type);
  }, [userId]);

  // Get recommendations based on all available data
  const getRecommendations = useCallback(async () => {
    if (!userId || !profileData) return;

    setLoading(true);
    setError(null);

    try {
      const preferences: UserPreferences = {
        // Base profile data
        skills: profileData.skills || [],
        experience_level: profileData.experience_level || 'Entry',
        total_experience_years: profileData.total_experience_years || 0,
        location: profileData.current_location || '',

        // Active search preferences from filters
        search_term: filters.search || '',
        job_type: filters.jobType || 'Full-time',
        salary_range: filters.salaryRange || [0, 1000000],
        remote_work: filters.remoteWork || false,
        benefits: filters.benefits || [],
        industry: filters.industry || '',

        // Interaction history is tracked on the backend
        viewed_jobs: [],
        saved_jobs: [],
        applied_jobs: [],
        desiredJobType: undefined,
        currentLocation: undefined
      };

      const newRecommendations = await aiService.getJobRecommendations(preferences);
      setRecommendations(newRecommendations);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch recommendations');
    } finally {
      setLoading(false);
    }
  }, [userId, profileData, filters]);
  
  function updateRecommendations(
    prev: JobRecommendation[],
    newJob: JobRecommendation
  ): JobRecommendation[] {
    const exists = prev.some(job => job.id === newJob.id);
    if (!exists) {
      return [newJob, ...prev].slice(0, 20);
    }
    return prev;
  }

  function handleNewJobRecommendation(
    event: MessageEvent,
    setRecommendations: React.Dispatch<React.SetStateAction<JobRecommendation[]>>
  ) {
    try {
      const data = JSON.parse(event.data);
      if (data.type === 'new-job-recommendation' && data.job) {
        const newJob: JobRecommendation = data.job;
        setRecommendations(prev => updateRecommendations(prev, newJob));
      }
    } catch (e) {
      console.error('Error handling new job recommendation:', e);
    }
  }

  // Listen for real-time job recommendations
  useEffect(() => {
    if (!socket) return;

    const listener = (event: MessageEvent) => handleNewJobRecommendation(event, setRecommendations);

    socket.addEventListener('message', listener);

    return () => {
      socket.removeEventListener('message', listener);
    };
  }, [socket, setRecommendations]);

  // Fetch recommendations when filters or profile changes
  useEffect(() => {
    getRecommendations();
  }, [getRecommendations]);

  return {
    recommendations,
    loading,
    error,
    trackInteraction,
    refreshRecommendations: getRecommendations
  };
};
