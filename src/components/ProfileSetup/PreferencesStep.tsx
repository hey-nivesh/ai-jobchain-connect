import React, { useState } from 'react';

interface ProfileData {
  current_location: string;
  preferred_locations: string[];
  willing_to_relocate: boolean;
  expected_salary_min: string;
  expected_salary_max: string;
  availability: string;
}

interface PreferencesStepProps {
  data: ProfileData;
  onUpdate: (field: keyof ProfileData, value: any) => void;
}

const PreferencesStep: React.FC<PreferencesStepProps> = ({ data, onUpdate }) => {
  const [newLocation, setNewLocation] = useState('');

  const availabilityOptions = [
    { value: 'immediate', label: 'Immediately' },
    { value: '2_weeks', label: 'Within 2 weeks' },
    { value: '1_month', label: 'Within 1 month' },
    { value: '3_months', label: 'Within 3 months' },
  ];

  const addLocation = () => {
    if (newLocation.trim() && !data.preferred_locations.includes(newLocation.trim())) {
      onUpdate('preferred_locations', [...data.preferred_locations, newLocation.trim()]);
      setNewLocation('');
    }
  };

  const removeLocation = (location: string) => {
    onUpdate('preferred_locations', data.preferred_locations.filter(loc => loc !== location));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Job Preferences</h2>
      
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-blue-900 mb-2">Set Your Preferences</h3>
        <p className="text-sm text-blue-800">
          Tell us about your location preferences, salary expectations, and availability to help us find the best matches for you.
        </p>
      </div>

      {/* Location Preferences */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Location Preferences</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current Location *
          </label>
          <input
            type="text"
            value={data.current_location}
            onChange={(e) => onUpdate('current_location', e.target.value)}
            placeholder="e.g., New York, NY"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preferred Work Locations
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newLocation}
              onChange={(e) => setNewLocation(e.target.value)}
              placeholder="e.g., Remote, San Francisco, Austin"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyPress={(e) => e.key === 'Enter' && addLocation()}
            />
            <button
              onClick={addLocation}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add
            </button>
          </div>
          
          {data.preferred_locations.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {data.preferred_locations.map((location, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {location}
                  <button
                    onClick={() => removeLocation(location)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="willing_to_relocate"
            checked={data.willing_to_relocate}
            onChange={(e) => onUpdate('willing_to_relocate', e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="willing_to_relocate" className="ml-2 text-sm text-gray-700">
            I am willing to relocate for the right opportunity
          </label>
        </div>
      </div>

      {/* Salary Expectations */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Salary Expectations</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum Expected Salary
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500">$</span>
              <input
                type="number"
                value={data.expected_salary_min}
                onChange={(e) => onUpdate('expected_salary_min', e.target.value)}
                placeholder="50000"
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Maximum Expected Salary
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500">$</span>
              <input
                type="number"
                value={data.expected_salary_max}
                onChange={(e) => onUpdate('expected_salary_max', e.target.value)}
                placeholder="80000"
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
        
        <p className="text-sm text-gray-500">
          Leave blank if you prefer not to specify or want to discuss during interviews.
        </p>
      </div>

      {/* Availability */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Availability</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            When can you start? *
          </label>
          <select
            value={data.availability}
            onChange={(e) => onUpdate('availability', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Select your availability</option>
            {availabilityOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-green-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-green-900 mb-2">Profile Setup Complete!</h3>
        <p className="text-sm text-green-800">
          You're almost done! Review your information and click "Complete Profile" to finish setting up your account.
        </p>
      </div>
    </div>
  );
};

export default PreferencesStep;
