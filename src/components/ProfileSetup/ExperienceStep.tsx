import React from 'react';

interface ProfileData {
  experience_level: string;
  total_experience_years: number;
}

interface ExperienceStepProps {
  data: ProfileData;
  onUpdate: (field: keyof ProfileData, value: any) => void;
}

const ExperienceStep: React.FC<ExperienceStepProps> = ({ data, onUpdate }) => {
  const experienceLevels = [
    { value: 'entry', label: 'Entry Level (0-2 years)' },
    { value: 'mid', label: 'Mid Level (3-5 years)' },
    { value: 'senior', label: 'Senior Level (6-10 years)' },
    { value: 'expert', label: 'Expert Level (10+ years)' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Experience Information</h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Experience Level *
        </label>
        <select
          value={data.experience_level}
          onChange={(e) => onUpdate('experience_level', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        >
          <option value="">Select your experience level</option>
          {experienceLevels.map((level) => (
            <option key={level.value} value={level.value}>
              {level.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Total Years of Experience *
        </label>
        <input
          type="number"
          min="0"
          max="50"
          value={data.total_experience_years}
          onChange={(e) => onUpdate('total_experience_years', parseInt(e.target.value) || 0)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="e.g., 3"
          required
        />
        <p className="text-sm text-gray-500 mt-1">
          Include all relevant professional experience
        </p>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-blue-900 mb-2">Experience Guidelines</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• <strong>Entry Level:</strong> 0-2 years of professional experience</li>
          <li>• <strong>Mid Level:</strong> 3-5 years of professional experience</li>
          <li>• <strong>Senior Level:</strong> 6-10 years of professional experience</li>
          <li>• <strong>Expert Level:</strong> 10+ years of professional experience</li>
        </ul>
      </div>
    </div>
  );
};

export default ExperienceStep;
