import React, { useState, useEffect } from 'react';
import { useWebSocket } from '../../hooks/useWebSocket';
import { useAuth } from '../../hooks/useAuth';
import { Bell, Zap, X, Briefcase, Search, Filter, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import JobCard from './JobCard';
import JobDetails from './JobDetails';
import JobFilters from './JobFilters';
import JobPostingForm from './JobPostingForm';
import { getJobs, ApiJob } from '@/services/jobService';
import { Job } from '@/hooks/useJobs';

// Extended Job interface for the jobs page that matches JobCard expectations
interface ExtendedJob {
    id: string;
    title: string;
    company: string;
    location: string;
    type: string;
    salary: string;
    description: string;
    requirements: string[];
    benefits: string[];
    postedDate: string;
    deadline: string;
    applications: number;
    status: 'active' | 'closed' | 'draft';
    employerId: string;
    duration: string;
    remote_work?: boolean;
    experience_level?: string;
}

const JobListingsPage: React.FC = () => {
    const [jobs, setJobs] = useState<ExtendedJob[]>([]);
    const [filteredJobs, setFilteredJobs] = useState<ExtendedJob[]>([]);
    const [selectedJob, setSelectedJob] = useState<ExtendedJob | null>(null);
    const [showJobDetails, setShowJobDetails] = useState(false);
    const [showJobPostingForm, setShowJobPostingForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortBy, setSortBy] = useState('recent');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // Get real user ID from auth context
    const { userId } = useAuth();
    const { newJobs, connectionStatus, setNewJobs } = useWebSocket(userId ? parseInt(userId) : 1);

    // Fetch jobs from backend API
    useEffect(() => {
        const fetchJobs = async () => {
            try {
                setLoading(true);
                const apiJobs = await getJobs();
                console.log('Raw API jobs data:', apiJobs); // Debug log
                const transformedJobs: ExtendedJob[] = apiJobs.map(apiJob => {
                    // Use actual salary from API, only fallback if truly empty
                    let salary = apiJob.salary;
                    if (!salary || salary.trim() === '') {
                        // Only provide fallback if salary is actually empty
                        if (apiJob.title.toLowerCase().includes('senior') || apiJob.title.toLowerCase().includes('lead')) {
                            salary = '$120,000 - $150,000';
                        } else if (apiJob.title.toLowerCase().includes('junior') || apiJob.title.toLowerCase().includes('entry')) {
                            salary = '$60,000 - $80,000';
                        } else if (apiJob.title.toLowerCase().includes('developer') || apiJob.title.toLowerCase().includes('engineer')) {
                            salary = '$90,000 - $120,000';
                        } else {
                            salary = '$80,000 - $100,000';
                        }
                    }
                    
                    return {
                        id: apiJob.id.toString(),
                        title: apiJob.title,
                        company: apiJob.company || 'Unknown Company',
                        location: apiJob.location || 'Remote',
                        salary: salary,
                        type: apiJob.type || 'FULL_TIME',
                        status: (apiJob.status as 'active' | 'closed' | 'draft') || 'active',
                        applications: apiJob.applications || 0,
                        postedDate: apiJob.postedDate || apiJob.created_at,
                        description: apiJob.description,
                        requirements: ['Skills matching your profile'],
                        benefits: ['Competitive benefits'],
                        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
                        employerId: '1',
                        duration: 'Permanent',
                        remote_work: true,
                        experience_level: 'Mid-level'
                    };
                });
                console.log('Transformed jobs:', transformedJobs); // Debug log
                setJobs(transformedJobs);
                setFilteredJobs(transformedJobs);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch jobs');
                console.error('Error fetching jobs:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    // Merge new jobs with existing jobs
    useEffect(() => {
        if (newJobs.length > 0) {
            const extendedNewJobs: ExtendedJob[] = newJobs.map((job: any) => {
                // Handle salary field more gracefully
                let salary = job.salary;
                if (!salary || salary.trim() === '') {
                    // Provide a default salary based on job title
                    if (job.title.toLowerCase().includes('senior') || job.title.toLowerCase().includes('lead')) {
                        salary = '$120,000 - $150,000';
                    } else if (job.title.toLowerCase().includes('junior') || job.title.toLowerCase().includes('entry')) {
                        salary = '$60,000 - $80,000';
                    } else if (job.title.toLowerCase().includes('developer') || job.title.toLowerCase().includes('engineer')) {
                        salary = '$90,000 - $120,000';
                    } else {
                        salary = '$80,000 - $100,000';
                    }
                }
                
                return {
                    id: job.id.toString(),
                    title: job.title,
                    company: job.company || 'Unknown Company',
                    location: job.location || 'Remote',
                    salary: salary,
                    type: job.type || 'FULL_TIME',
                    status: (job.status as 'active' | 'closed' | 'draft') || 'active',
                    applications: job.applications || 0,
                    postedDate: job.postedDate || job.created_at,
                    description: job.description,
                    requirements: ['Skills matching your profile'],
                    benefits: ['Competitive benefits'],
                    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                    employerId: '1',
                    duration: 'Permanent',
                    remote_work: true,
                    experience_level: 'Mid-level'
                };
            });
            
            setJobs(prevJobs => {
                const existingIds = new Set(prevJobs.map(job => job.id));
                const uniqueNewJobs = extendedNewJobs.filter(job => !existingIds.has(job.id));
                return [...uniqueNewJobs, ...prevJobs];
            });
        }
    }, [newJobs]);

    // Filter and sort jobs
    useEffect(() => {
        let filtered = jobs;

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(job =>
                job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply category filter
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(job => job.type === selectedCategory);
        }

        // Apply sorting
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'recent':
                    return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime();
                case 'salary':
                    const aSalary = parseInt(a.salary.replace(/[^0-9]/g, ''));
                    const bSalary = parseInt(b.salary.replace(/[^0-9]/g, ''));
                    return bSalary - aSalary;
                case 'company':
                    return a.company.localeCompare(b.company);
                default:
                    return 0;
            }
        });

        setFilteredJobs(filtered);
    }, [jobs, searchTerm, selectedCategory, sortBy]);

    const handleJobClick = (job: ExtendedJob) => {
        setSelectedJob(job);
        setShowJobDetails(true);
    };

    const handleCloseJobDetails = () => {
        setShowJobDetails(false);
        setSelectedJob(null);
    };

    const clearNewJobs = () => {
        setNewJobs([]);
    };

    const handleApplyToJob = (jobId: string) => {
        console.log(`Applying to job ${jobId}`);
        // In real app, this would navigate to application form
        alert(`Application form for ${jobs.find(j => j.id === jobId)?.title} will open here`);
    };

    const handleJobPosted = (newJob: any) => {
        // Handle salary field more gracefully
        let salary = newJob.salary;
        if (!salary || salary.trim() === '') {
            // Provide a default salary based on job title
            if (newJob.title.toLowerCase().includes('senior') || newJob.title.toLowerCase().includes('lead')) {
                salary = '$120,000 - $150,000';
            } else if (newJob.title.toLowerCase().includes('junior') || newJob.title.toLowerCase().includes('entry')) {
                salary = '$60,000 - $80,000';
            } else if (newJob.title.toLowerCase().includes('developer') || newJob.title.toLowerCase().includes('engineer')) {
                salary = '$90,000 - $120,000';
            } else {
                salary = '$80,000 - $100,000';
            }
        }
        
        // Add the new job to the jobs list
        const extendedJob: ExtendedJob = {
            id: newJob.id.toString(),
            title: newJob.title,
            company: newJob.company || 'Unknown Company',
            location: newJob.location || 'Remote',
            salary: salary,
            type: newJob.type || 'FULL_TIME',
            status: (newJob.status as 'active' | 'closed' | 'draft') || 'active',
            applications: newJob.applications || 0,
            postedDate: newJob.postedDate || newJob.created_at,
            description: newJob.description,
            requirements: newJob.requirements || ['Skills matching your profile'],
            benefits: newJob.benefits || ['Competitive benefits'],
            deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            employerId: '1',
            duration: 'Permanent',
            remote_work: newJob.remote_work || false,
            experience_level: newJob.experience_level || 'Mid-level'
        };
        
        setJobs(prevJobs => [extendedJob, ...prevJobs]);
        
        // Show success message
        console.log('New job posted:', newJob);
        
        // In a real app, this would trigger the WebSocket notification to job seekers
        // For demo purposes, we'll simulate this by adding it to newJobs
        setNewJobs(prev => [newJob, ...prev]);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading jobs...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 mb-4">Error: {error}</p>
                    <Button onClick={() => window.location.reload()}>Retry</Button>
                </div>
            </div>
        );
    }

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

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                Find Your Dream Job
                            </h1>
                            <p className="text-gray-600">
                                Discover opportunities that match your skills and preferences
                            </p>
                        </div>
                        <Button 
                            className="flex items-center space-x-2"
                            onClick={() => setShowJobPostingForm(true)}
                        >
                            <Plus className="h-4 w-4" />
                            <span>Post a Job</span>
                        </Button>
                    </div>

                    {/* Search and Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                placeholder="Search jobs..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                            <SelectTrigger>
                                <SelectValue placeholder="Job Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value="FULL_TIME">Full Time</SelectItem>
                                <SelectItem value="PART_TIME">Part Time</SelectItem>
                                <SelectItem value="CONTRACT">Contract</SelectItem>
                                <SelectItem value="INTERNSHIP">Internship</SelectItem>
                                <SelectItem value="FREELANCE">Freelance</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger>
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="recent">Most Recent</SelectItem>
                                <SelectItem value="salary">Highest Salary</SelectItem>
                                <SelectItem value="company">Company Name</SelectItem>
                            </SelectContent>
                        </Select>

                        <Button variant="outline" className="flex items-center space-x-2">
                            <Filter className="h-4 w-4" />
                            <span>More Filters</span>
                        </Button>
                    </div>

                    {/* Results Count */}
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-sm text-gray-600">
                            Showing {filteredJobs.length} of {jobs.length} jobs
                        </p>
                        {newJobs.length > 0 && (
                            <Badge className="bg-blue-100 text-blue-800">
                                {newJobs.length} new match{newJobs.length > 1 ? 'es' : ''}
                            </Badge>
                        )}
                    </div>
                </div>

                {/* Jobs Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredJobs.map((job, index) => (
                        <div 
                            key={job.id}
                            className={`bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer ${
                                index < newJobs.length ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                            }`}
                            onClick={() => handleJobClick(job)}
                        >
                            {index < newJobs.length && (
                                <div className="p-4 pb-0">
                                    <Badge className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full flex items-center w-fit">
                                        <Zap className="h-3 w-3 mr-1" />
                                        New Match
                                    </Badge>
                                </div>
                            )}
                            
                            <JobCard 
                                job={job}
                                onViewDetails={handleJobClick}
                                onApply={handleApplyToJob}
                                onSave={() => console.log('Save job:', job.id)}
                            />
                        </div>
                    ))}
                </div>

                {filteredJobs.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-gray-400 mb-4">
                            <Search className="h-12 w-12 mx-auto" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No jobs found
                        </h3>
                        <p className="text-gray-600">
                            Try adjusting your search criteria or filters
                        </p>
                    </div>
                )}
            </div>

            {/* Job Details Modal */}
            {showJobDetails && selectedJob && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    Job Details
                                </h2>
                                <Button
                                    variant="outline"
                                    onClick={handleCloseJobDetails}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                            
                            <JobDetails 
                                job={selectedJob}
                                onClose={handleCloseJobDetails}
                                onApply={(jobId, applicationData) => {
                                    handleApplyToJob(jobId);
                                    handleCloseJobDetails();
                                }}
                                onSave={() => console.log('Save job:', selectedJob.id)}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Job Posting Form Modal */}
            {showJobPostingForm && (
                <JobPostingForm
                    onClose={() => setShowJobPostingForm(false)}
                    onJobPosted={handleJobPosted}
                />
            )}
        </div>
    );
};

export default JobListingsPage;
