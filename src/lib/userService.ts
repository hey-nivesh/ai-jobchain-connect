import apiClient from './api';

interface ProfileData {
  first_name: string;
  last_name: string;
  title: string;
  bio: string;
  phone: string;
  experience_level: string;
  total_experience_years: number;
  current_location: string;
  preferred_locations: string[];
  willing_to_relocate: boolean;
  expected_salary_min: string;
  expected_salary_max: string;
  availability: string;
  skills: any[];
  resume: File | null;
  portfolio_url: string;
  linkedin_url: string;
  github_url: string;
}

interface SkillData {
  skill: number;
  proficiency_level: string;
  years_of_experience: number;
  is_verified: boolean;
}

export const userService = {
  // Get user profile
  getProfile: async (userId: string): Promise<ProfileData> => {
    try {
      const response = await apiClient.get(`/users/${userId}/profile/`);
      return response.data as ProfileData;
    } catch (error: any) {
      throw new Error(error.response?.data || error.message);
    }
  },

  // Create/Update Job Seeker Profile
  updateJobSeekerProfile: async (profileData: ProfileData) => {
    try {
      const response = await apiClient.put('/users/job-seeker-profile/', profileData);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  // Upload resume with file processing
  uploadResume: async (file: File, userId: string) => {
    const formData = new FormData();
    formData.append('resume', file);
    formData.append('user_id', userId);

    try {
      const response = await apiClient.post('/users/upload-resume/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent: any) => {
          const progress = (progressEvent.loaded / progressEvent.total) * 100;
          console.log(`Upload Progress: ${progress}%`);
        },
      } as any);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  // Get extracted skills from resume
  getExtractedSkills: async (userId: string) => {
    try {
      const response = await apiClient.get(`/users/${userId}/extracted-skills/`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  // Update user skills with proficiency levels
  updateUserSkills: async (skillsData: SkillData[]) => {
    try {
      const response = await apiClient.post('/users/skills/', skillsData);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },
};
