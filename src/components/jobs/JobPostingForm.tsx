import React, { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Briefcase, Building2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { createJob, ApiJob, updateJob } from '@/services/jobService';
import { Job } from '@/hooks/useWebSocket';

export interface JobPostingFormProps {
	job?: Job;
	onClose: () => void;
	onJobPosted?: (job: any) => void;
	onSave?: (updatedJob: ApiJob) => void; // <-- Add this line
	isEdit?: boolean;
	isView?: boolean;
}

interface JobFormData extends Job {
	title: string;
	company: string;
	location: string;
	description: string;
	salary: string;
	job_type: Job['job_type'];
	status: Job['status'];
}

const getInitialFormData = (job?: Job): JobFormData => ({
	id: job?.id || '',
	title: job?.title || '',
	company: job?.company || '',
	location: job?.location || '',
	description: job?.description || '',
	salary: job?.salary || '',
	job_type: job?.job_type || 'FULL_TIME',
	status: job?.status || 'active',
	applications: job?.applications || 0,
	created_at: job?.created_at || new Date().toISOString(),
	employer_name: job?.employer_name || '',
	requirements: job?.requirements || [],
	benefits: job?.benefits || [],
	deadline: job?.deadline || '',
	duration: job?.duration || '',
	remote_work: job?.remote_work || false,
	experience_level: job?.experience_level || 'Entry',
	match_score: job?.match_score,
	reasons_for_match: job?.reasons_for_match,
	featured: job?.featured || false,
});

const JobPostingForm: React.FC<JobPostingFormProps> = ({ onClose, onJobPosted, job, onSave, isEdit, isView }) => {
	const initialFormData = useMemo(() => getInitialFormData(job), [job]);
	const [formData, setFormData] = useState<JobFormData>(initialFormData);

	const [isSubmitting, setIsSubmitting] = useState(false);
	const { toast } = useToast();

	const handleInputChange = (field: keyof JobFormData, value: string) => {
		setFormData(prev => ({
			...prev,
			[field]: value
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
		return true;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!validateForm()) return;
		setIsSubmitting(true);
		try {
			const payload = {
				...formData,
				id: formData.id ? Number(formData.id) : undefined, // Ensure id is a number
			};
			let result;
			if (isEdit && job) {
				// Editing existing job
				result = await updateJob(job.id, payload);
			} else {
				// Creating new job
				result = await createJob(payload);
			}
			if (onJobPosted) onJobPosted(result);
			if (onSave) onSave(result);
			onClose();
		} catch (error: any) {
			toast({
				title: "Error",
				description: error.message || "Failed to save job.",
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

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
										<Label htmlFor="salary">Salary</Label>
										<Input
											id="salary"
											value={formData.salary}
											onChange={(e) => handleInputChange('salary', e.target.value)}
											placeholder="e.g., $80,000 - $120,000"
										/>
									</div>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<Label htmlFor="job_type">Job Type</Label>
										<Select value={formData.job_type} onValueChange={(value) => handleInputChange('job_type', value)}>
											<SelectTrigger>
												<SelectValue placeholder="Select job type" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="FULL_TIME">Full Time</SelectItem>
												<SelectItem value="PART_TIME">Part Time</SelectItem>
												<SelectItem value="CONTRACT">Contract</SelectItem>
												<SelectItem value="INTERNSHIP">Internship</SelectItem>
												<SelectItem value="FREELANCE">Freelance</SelectItem>
											</SelectContent>
										</Select>
									</div>
									<div>
										<Label htmlFor="status">Status</Label>
										<Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
											<SelectTrigger>
												<SelectValue placeholder="Select status" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="active">Active</SelectItem>
												<SelectItem value="draft">Draft</SelectItem>
												<SelectItem value="closed">Closed</SelectItem>
											</SelectContent>
										</Select>
									</div>
								</div>

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
							</CardContent>
						</Card>

						{isView ? (<div></div>) : (<div className="flex justify-end space-x-3 pt-4 border-t">
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
								{isSubmitting ? 'Posting Job...' : ''}
								{isEdit ? 'Edit Job' : 'Post Job'}
							</Button>
						</div>)}
					</form>
				</div>
			</div>
		</div>
	);
};

export default JobPostingForm;
