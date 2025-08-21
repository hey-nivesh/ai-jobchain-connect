import React, { useState } from 'react';

interface ProfileData {
  resume: File | null;
}

interface ResumeUploadStepProps {
  data: ProfileData;
  onUpload: (file: File) => void;
  extractedSkills: any[];
  isUploading: boolean;
}

const ResumeUploadStep: React.FC<ResumeUploadStepProps> = ({ 
  data, 
  onUpload, 
  extractedSkills, 
  isUploading 
}) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf' || file.type.includes('document')) {
        onUpload(file);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUpload(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Upload Your Resume</h2>
      
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-blue-900 mb-2">Why upload your resume?</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• We'll automatically extract your skills and experience</li>
          <li>• Get better job matches based on your background</li>
          <li>• Save time by not manually entering all your information</li>
        </ul>
      </div>

      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {data.resume ? (
          <div className="space-y-4">
            <div className="text-green-600">
              <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p className="font-medium">Resume uploaded successfully!</p>
              <p className="text-sm">{data.resume.name}</p>
            </div>
            <button
              onClick={() => document.getElementById('resume-upload')?.click()}
              className="text-blue-600 hover:text-blue-700 underline"
            >
              Upload different file
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <div>
              <p className="text-lg font-medium text-gray-700">
                {isUploading ? 'Uploading...' : 'Drop your resume here'}
              </p>
              <p className="text-sm text-gray-500">
                or click to browse files
              </p>
            </div>
            <button
              onClick={() => document.getElementById('resume-upload')?.click()}
              disabled={isUploading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isUploading ? 'Uploading...' : 'Choose File'}
            </button>
          </div>
        )}
        
        <input
          id="resume-upload"
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isUploading}
        />
      </div>

      {isUploading && (
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-sm text-gray-600">Processing your resume...</p>
        </div>
      )}

      {extractedSkills.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Skills Found in Your Resume</h3>
          <div className="flex flex-wrap gap-2">
            {extractedSkills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
          <p className="text-sm text-gray-600">
            You can review and edit these skills in the next step.
          </p>
        </div>
      )}

      <div className="bg-yellow-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-yellow-900 mb-2">Supported Formats</h3>
        <p className="text-sm text-yellow-800">
          We support PDF, DOC, and DOCX files. Maximum file size: 10MB.
        </p>
      </div>
    </div>
  );
};

export default ResumeUploadStep;
