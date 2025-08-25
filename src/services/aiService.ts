import apiClient from '@/lib/api';
import { UserPreferences, JobRecommendation } from '@/types/recommendation';
import { ApiJob } from './jobService';

export const aiService = {
  getJobRecommendations: async (
    preferences: UserPreferences
  ): Promise<JobRecommendation[]> => {
    try {
      const response = await apiClient.post('/ai/recommendations', {
        preferences: {
          // Explicit preferences
          skills: preferences.skills,
          experienceLevel: preferences.experience_level,
          totalExperienceYears: preferences.total_experience_years,
          currentLocation: preferences.currentLocation,
          desiredJobType: preferences.desiredJobType,
          salaryRange: preferences.salary_range,
          remoteWork: preferences.remote_work,
          benefits: preferences.benefits,
          industry: preferences.industry,
          searchTerm: preferences.search_term,

          // Implicit preferences
          viewedJobs: preferences.viewed_jobs || [],
          savedJobs: preferences.saved_jobs || [],
          appliedJobs: preferences.applied_jobs || [],
        }
      });
      return response.data as JobRecommendation[];
    } catch (error) {
      console.error("Error fetching AI recommendations:", error);
      throw new Error('Failed to get recommendations');
    }
  },

  trackJobInteraction: async (
    userId: string,
    jobId: string,
    interactionType: 'view' | 'save' | 'apply'
  ) => {
    try {
      await apiClient.post('/ai/track-interaction', {
        userId,
        jobId,
        interactionType,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error tracking job interaction:", error);
      // Don't throw error for tracking - fail silently
    }
  }
};

/**
 * Sends user skills and preferences to the secure backend endpoint 
 * to get AI-powered job recommendations.
 * @param skills - An array of the user's skills.
 * @param preferences - An object containing user filter preferences.
 * @returns A promise that resolves to an array of matched ApiJob objects.
 */
export const getAIRecommendations = async (
  skills: string[], 
  preferences: any 
): Promise<ApiJob[]> => {
  try {
    // This calls your Django endpoint: POST /api/ai/recommendations/
    const response = await apiClient.post('/ai/recommendations/', {
      skills,
      preferences,
    });
    return response.data as ApiJob[];
  } catch (error) {
    console.error("Error fetching AI recommendations from backend:", error);
    throw new Error('Failed to get AI recommendations.');
  }
};