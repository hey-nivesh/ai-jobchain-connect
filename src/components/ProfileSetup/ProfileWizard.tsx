import React, { useState, useEffect } from 'react';
import { userService } from '../../lib/userService';
import { useProfileData } from '../../hooks/useProfileData';
import { useAuth } from '../../hooks/useAuth';
import PersonalInfoStep from './PersonalInfoStep';
import ExperienceStep from './ExperienceStep';
import ResumeUploadStep from './ResumeUploadStep';
import SkillsStep from './SkillsStep';
import PreferencesStep from './PreferencesStep';

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

const ProfileWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [extractedSkills, setExtractedSkills] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [apiError, setApiError] = useState<string | null>(null);

  // Get user ID from auth context
  const { userId, isAuthenticated } = useAuth();

  // Use the profile data hook for real-time sync
  const { profileData, loading, error, updateProfile, validateProfile, saveProgress } = useProfileData(userId || '');

  // Auto-save progress when data changes
  useEffect(() => {
    if (profileData && !loading && userId) {
      const timeoutId = setTimeout(() => {
        saveProgress().catch((error) => {
          console.error('Auto-save failed:', error);
          setApiError('Failed to auto-save progress');
        });
      }, 2000); // Auto-save after 2 seconds of inactivity

      return () => clearTimeout(timeoutId);
    }
  }, [profileData, saveProgress, loading, userId]);

  // Handle form data updates with validation
  const updateProfileData = async (field: keyof ProfileData, value: any) => {
    try {
      setApiError(null);
      await updateProfile({ [field]: value });
      
      // Clear validation errors for this field
      setValidationErrors(prev => prev.filter(error => !error.includes(field)));
    } catch (error) {
      console.error('Failed to update profile:', error);
      setApiError('Failed to update profile data');
    }
  };

  // Handle resume upload and skill extraction
  const handleResumeUpload = async (file: File) => {
    if (!userId) {
      setApiError('User not authenticated');
      return;
    }

    try {
      setIsSubmitting(true);
      setApiError(null);
      
      // Upload resume
      const uploadResult = await userService.uploadResume(file, userId);
      
      // Get extracted skills
      const skills = await userService.getExtractedSkills(userId);
      setExtractedSkills(skills);
      
      await updateProfileData('resume', file);
      
    } catch (error) {
      console.error('Resume upload failed:', error);
      setApiError('Failed to upload resume. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Validate current step before proceeding
  const validateCurrentStep = (): boolean => {
    const { isValid, errors } = validateProfile();
    
    if (!isValid) {
      setValidationErrors(errors);
      return false;
    }
    
    setValidationErrors([]);
    return true;
  };

  // Handle next step with validation
  const handleNextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => prev + 1);
    }
  };

  // Submit complete profile
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setApiError(null);
      
      const { isValid, errors } = validateProfile();
      if (!isValid) {
        setValidationErrors(errors);
        return;
      }
      
      const result = await userService.updateJobSeekerProfile(profileData!);
      
      // Redirect to dashboard or next step
      window.location.href = '/dashboard';
      
    } catch (error) {
      console.error('Profile update failed:', error);
      setApiError('Failed to complete profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show authentication required state
  if (!isAuthenticated || !userId) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="text-yellow-800 font-medium">Authentication Required</h3>
          <p className="text-yellow-600 text-sm mt-1">Please log in to access your profile setup.</p>
          <button 
            onClick={() => window.location.href = '/login'}
            className="mt-3 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Show loading state
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Loading your profile...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-medium">Error Loading Profile</h3>
          <p className="text-red-600 text-sm mt-1">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold">Complete Your Profile</h1>
          <div className="text-sm text-gray-600">Step {currentStep} of 5</div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${(currentStep / 5) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* API Error Display */}
      {apiError && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-medium mb-2">Error</h3>
          <p className="text-red-600 text-sm">{apiError}</p>
          <button 
            onClick={() => setApiError(null)}
            className="mt-2 text-red-600 hover:text-red-800 underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-medium mb-2">Please fix the following errors:</h3>
          <ul className="text-red-600 text-sm space-y-1">
            {validationErrors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}

      {profileData && (
        <>
          {currentStep === 1 && (
            <PersonalInfoStep 
              data={profileData}
              onUpdate={updateProfileData}
            />
          )}
          
          {currentStep === 2 && (
            <ExperienceStep 
              data={profileData}
              onUpdate={updateProfileData}
            />
          )}
          
          {currentStep === 3 && (
            <ResumeUploadStep 
              data={profileData}
              onUpload={handleResumeUpload}
              extractedSkills={extractedSkills}
              isUploading={isSubmitting}
            />
          )}
          
          {currentStep === 4 && (
            <SkillsStep 
              data={profileData}
              extractedSkills={extractedSkills}
              onUpdate={updateProfileData}
            />
          )}
          
          {currentStep === 5 && (
            <PreferencesStep 
              data={profileData}
              onUpdate={updateProfileData}
            />
          )}
        </>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <button
          onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
          disabled={currentStep === 1}
          className="px-6 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
        >
          Previous
        </button>
        
        {currentStep < 5 ? (
          <button
            onClick={handleNextStep}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Complete Profile'}
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfileWizard;
