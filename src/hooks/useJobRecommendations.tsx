import { useState } from 'react';
import { useAuth } from './useAuth';
import { aiService } from '../services/aiService';
import { JobRecommendation } from '../types/recommendation';

export const useJobRecommendations = () => {
  const { userRole } = useAuth();
  const [recommendations, setRecommendations] = useState<JobRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getRecommendations = async (userSkills: string[], preferences: any) => {
    if (userRole !== 'jobseeker') return;
    
    setIsLoading(true);
    setError(null); // Clear previous errors
    
    try {
      const result = await aiService.getJobRecommendations({
        ...preferences,
        skills: userSkills
      });
      setRecommendations(result);
    } catch (err: any) {
      console.error('Error getting job recommendations:', err);
      setError(err.message || 'An unexpected error occurred.');
      setRecommendations([]);
    } finally {
      setIsLoading(false);
    }
  };

  return { recommendations, isLoading, error, getRecommendations };
};
