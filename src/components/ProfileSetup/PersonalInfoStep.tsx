import React from 'react';

interface ProfileData {
  first_name: string;
  last_name: string;
  title: string;
  bio: string;
  phone: string;
  portfolio_url: string;
  linkedin_url: string;
  github_url: string;
}

interface PersonalInfoStepProps {
  data: ProfileData;
  onUpdate: (field: keyof ProfileData, value: any) => void;
}

const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({ data, onUpdate }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Personal Information</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            First Name *
          </label>
          <input
            type="text"
            value={data.first_name}
            onChange={(e) => onUpdate('first_name', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Last Name *
          </label>
          <input
            type="text"
            value={data.last_name}
            onChange={(e) => onUpdate('last_name', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Professional Title *
        </label>
        <input
          type="text"
          value={data.title}
          onChange={(e) => onUpdate('title', e.target.value)}
          placeholder="e.g., Frontend Developer, Data Scientist"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Bio
        </label>
        <textarea
          value={data.bio}
          onChange={(e) => onUpdate('bio', e.target.value)}
          rows={4}
          placeholder="Tell us about yourself, your experience, and what you're looking for..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Phone Number
        </label>
        <input
          type="tel"
          value={data.phone}
          onChange={(e) => onUpdate('phone', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Professional Links</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Portfolio URL
          </label>
          <input
            type="url"
            value={data.portfolio_url}
            onChange={(e) => onUpdate('portfolio_url', e.target.value)}
            placeholder="https://your-portfolio.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            LinkedIn URL
          </label>
          <input
            type="url"
            value={data.linkedin_url}
            onChange={(e) => onUpdate('linkedin_url', e.target.value)}
            placeholder="https://linkedin.com/in/your-profile"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            GitHub URL
          </label>
          <input
            type="url"
            value={data.github_url}
            onChange={(e) => onUpdate('github_url', e.target.value)}
            placeholder="https://github.com/your-username"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoStep;
