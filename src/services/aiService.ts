import apiClient from '@/lib/api';

export interface JobRecommendation {
  title: string;
  description: string;
  matchScore: number;
}

/**
 * Sends user skills and preferences to the secure backend endpoint 
 * to get AI-powered job recommendations.
 * @param userSkills - An array of the user's skills.
 * @param preferences - An object containing user preferences (e.g., location, job type).
 * @returns A promise that resolves to an array of job recommendations.
 */

export const getAIJobRecommendations = async (
  userSkills: string[], 
  preferences: any
): Promise<JobRecommendation[]> => {
  try {
    const response = await apiClient.post('/ai/recommendations', {
      skills: userSkills,
      preferences: preferences,
    });
    return response.data as JobRecommendation[];
  } catch (error) {
    console.error("Error fetching AI recommendations from backend:", error);
    // Re-throw the error to be handled by the calling hook
    throw new Error('Failed to get recommendations from the server.');
  }
};