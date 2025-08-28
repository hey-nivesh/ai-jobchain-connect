import { useState } from 'react';
import { getAIRecommendations } from '@/services/aiService';
import type { Job } from './useWebSocket'; 
import { ApiJob } from '@/services/jobService';

export const useAIRecommendations = () => {
  const [recommendations, setRecommendations] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = async (skills: string[], preferences: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const matchedApiJobs: ApiJob[] = await getAIRecommendations(skills, preferences);
      // Transform the raw API data into the shape your UI components expect
      const transformedJobs = matchedApiJobs.map(job => transformedJobs(job));
      setRecommendations(transformedJobs);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return { recommendations, isLoading, error, fetchRecommendations };
};