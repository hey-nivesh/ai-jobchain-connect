import { useState } from 'react';
import { useAuth } from './useAuth';
import { getAIJobRecommendations } from '@/services/aiservice';

export interface JobRecommendation {
  title: string;
  description: string;
  matchScore: number;
}

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
      const result = await getAIJobRecommendations(userSkills, preferences);
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
