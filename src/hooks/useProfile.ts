import { useState } from 'react';

export interface Profile {
  resume: File | null;
  skills: string[];
  description: string;
}

export const useProfile = () => {
  const [profile, setProfile] = useState<Profile>({
    resume: null,
    skills: ['React', 'TypeScript', 'Node.js'],
    description: ''
  });

  const addSkill = (skill: string) => {
    if (skill.trim() && !profile.skills.includes(skill.trim())) {
      setProfile(prev => ({
        ...prev,
        skills: [...prev.skills, skill.trim()]
      }));
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const updateDescription = (description: string) => {
    setProfile(prev => ({
      ...prev,
      description
    }));
  };

  const updateResume = (file: File | null) => {
    setProfile(prev => ({
      ...prev,
      resume: file
    }));
  };

  const saveProfile = () => {
    // Here you would typically save to localStorage or send to API
    localStorage.setItem('user-profile', JSON.stringify({
      skills: profile.skills,
      description: profile.description
    }));
  };

  return {
    profile,
    addSkill,
    removeSkill,
    updateDescription,
    updateResume,
    saveProfile
  };
}; 