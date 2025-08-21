import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Briefcase, MapPin, DollarSign, Clock, Users, Building2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface JobPostingFormProps {
  onClose: () => void;
  onJobPosted: (job: any) => void;
}

interface JobFormData {
  title: string;
  company: string;
  location: string;
  job_type: string;
  salary_min: string;
  salary_max: string;
  description: string;
  requirements: string[];
  benefits: string[];
  experience_level: string;
  remote_work: boolean;
  contact_email: string;
  application_deadline: string;
}

const JobPostingForm: React.FC<JobPostingFormProps> = ({ onClose, onJobPosted }) => {
  const [formData, setFormData] = useState<JobFormData>({
    title: '',
    company: '',
    location: '',
    job_type: 'Full-time',
    salary_min: '',
    salary_max: '',
    description: '',
    requirements: [''],
    benefits: [''],
    experience_level: 'Mid-level',
    remote_work: false,
    contact_email: '',
    application_deadline: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: keyof JobFormData, value: string | boolean | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addRequirement = () => {
    setFormData(prev => ({
      ...prev,
      requirements: [...prev.requirements, '']
    }));
  };

  const removeRequirement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }));
  };

  const updateRequirement = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.map((req, i) => i === index ? value : req)
    }));
  };

  const addBenefit = () => {
    setFormData(prev => ({
      ...prev,
      benefits: [...prev.benefits, '']
    }));
  };

  const removeBenefit = (index: number) => {
    setFormData(prev => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index)
    }));
  };

  const updateBenefit = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      benefits: prev.benefits.map((benefit, i) => i === index ? value : benefit)
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.title || !formData.company || !formData.location || !formData.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return false;
    }

    if (formData.requirements.length === 0 || formData.requirements[0] === '') {
      toast({
        title: "Requirements Missing",
        description: "Please add at least one requirement.",
        variant: "destructive"
      });
      return false;
    }

    if (formData.benefits.length === 0 || formData.benefits[0] === '') {
      toast({
        title: "Benefits Missing",
        description: "Please add at least one benefit.",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Get auth token from localStorage
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        throw new Error('Authentication required');
      }

      // Prepare job data for backend
      const jobData = {
        title: formData.title,
        company: formData.company,
        location: formData.location,
        job_type: formData.job_type === 'Full-time' ? 'full_time' : 
                  formData.job_type === 'Part-time' ? 'part_time' : 
                  formData.job_type === 'Contract' ? 'contract' : 
                  formData.job_type === 'Internship' ? 'internship' : 'freelance',
        experience_level: formData.experience_level === 'Entry-level' ? 'entry' :
                         formData.experience_level === 'Mid-level' ? 'mid' :
                         formData.experience_level === 'Senior' ? 'senior' : 'expert',
        description: formData.description,
        salary_min: parseFloat(formData.salary_min) || null,
        salary_max: parseFloat(formData.salary_max) || null,
        remote_work: formData.remote_work,
        application_deadline: formData.application_deadline,
        min_years_experience: 0 // Default value
      };

      // Call the backend API
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${apiUrl}/api/jobs/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(jobData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to post job');
      }

      const result = await response.json();
      const newJob = result.job;

      // Call the callback to add the job to the system
      onJobPosted(newJob);

      toast({
        title: "Job Posted Successfully!",
        description: `"${formData.title}" is now live and visible to job seekers.`,
      });

      // Close the form
      onClose();

    } catch (error) {
      console.error('Error posting job:', error);
      toast({
        title: "Error Posting Job",
        description: error instanceof Error ? error.message : "There was an error posting your job. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Building2 className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">Post a New Job</h2>
            </div>
            <Button
              variant="outline"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Job Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Briefcase className="h-5 w-5" />
                  <span>Basic Job Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Job Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="e.g., Senior React Developer"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="company">Company Name *</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      placeholder="e.g., TechCorp Inc."
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="e.g., San Francisco, CA"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="job_type">Job Type *</Label>
                    <Select value={formData.job_type} onValueChange={(value) => handleInputChange('job_type', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Full-time">Full-time</SelectItem>
                        <SelectItem value="Part-time">Part-time</SelectItem>
                        <SelectItem value="Contract">Contract</SelectItem>
                        <SelectItem value="Internship">Internship</SelectItem>
                        <SelectItem value="Freelance">Freelance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="experience_level">Experience Level</Label>
                    <Select value={formData.experience_level} onValueChange={(value) => handleInputChange('experience_level', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Entry-level">Entry-level</SelectItem>
                        <SelectItem value="Mid-level">Mid-level</SelectItem>
                        <SelectItem value="Senior">Senior</SelectItem>
                        <SelectItem value="Lead">Lead</SelectItem>
                        <SelectItem value="Executive">Executive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="salary_min">Minimum Salary</Label>
                    <Input
                      id="salary_min"
                      type="number"
                      value={formData.salary_min}
                      onChange={(e) => handleInputChange('salary_min', e.target.value)}
                      placeholder="e.g., 80000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="salary_max">Maximum Salary</Label>
                    <Input
                      id="salary_max"
                      type="number"
                      value={formData.salary_max}
                      onChange={(e) => handleInputChange('salary_max', e.target.value)}
                      placeholder="e.g., 120000"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="remote_work"
                    checked={formData.remote_work}
                    onChange={(e) => handleInputChange('remote_work', e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="remote_work">Remote work available</Label>
                </div>
              </CardContent>
            </Card>

            {/* Job Description */}
            <Card>
              <CardHeader>
                <CardTitle>Job Description *</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe the role, responsibilities, and what you're looking for..."
                  rows={6}
                  required
                />
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Requirements *</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addRequirement}
                    className="flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Requirement</span>
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {formData.requirements.map((req, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={req}
                      onChange={(e) => updateRequirement(index, e.target.value)}
                      placeholder={`Requirement ${index + 1}`}
                      required={index === 0}
                    />
                    {formData.requirements.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeRequirement(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Benefits */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Benefits *</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addBenefit}
                    className="flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Benefit</span>
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {formData.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={benefit}
                      onChange={(e) => updateBenefit(index, e.target.value)}
                      placeholder={`Benefit ${index + 1}`}
                      required={index === 0}
                    />
                    {formData.benefits.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeBenefit(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Additional Information */}
            <Card>
              <CardHeader>
                <CardTitle>Additional Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contact_email">Contact Email</Label>
                    <Input
                      id="contact_email"
                      type="email"
                      value={formData.contact_email}
                      onChange={(e) => handleInputChange('contact_email', e.target.value)}
                      placeholder="hr@company.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="application_deadline">Application Deadline</Label>
                    <Input
                      id="application_deadline"
                      type="date"
                      value={formData.application_deadline}
                      onChange={(e) => handleInputChange('application_deadline', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isSubmitting ? 'Posting Job...' : 'Post Job'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JobPostingForm;
