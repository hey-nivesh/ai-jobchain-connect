import React, { useState, useEffect } from 'react';
import { Job, useWebSocket } from '../../hooks/useWebSocket';
import { useAuth } from '../../hooks/useAuth';
import { Zap, X, Search, Filter, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAIRecommendations } from '../../hooks/useAIRecommendations';
import JobCard from './JobCard';
import JobDetails from './JobDetails';
import JobPostingForm from './JobPostingForm';
import { getJobs } from '@/services/jobService';

const JobListingsPage: React.FC = () => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
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
                console.log('Raw API jobs data:', apiJobs);
                
                // Transform API jobs using the same transformer from useWebSocket
                const transformedJobs = apiJobs.map(job => transformedJobs(job));

                console.log('Transformed jobs:', transformedJobs);
                setJobs(transformedJobs);
                // No need to set filteredJobs here as it's handled by the filter/sort effect
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
            // newJobs are already in the correct format from useWebSocket
            setJobs(prevJobs => {
                const existingIds = new Set(prevJobs.map(j => j.id));
                const uniqueNewJobs = newJobs.filter(j => !existingIds.has(j.id));
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
                    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                case 'salary': {
                    const aSalary = parseInt(a.salary.replace(/\D/g, ''));
                    const bSalary = parseInt(b.salary.replace(/\D/g, ''));
                    return bSalary - aSalary;
                }
                case 'match': {
                    return (b.match_score || 0) - (a.match_score || 0);
                }
                case 'company':
                    return a.company.localeCompare(b.company);
                default:
                    return 0;
            }
        });

        setFilteredJobs(filtered);
    }, [jobs, searchTerm, selectedCategory, sortBy]);

    const handleJobClick = (job: Job) => {
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

    const handleJobPosted = (newJob: Job) => {
        // Use the same transformation logic as in useWebSocket
        const transformedJob: Job = {
            ...newJob,
            id: newJob.id.toString(),
            company: newJob.company || 'Unknown Company',
            location: newJob.location || 'Remote',
            salary: newJob.salary || '',
            job_type: newJob.job_type || 'FULL_TIME',
            description: newJob.description || '',
            status: newJob.status || 'active',
            applications: newJob.applications || 0,
            created_at: newJob.created_at || new Date().toISOString(),
            employer_name: newJob.employer_name || newJob.company || 'Unknown Company',
            requirements: ['Newly posted job requirements'],
            benefits: ['Competitive benefits'],
            deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            duration: 'Permanent',
            remote_work: true,
            experience_level: 'Mid-level',
            match_score: undefined,
            reasons_for_match: undefined,
            featured: false
        };
        setJobs(prevJobs => [transformedJob, ...prevJobs]);
    };

    const { 
        fetchRecommendations 
    } = useAIRecommendations();

    // Add state to switch between views
    const [activeTab, setActiveTab] = useState<'all' | 'recommended'>('all');

    // This would come from your JobFilters component or another state
    const [currentFilters] = useState({
        search: '',
        location: '',
        jobType: '',
        salaryRange: [0, 200000],
        experienceLevel: '',
    });
    
    // This would come from the user's profile context or a hook like useProfileData
    const userSkills = ['React', 'TypeScript', 'Node.js', 'Django'];

    const handleGetRecommendations = () => {
        setActiveTab('recommended');
        fetchRecommendations(userSkills, currentFilters);
    };
    
    // --- JSX (Inside the return statement) ---

    // Add a button to trigger the AI search
    // You can place this near your existing filter buttons

    // Connection Status Indicator class
    let statusClass = '';
    if (connectionStatus === 'Connected') {
        statusClass = 'bg-green-100 text-green-800';
    } else if (connectionStatus === 'Connecting') {
        statusClass = 'bg-yellow-100 text-yellow-800';
    } else {
        statusClass = 'bg-red-100 text-red-800';
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Connection Status Indicator */}
            <div className={`fixed top-4 right-4 px-3 py-1 rounded-full text-xs font-medium z-50 ${statusClass}`}>
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
                                <button 
                                    key={job.id}
                                    type="button"
                                    tabIndex={0}
                                    onClick={() => handleJobClick(job)}
                                    className={`bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer ${
                                        index < newJobs.length ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                                    }`}
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
                                </button>
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
