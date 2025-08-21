import { useState, useEffect } from 'react';
import { userService } from '../lib/userService';

interface ProfileData {
  // Personal Info
  first_name: string;
  last_name: string;
  title: string;
  bio: string;
  phone: string;
  
  // Experience
  experience_level: string;
  total_experience_years: number;
  
  // Location
  current_location: string;
  preferred_locations: string[];
  willing_to_relocate: boolean;
  
  // Salary
  expected_salary_min: string;
  expected_salary_max: string;
  availability: string;
  
  // Skills
  skills: any[];
  
  // Documents
  resume: File | null;
  portfolio_url: string;
  linkedin_url: string;
  github_url: string;
}

interface UseProfileDataReturn {
  profileData: ProfileData | null;
  loading: boolean;
  error: string | null;
  updateProfile: (updates: Partial<ProfileData>) => Promise<ProfileData>;
  validateProfile: () => { isValid: boolean; errors: string[] };
  saveProgress: () => Promise<void>;
}

export const useProfileData = (userId: string): UseProfileDataReturn => {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await userService.getProfile(userId);
        setProfileData(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch profile data');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  const updateProfile = async (updates: Partial<ProfileData>): Promise<ProfileData> => {
    try {
      setError(null);
      const updatedData = await userService.updateJobSeekerProfile({
        ...profileData,
        ...updates
      } as ProfileData);
      setProfileData(prev => ({ ...prev, ...updatedData } as ProfileData));
      return updatedData;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to update profile';
      setError(errorMessage);
      throw err;
    }
  };

  const validateProfile = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!profileData) {
      return { isValid: false, errors: ['Profile data not loaded'] };
    }

    // Personal Info Validation
    if (!profileData.first_name?.trim()) {
      errors.push('First name is required');
    }
    if (!profileData.last_name?.trim()) {
      errors.push('Last name is required');
    }
    if (!profileData.title?.trim()) {
      errors.push('Professional title is required');
    }
    if (profileData.bio && profileData.bio.length > 500) {
      errors.push('Bio must be less than 500 characters');
    }

    // Experience Validation
    if (!profileData.experience_level) {
      errors.push('Experience level is required');
    }
    if (profileData.total_experience_years < 0) {
      errors.push('Total experience years cannot be negative');
    }

    // Location Validation
    if (!profileData.current_location?.trim()) {
      errors.push('Current location is required');
    }

    // Salary Validation
    if (profileData.expected_salary_min && profileData.expected_salary_max) {
      const min = parseFloat(profileData.expected_salary_min);
      const max = parseFloat(profileData.expected_salary_max);
      if (min > max) {
        errors.push('Minimum salary cannot be greater than maximum salary');
      }
    }

    // Availability Validation
    if (!profileData.availability) {
      errors.push('Availability is required');
    }

    // URL Validation
    const urlFields = ['portfolio_url', 'linkedin_url', 'github_url'];
    urlFields.forEach(field => {
      const url = profileData[field as keyof ProfileData] as string;
      if (url && !isValidUrl(url)) {
        errors.push(`${field.replace('_', ' ')} must be a valid URL`);
      }
    });

    return { isValid: errors.length === 0, errors };
  };

  const saveProgress = async (): Promise<void> => {
    if (!profileData) return;

    try {
      setError(null);
      await userService.updateJobSeekerProfile(profileData);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to save progress';
      setError(errorMessage);
      throw err;
    }
  };

  // Helper function to validate URLs
  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  return {
    profileData,
    loading,
    error,
    updateProfile,
    validateProfile,
    saveProgress
  };
};
