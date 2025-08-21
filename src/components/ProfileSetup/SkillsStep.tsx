import React, { useState } from 'react';

interface ProfileData {
  skills: any[];
}

interface SkillsStepProps {
  data: ProfileData;
  extractedSkills: any[];
  onUpdate: (field: keyof ProfileData, value: any) => void;
}

const SkillsStep: React.FC<SkillsStepProps> = ({ data, extractedSkills, onUpdate }) => {
  const [newSkill, setNewSkill] = useState('');
  const [selectedProficiency, setSelectedProficiency] = useState('intermediate');

  const proficiencyLevels = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
    { value: 'expert', label: 'Expert' },
  ];

  const addSkill = () => {
    if (newSkill.trim() && !data.skills.find(skill => skill.name === newSkill.trim())) {
      const skillToAdd = {
        name: newSkill.trim(),
        proficiency: selectedProficiency,
        years: 0
      };
      onUpdate('skills', [...data.skills, skillToAdd]);
      setNewSkill('');
    }
  };

  const removeSkill = (skillName: string) => {
    onUpdate('skills', data.skills.filter(skill => skill.name !== skillName));
  };

  const updateSkillProficiency = (skillName: string, proficiency: string) => {
    onUpdate('skills', data.skills.map(skill => 
      skill.name === skillName ? { ...skill, proficiency } : skill
    ));
  };

  const addExtractedSkill = (skillName: string) => {
    if (!data.skills.find(skill => skill.name === skillName)) {
      const skillToAdd = {
        name: skillName,
        proficiency: 'intermediate',
        years: 0
      };
      onUpdate('skills', [...data.skills, skillToAdd]);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Skills & Expertise</h2>
      
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-blue-900 mb-2">Manage Your Skills</h3>
        <p className="text-sm text-blue-800">
          Add your technical and soft skills. You can set proficiency levels and years of experience for each skill.
        </p>
      </div>

      {/* Add New Skill */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Add New Skill</h3>
        <div className="flex gap-4">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="e.g., React, Python, Project Management"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onKeyPress={(e) => e.key === 'Enter' && addSkill()}
          />
          <select
            value={selectedProficiency}
            onChange={(e) => setSelectedProficiency(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {proficiencyLevels.map((level) => (
              <option key={level.value} value={level.value}>
                {level.label}
              </option>
            ))}
          </select>
          <button
            onClick={addSkill}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add
          </button>
        </div>
      </div>

      {/* Extracted Skills */}
      {extractedSkills.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Skills Found in Resume</h3>
          <div className="flex flex-wrap gap-2">
            {extractedSkills.map((skill, index) => (
              <button
                key={index}
                onClick={() => addExtractedSkill(skill)}
                disabled={data.skills.find(s => s.name === skill)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  data.skills.find(s => s.name === skill)
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-green-100 text-green-800 hover:bg-green-200'
                }`}
              >
                {skill}
                {data.skills.find(s => s.name === skill) && ' ✓'}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Current Skills */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Your Skills ({data.skills.length})</h3>
        {data.skills.length === 0 ? (
          <p className="text-gray-500">No skills added yet. Add some skills above or upload your resume to get started.</p>
        ) : (
          <div className="space-y-3">
            {data.skills.map((skill, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex-1">
                  <span className="font-medium">{skill.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <select
                    value={skill.proficiency}
                    onChange={(e) => updateSkillProficiency(skill.name, e.target.value)}
                    className="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                  >
                    {proficiencyLevels.map((level) => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => removeSkill(skill.name)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Skill Guidelines */}
      <div className="bg-yellow-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-yellow-900 mb-2">Proficiency Guidelines</h3>
        <ul className="text-sm text-yellow-800 space-y-1">
          <li>• <strong>Beginner:</strong> Basic understanding, can work with guidance</li>
          <li>• <strong>Intermediate:</strong> Good understanding, can work independently</li>
          <li>• <strong>Advanced:</strong> Deep understanding, can mentor others</li>
          <li>• <strong>Expert:</strong> Mastery level, industry recognition</li>
        </ul>
      </div>
    </div>
  );
};

export default SkillsStep;
