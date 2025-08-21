import { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useAuth } from './useAuth';

interface JobRecommendation {
  title: string;
  description: string;
  matchScore: number;
}

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export const useJobRecommendations = () => {
  const { userRole } = useAuth();
  const [recommendations, setRecommendations] = useState<JobRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getRecommendations = async (userSkills: string[], preferences: any) => {
    if (userRole !== 'jobseeker') return;
    
    setIsLoading(true);
    try {
      // Initialize the model
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      const prompt = `As a job recommendation expert, suggest relevant jobs based on these skills: ${userSkills.join(', ')} 
      and preferences: ${JSON.stringify(preferences)}. 
      Format the response as a JSON array with objects containing: 
      {
        "title": "job title",
        "description": "brief job description",
        "matchScore": number between 0-100
      }`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Parse the JSON response
      try {
        const parsedRecommendations = JSON.parse(text);
        setRecommendations(parsedRecommendations);
      } catch (e) {
        console.error('Error parsing AI response:', e);
        setRecommendations([]);
      }
    } catch (error) {
      console.error('Error getting job recommendations:', error);
      setRecommendations([]);
    } finally {
      setIsLoading(false);
    }
  };

  return { recommendations, isLoading, getRecommendations };
};
