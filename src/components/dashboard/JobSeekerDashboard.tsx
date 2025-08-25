import React, { useState, useEffect } from 'react';
import { useWebSocket } from '../../hooks/useWebSocket';
import { useAuth } from '../../hooks/useAuth';
import { Bell, Zap, X, Briefcase, User, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link, useNavigate } from 'react-router-dom';
import { getJobs, ApiJob } from '@/services/jobService';
import apiClient from '@/lib/api';

interface UiJob {
	id: number;
	title: string;
	company: string;
	location: string;
	salary_range: string;
	job_type: string;
	posted_date: string;
	description: string;
}

const mapApiJobToUi = (j: ApiJob): UiJob => ({
	id: typeof j.id === 'string' ? parseInt(j.id, 10) : j.id,
	title: j.title,
	company: j.company || 'Unknown',
	location: j.location || 'Remote',
	salary_range: j.salary || 'Not specified',
	job_type: j.type || 'Full-time',
	posted_date: j.created_at,
	description: j.description,
});

const JobSeekerDashboard: React.FC = () => {
	const [jobs, setJobs] = useState<UiJob[]>([]);
	const { user, userId, userRole, setUserRole } = useAuth();
	const navigate = useNavigate();
	const { newJobs, connectionStatus, setNewJobs } = useWebSocket(userId ? parseInt(userId) : 1);

	useEffect(() => {
		(async () => {
			try {
				const data = await getJobs();
				console.log('JobSeekerDashboard - Raw API data:', data); // Debug log
				const mapped = (data || []).map(mapApiJobToUi);
				console.log('JobSeekerDashboard - Mapped data:', mapped); // Debug log
				setJobs(mapped);
			} catch (e) {
				console.error('Failed to load jobs', e);
			}
		})();
	}, []);

	useEffect(() => {
		if (Notification.permission === 'default') {
			Notification.requestPermission();
		}
	}, []);

	useEffect(() => {
		if (newJobs.length > 0) {
			setJobs(prevJobs => {
				const existingIds = new Set(prevJobs.map(job => job.id));
				const uniqueNewJobs = newJobs
					.map(j => mapApiJobToUi({
						id: typeof j.id === 'string' ? parseInt(j.id, 10) : j.id,
						title: j.title,
						description: j.description,
						location: j.location,
						company: j.company,
						created_at: j.created_at,
						employer_name: '',
					}))
					.filter(job => !existingIds.has(job.id));
				return [...uniqueNewJobs, ...prevJobs];
			});
		}
	}, [newJobs]);

	const clearNewJobs = (): void => {
		setNewJobs([]);
	};

	const handleJobClick = (jobId: number): void => {
		console.log(`Navigating to job ${jobId}`);
	};

	const connectionClassMap: Record<string, string> = {
		Connected: 'bg-green-100 text-green-800',
		Connecting: 'bg-yellow-100 text-yellow-800',
		Disconnected: 'bg-red-100 text-red-800',
	};

	const connectionLabelMap: Record<string, string> = {
		Connected: '🟢 Live Updates',
		Connecting: '🟡 Connecting...',
		Disconnected: '🔴 Disconnected',
	};

	const connectionClasses = connectionClassMap[connectionStatus] || 'bg-red-100 text-red-800';
	const connectionLabel = connectionLabelMap[connectionStatus] || '🔴 Disconnected';

	const becomeEmployer = async (): Promise<void> => {
		try {
			await apiClient.post('/set-role', { role: 'EMPLOYER' });
			setUserRole('employer');
			navigate('/dashboard');
		} catch (e) {
			console.error('Failed to switch to employer role', e);
		}
	};

	return (
		<div className="min-h-screen bg-gray-50">
			<div className={`fixed top-4 right-4 px-3 py-1 rounded-full text-xs font-medium z-50 ${connectionClasses}`}>
				{connectionLabel}
			</div>

			{newJobs.length > 0 && (
				<div className="fixed top-16 right-4 bg-blue-500 text-white p-4 rounded-lg shadow-lg z-40 max-w-sm">
					<div className="flex items-center justify-between mb-2">
						<div className="flex items-center">
							<Zap className="h-4 w-4 mr-2" />
							<span className="font-semibold">New Job Matches!</span>
						</div>
						<button 
							onClick={clearNewJobs}
							className="text-white hover:text-gray-200"
						>
							<X className="h-4 w-4" />
						</button>
					</div>
					<p className="text-sm">
						{newJobs.length} new job{newJobs.length > 1 ? 's' : ''} match your profile
					</p>
				</div>
			)}

			<div className="container mx-auto px-4 py-8">
				<div className="mb-8">
					<div className="flex items-center justify-between mb-6">
						<div>
							<h1 className="text-3xl font-bold text-gray-900 mb-2">
								Welcome back, {user?.displayName || user?.email?.split('@')[0] || 'User'}
							</h1>
							<p className="text-gray-600">Here are your latest job recommendations</p>
						</div>
						<div className="flex items-center space-x-3">
							<Link to="/profile-setup">
								<Button variant="outline" className="flex items-center space-x-2">
									<User className="h-4 w-4" />
									<span>Complete Profile</span>
								</Button>
							</Link>
							<Link to="/jobs">
								<Button className="flex items-center space-x-2">
									<Briefcase className="h-4 w-4" />
									<span>Browse All Jobs</span>
								</Button>
							</Link>
							{userRole !== 'employer' && (
								<Button onClick={becomeEmployer} className="bg-yellow-500 hover:bg-yellow-600 text-black">
									Become Employer
								</Button>
							)}
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
						<Card>
							<CardContent className="p-4">
								<div className="flex items-center space-x-2">
									<Briefcase className="h-5 w-5 text-blue-500" />
									<div>
										<p className="text-2xl font-bold">{jobs.length}</p>
										<p className="text-xs text-muted-foreground">Available Jobs</p>
									</div>
								</div>
							</CardContent>
						</Card>
						<Card>
							<CardContent className="p-4">
								<div className="flex items-center space-x-2">
									<Bell className="h-5 h-5 text-green-500" />
									<div>
										<p className="text-2xl font-bold">{newJobs.length}</p>
										<p className="text-xs text-muted-foreground">New Matches</p>
									</div>
								</div>
							</CardContent>
						</Card>
						<Card>
							<CardContent className="p-4">
								<div className="flex items-center space-x-2">
									<Zap className="h-5 w-5 text-yellow-500" />
									<div>
										<p className="text-2xl font-bold">85%</p>
										<p className="text-xs text-muted-foreground">Avg Match Score</p>
									</div>
								</div>
							</CardContent>
						</Card>
						<Card>
							<CardContent className="p-4">
								<div className="flex items-center space-x-2">
									<Settings className="h-5 w-5 text-purple-500" />
									<div>
										<p className="text-2xl font-bold">3</p>
										<p className="text-xs text-muted-foreground">Applications</p>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>

				<Tabs defaultValue="recommendations" className="space-y-6">
					<TabsList className="grid w-full grid-cols-3">
						<TabsTrigger value="recommendations">Recommended Jobs</TabsTrigger>
						<TabsTrigger value="recent">Recent Postings</TabsTrigger>
						<TabsTrigger value="saved">Saved Jobs</TabsTrigger>
					</TabsList>

					<TabsContent value="recommendations" className="space-y-4">
						<div className="space-y-4">
							{jobs.map((job, index) => (
								<button 
									key={job.id}
									className={`bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow cursor-pointer ${
										index < newJobs.length ? 'ring-2 ring-blue-500 bg-blue-50' : ''
									}`}
									onClick={() => handleJobClick(job.id)}
								>
									{index < newJobs.length && (
										<div className="flex items-center mb-3">
											<Badge className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
												<Zap className="h-3 w-3 mr-1" />
												New Match
											</Badge>
										</div>
									)}
									<div className="flex justify-between items-start mb-4">
										<div>
											<h3 className="text-xl font-semibold text-gray-900 mb-1">
												{job.title}
											</h3>
											<p className="text-gray-600">{job.company}</p>
										</div>
										<button className="text-gray-400 hover:text-red-500">
											<Bell className="h-5 w-5" />
										</button>
									</div>
									<div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
										<span>📍 {job.location}</span>
										<span>💰 {job.salary_range}</span>
										<span>⏰ {job.job_type}</span>
										<span>📅 {new Date(job.posted_date).toLocaleDateString()}</span>
									</div>
									<p className="text-gray-700 mb-4">
										{job.description}
									</p>
									<div className="flex justify-between items-center">
										<Button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors">
											Apply Now
										</Button>
										<Button variant="outline" className="text-gray-500 hover:text-gray-700">
											Save Job
										</Button>
									</div>
								</button>
							))}
						</div>
					</TabsContent>

					{jobs.length === 0 && (
						<div className="text-center py-12">
							<div className="text-gray-400 mb-4">
								<Bell className="h-12 w-12 mx-auto" />
							</div>
							<h3 className="text-lg font-medium text-gray-900 mb-2">
								No jobs yet
							</h3>
							<p className="text-gray-600">
								We'll notify you when new jobs match your profile
							</p>
						</div>
					)}

					<TabsContent value="recent" className="space-y-4">
						<div className="text-center py-12">
							<div className="text-gray-400 mb-4">
								<Briefcase className="h-12 w-12 mx-auto" />
							</div>
							<h3 className="text-lg font-medium text-gray-900 mb-2">
								Recent Job Postings
							</h3>
							<p className="text-gray-600">
								Check back soon for the latest job postings
							</p>
						</div>
					</TabsContent>

					<TabsContent value="saved" className="space-y-4">
						<div className="text-center py-12">
							<div className="text-gray-400 mb-4">
								<Bell className="h-12 w-12 mx-auto" />
							</div>
							<h3 className="text-lg font-medium text-gray-900 mb-2">
								Saved Jobs
							</h3>
							<p className="text-gray-600">
								Save interesting jobs to review later
							</p>
						</div>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
};

export default JobSeekerDashboard;
