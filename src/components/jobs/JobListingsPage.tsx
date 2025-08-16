import React, { useState, useEffect } from 'react';
import { useWebSocket, Job } from '../../hooks/useWebSocket';
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

// Extended Job interface for the jobs page
interface ExtendedJob extends Job {
    requirements?: string[];
    benefits?: string[];
    company_logo?: string;
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
    
    // Get real user ID from auth context
    const { userId } = useAuth();
    const { newJobs, connectionStatus, setNewJobs } = useWebSocket(userId ? parseInt(userId) : 1);

    // Sample jobs data with extended information
    const sampleJobs: ExtendedJob[] = [
        {
            id: 1,
            title: 'Senior React Developer',
            company: 'TechCorp Inc.',
            location: 'San Francisco, CA',
            salary_range: '$120,000 - $150,000',
            job_type: 'Full-time',
            posted_date: '2024-01-15T10:30:00Z',
            description: 'We are looking for a senior React developer to join our team and help build amazing user experiences. You will work on cutting-edge web applications and collaborate with a talented team of engineers.',
            requirements: [
                '5+ years of React experience',
                'Strong TypeScript skills',
                'Experience with modern frontend tools',
                'Team collaboration skills'
            ],
            benefits: [
                'Health Insurance',
                'Remote Work',
                'Stock Options',
                '401(k)',
                'Flexible Hours'
            ],
            remote_work: true,
            experience_level: 'Senior'
        },
        {
            id: 2,
            title: 'Frontend Engineer',
            company: 'StartupXYZ',
            location: 'New York, NY',
            salary_range: '$90,000 - $110,000',
            job_type: 'Full-time',
            posted_date: '2024-01-14T14:20:00Z',
            description: 'Join our fast-growing startup and help shape the future of our product. We need someone who is passionate about building user-friendly web applications.',
            requirements: [
                '3+ years of frontend development',
                'React/Vue.js experience',
                'CSS and responsive design skills',
                'Fast learner and team player'
            ],
            benefits: [
                'Health Insurance',
                'Remote Work',
                'Equity',
                'Unlimited PTO'
            ],
            remote_work: true,
            experience_level: 'Mid-level'
        },
        {
            id: 3,
            title: 'UI/UX Designer',
            company: 'Design Studio Pro',
            location: 'Austin, TX',
            salary_range: '$80,000 - $100,000',
            job_type: 'Contract',
            posted_date: '2024-01-13T11:45:00Z',
            description: 'We need a creative UI/UX designer to help us create beautiful and functional interfaces. You will work closely with our development team.',
            requirements: [
                'Portfolio of design work',
                'Figma/Sketch experience',
                'User research skills',
                'Prototyping abilities'
            ],
            benefits: [
                'Flexible Schedule',
                'Remote Work',
                'Creative Freedom',
                'Competitive Rate'
            ],
            remote_work: true,
            experience_level: 'Mid-level'
        },
        {
            id: 4,
            title: 'Full Stack Developer',
            company: 'Enterprise Solutions',
            location: 'Chicago, IL',
            salary_range: '$100,000 - $130,000',
            job_type: 'Full-time',
            posted_date: '2024-01-12T09:00:00Z',
            description: 'Join our enterprise team and work on large-scale applications. We need someone with both frontend and backend experience.',
            requirements: [
                'Full stack development experience',
                'Node.js and React knowledge',
                'Database design skills',
                'Agile methodology experience'
            ],
            benefits: [
                'Health Insurance',
                'Dental Coverage',
                'Vision Coverage',
                '401(k) with Match',
                'Professional Development'
            ],
            remote_work: false,
            experience_level: 'Senior'
        },
        {
            id: 5,
            title: 'DevOps Engineer',
            company: 'CloudTech',
            location: 'Seattle, WA',
            salary_range: '$110,000 - $140,000',
            job_type: 'Full-time',
            posted_date: '2024-01-11T15:30:00Z',
            description: 'Help us build and maintain our cloud infrastructure. We need someone with strong DevOps skills and cloud experience.',
            requirements: [
                'AWS/Azure experience',
                'Docker and Kubernetes knowledge',
                'CI/CD pipeline experience',
                'Linux administration skills'
            ],
            benefits: [
                'Health Insurance',
                'Remote Work',
                'Stock Options',
                'Home Office Setup',
                'Conference Budget'
            ],
            remote_work: true,
            experience_level: 'Senior'
        }
    ];

