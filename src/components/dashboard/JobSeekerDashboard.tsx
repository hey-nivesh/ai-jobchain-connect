import React, { useState, useEffect } from 'react';
import { useWebSocket, Job } from '../../hooks/useWebSocket';
import { useAuth } from '../../hooks/useAuth';
import { Bell, Zap, X, Briefcase, User, Settings, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';

// Type definitions
interface User {
    id: number;
    name: string;
    email: string;
}

const JobSeekerDashboard: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const { user, userId } = useAuth();
  const { newJobs, connectionStatus, setNewJobs } = useWebSocket(userId ? parseInt(userId) : 1);

    // Sample jobs data (in real app, this would come from API)
    const sampleJobs: Job[] = [
        {
            id: 1,
            title: 'Senior React Developer',
            company: 'TechCorp Inc.',
            location: 'San Francisco, CA',
            salary_range: '$120,000 - $150,000',
            job_type: 'Full-time',
            posted_date: '2024-01-15T10:30:00Z',
            description: 'We are looking for a senior React developer to join our team and help build amazing user experiences...'
        },
        {
            id: 2,
            title: 'Frontend Engineer',
            company: 'StartupXYZ',
            location: 'New York, NY',
            salary_range: '$90,000 - $110,000',
            job_type: 'Full-time',
            posted_date: '2024-01-14T14:20:00Z',
            description: 'Join our fast-growing startup and help shape the future of our product...'
        },
        {
            id: 3,
            title: 'UI/UX Designer',
            company: 'Design Studio Pro',
            location: 'Austin, TX',
            salary_range: '$80,000 - $100,000',
            job_type: 'Contract',
            posted_date: '2024-01-13T11:45:00Z',
            description: 'We need a creative UI/UX designer to help us create beautiful and functional interfaces...'
        }
    ];

    // Initialize jobs with sample data
    useEffect(() => {
        setJobs(sampleJobs);
    }, []);

    // Request notification permission on component mount
    useEffect(() => {
        if (Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }, []);

    // Merge new jobs with existing jobs
    useEffect(() => {
        if (newJobs.length > 0) {
            setJobs(prevJobs => {
                const existingIds = new Set(prevJobs.map(job => job.id));
                const uniqueNewJobs = newJobs.filter(job => !existingIds.has(job.id));
                return [...uniqueNewJobs, ...prevJobs];
            });
        }
    }, [newJobs]);

    const clearNewJobs = (): void => {
        setNewJobs([]);
    };

    const handleJobClick = (jobId: number): void => {
        // Navigate to job details
        console.log(`Navigating to job ${jobId}`);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Connection Status Indicator */}
            <div className={`fixed top-4 right-4 px-3 py-1 rounded-full text-xs font-medium z-50 ${
                connectionStatus === 'Connected' 
                    ? 'bg-green-100 text-green-800' 
                    : connectionStatus === 'Connecting'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
            }`}>
                {connectionStatus === 'Connected' && '🟢 Live Updates'}
                {connectionStatus === 'Connecting' && '🟡 Connecting...'}
                {connectionStatus === 'Disconnected' && '🔴 Disconnected'}
            </div>

            {/* New Jobs Alert */}
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

            {/* Main Dashboard Content */}
            <div className="container mx-auto px-4 py-8">
                {/* Header Section */}
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
                        </div>
                    </div>

                    {/* Quick Stats */}
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

                {/* Tabs Section */}
                <Tabs defaultValue="recommendations" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="recommendations">Recommended Jobs</TabsTrigger>
                        <TabsTrigger value="recent">Recent Postings</TabsTrigger>
                        <TabsTrigger value="saved">Saved Jobs</TabsTrigger>
                    </TabsList>

                    <TabsContent value="recommendations" className="space-y-4">
                        {/* Jobs List */}
                        <div className="space-y-4">
                            {jobs.map((job, index) => (
                                <div 
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
                                </div>
                            ))}
                        </div>
                    </TabsContent>

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
            </div>
        </div>
    );
};

export default JobSeekerDashboard;