    // Fetch jobs from backend API
    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const authToken = localStorage.getItem('authToken');
                if (!authToken) {
                    // Fallback to sample data if not authenticated
                    setJobs(sampleJobs);
                    setFilteredJobs(sampleJobs);
                    return;
                }

                const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/jobs/list/`, {
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setJobs(data.jobs);
                    setFilteredJobs(data.jobs);
                } else {
                    // Fallback to sample data if API fails
                    setJobs(sampleJobs);
                    setFilteredJobs(sampleJobs);
                }
            } catch (error) {
                console.error('Error fetching jobs:', error);
                // Fallback to sample data on error
                setJobs(sampleJobs);
                setFilteredJobs(sampleJobs);
            }
        };

        fetchJobs();
    }, []);

    // Merge new jobs with existing jobs
    useEffect(() => {
        if (newJobs.length > 0) {
            const extendedNewJobs: ExtendedJob[] = newJobs.map(job => ({
                ...job,
                requirements: ['Skills matching your profile'],
                benefits: ['Competitive benefits'],
                remote_work: true,
                experience_level: 'Mid-level'
            }));
            
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
            filtered = filtered.filter(job => job.job_type === selectedCategory);
        }

        // Apply sorting
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'recent':
                    return new Date(b.posted_date).getTime() - new Date(a.posted_date).getTime();
                case 'salary':
                    const aSalary = parseInt(a.salary_range.replace(/[^0-9]/g, ''));
                    const bSalary = parseInt(b.salary_range.replace(/[^0-9]/g, ''));
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

    const handleApplyToJob = (jobId: number) => {
        console.log(`Applying to job ${jobId}`);
        // In real app, this would navigate to application form
        alert(`Application form for ${jobs.find(j => j.id === jobId)?.title} will open here`);
    };

    const handleJobPosted = (newJob: any) => {
        // Add the new job to the jobs list
        const extendedJob: ExtendedJob = {
            ...newJob,
            requirements: newJob.requirements || [],
            benefits: newJob.benefits || [],
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
                                <SelectItem value="Full-time">Full-time</SelectItem>
                                <SelectItem value="Part-time">Part-time</SelectItem>
                                <SelectItem value="Contract">Contract</SelectItem>
                                <SelectItem value="Internship">Internship</SelectItem>
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
                                job={{
                                    id: job.id.toString(),
                                    title: job.title,
                                    company: job.company,
                                    location: job.location,
                                    salary: job.salary_range,
                                    type: job.job_type,
                                    status: 'active',
                                    applications: Math.floor(Math.random() * 20) + 1,
                                    postedDate: new Date(job.posted_date).toLocaleDateString()
                                }}
                                onApply={() => handleApplyToJob(job.id)}
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
                                job={{
                                    id: selectedJob.id.toString(),
                                    title: selectedJob.title,
                                    company: selectedJob.company,
                                    location: selectedJob.location,
                                    salary: selectedJob.salary_range,
                                    type: selectedJob.job_type,
                                    status: 'active',
                                    applications: Math.floor(Math.random() * 20) + 1,
                                    postedDate: new Date(selectedJob.posted_date).toLocaleDateString(),
                                    description: selectedJob.description,
                                    requirements: selectedJob.requirements || [],
                                    benefits: selectedJob.benefits || []
                                }}
                                onApply={() => {
                                    handleApplyToJob(selectedJob.id);
                                    handleCloseJobDetails();
                                }}
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
