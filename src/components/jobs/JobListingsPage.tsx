import React, { useState, useEffect } from 'react';
import { Job, useWebSocket } from '../../hooks/useWebSocket';
import { useAuth } from '../../hooks/useAuth';
import { Zap, X, Search, Filter, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import JobCard from './JobCard';
import JobDetails from './JobDetails';
import JobPostingForm from './JobPostingForm';
import { getJobs, ApiJob } from '@/services/jobService';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import JobFilters from './JobFilters';

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
    created_at: string;
    deadline: string;
    applications: number;
    status: 'active' | 'closed' | 'draft';
    employer_name: string;
    duration: string;
    remote_work?: boolean;
    experience_level?: string;
    skills?: string[];
    job_type?: string;
}

const JobListingsPage: React.FC = () => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [showJobDetails, setShowJobDetails] = useState(false);
    const [showJobPostingForm, setShowJobPostingForm] = useState(false);
    const [showFiltersModal, setShowFiltersModal] = useState(false);
    const [showSkillsModal, setShowSkillsModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortBy, setSortBy] = useState('recent');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  
  // Popular skills for the skills filter modal
  const popularSkills = [
      'React', 'JavaScript', 'Python', 'Node.js', 'TypeScript',
      'Java', 'C#', 'C++', 'Go', 'Ruby', 'PHP', 'Swift',
      'Kotlin', 'Rust', 'SQL', 'MongoDB', 'AWS', 'Azure',
      'Docker', 'Kubernetes', 'GraphQL', 'REST API', 'Git',
      'Machine Learning', 'Data Science', 'DevOps'
  ];
    const [filterOptions, setFilterOptions] = useState({
        search: '',
        location: '',
        jobType: '',
        salaryRange: [0, 200000] as [number, number],
        experienceLevel: '',
        remoteWork: false,
        benefits: [] as string[],
        skills: [] as string[],
        companySize: '',
        industry: ''
    });
    
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
                console.log('Transformed jobs:', apiJobs.map(apiJob => {
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

                        // Get skills from the API response or extract from description as fallback
                        const skills = [];

                        // Use skills from API if available
                        if (apiJob.skills && apiJob.skills.length > 0) {
                            apiJob.skills.forEach(skill => {
                                skills.push(skill.name);
                            });
                        } else {
                            // Fallback: Extract skills from job description
                            const popularSkills = ['React', 'JavaScript', 'Python', 'Node.js', 'TypeScript', 'AWS', 'Docker', 'Kubernetes', 'Machine Learning', 'UI/UX Design'];

                            // Check if any popular skills are mentioned in the job description
                            popularSkills.forEach(skill => {
                                if (apiJob.description && apiJob.description.toLowerCase().includes(skill.toLowerCase())) {
                                    skills.push(skill);
                                }
                            });
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
                            postedDate: apiJob.posted_date || apiJob.created_at,
                            description: apiJob.description,
                            requirements: skills.length > 0 ? skills : ['Skills matching your profile'],
                            benefits: ['Competitive benefits'],
                            deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
                            employerId: '1',
                            duration: 'Permanent',
                            remote_work: true,
                            experience_level: 'Mid-level',
                            skills: skills
                        };
                    })); // Debug log
                newFunction(setJobs, apiJobs);
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

    // Synchronize search, category, and selectedSkills with filterOptions
    useEffect(() => {
        setFilterOptions(prev => ({
            ...prev,
            search: searchTerm,
            jobType: selectedCategory === 'all' ? '' : selectedCategory
        }));
        
        // Keep selectedSkills in sync with filterOptions.skills
        setSelectedSkills(filterOptions.skills);
    }, [searchTerm, selectedCategory]);

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

        // Apply skills filter
        if (filterOptions.skills.length > 0) {
            filtered = filtered.filter(job => {
                // First check if job has skills array from API
                if (job.skills && job.skills.length > 0) {
                    return filterOptions.skills.some(selectedSkill => 
                        job.skills!.some(jobSkill => 
                            jobSkill.toLowerCase() === selectedSkill.toLowerCase()
                        )
                    );
                }
                
                // Fallback to checking requirements and description
                return filterOptions.skills.some(skill => 
                    job.requirements.some(req => 
                        req.toLowerCase().includes(skill.toLowerCase())
                    ) ||
                    job.description.toLowerCase().includes(skill.toLowerCase())
                );
            });
        }

        // Apply location filter
        if (filterOptions.location) {
            filtered = filtered.filter(job =>
                job.location.toLowerCase().includes(filterOptions.location.toLowerCase())
            );
        }

        // Apply job type filter
        if (filterOptions.jobType) {
            filtered = filtered.filter(job =>
                job.type.toLowerCase().includes(filterOptions.jobType.toLowerCase())
            );
        }

        // Apply experience level filter
        if (filterOptions.experienceLevel) {
            filtered = filtered.filter(job =>
                job.experience_level?.toLowerCase().includes(filterOptions.experienceLevel.toLowerCase())
            );
        }

        // Apply remote work filter
        if (filterOptions.remoteWork) {
            filtered = filtered.filter(job => job.remote_work === true);
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
    }, [jobs, searchTerm, selectedCategory, sortBy, filterOptions]);

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
        
        // Extract skills from the new job
        const skills: string[] = [];
        if (newJob.skills && newJob.skills.length > 0) {
            // If skills are provided as objects with name property
            if (typeof newJob.skills[0] === 'object' && newJob.skills[0].name) {
                newJob.skills.forEach((skill: any) => skills.push(skill.name));
            } else {
                // If skills are provided as strings
                skills.push(...newJob.skills);
            }
        }
        
        // Add the new job to the jobs list
        const extendedJob: ExtendedJob = {
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
            remote_work: newJob.remote_work || false,
            experience_level: newJob.experience_level || 'Mid-level',
            skills: skills.length > 0 ? skills : undefined,
            title: '',
            type: ''
        };
        setJobs((prevJobs): (Job | ExtendedJob)[] => [extendedJob, ...prevJobs]);
    };

    // Mock AI recommendations functionality
    const fetchRecommendations = (skills: string[], filters: any) => {
        console.log('Fetching recommendations for skills:', skills, 'with filters:', filters);
        // In a real implementation, this would call an API
    };

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

    function handleSkillToggle(skill: string): void {
        setSelectedSkills(prev => 
            prev.includes(skill)
                ? prev.filter(s => s !== skill)
                : [...prev, skill]
        );
        
        // Also update filterOptions to keep them in sync
        setFilterOptions(prev => ({
            ...prev,
            skills: prev.skills.includes(skill)
                ? prev.skills.filter(s => s !== skill)
                : [...prev.skills, skill]
        }));
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Connection Status Indicator */}
            <div className={`fixed top-4 right-4 px-3 py-1 rounded-full text-xs font-medium z-50 ${statusClass}`}>
                {connectionStatus === 'Connected' && '🟢 Live Updates'}
                {connectionStatus === 'Connecting' && '🟡 Connecting...'}
                {connectionStatus === 'Disconnected' && '🔴 Disconnected'}
            </div>


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

                        <div className="flex space-x-2">
                            <Button 
                                variant="outline" 
                                className="flex items-center space-x-2"
                                onClick={() => {
                                    // Create a simplified modal for skills only
                                    setShowSkillsModal(true);
                                }}
                            >
                                <Filter className="h-4 w-4" />
                                <span>Skills Filter</span>
                                {selectedSkills.length > 0 && (
                                    <Badge className="ml-2 bg-blue-100 text-blue-800">
                                        {selectedSkills.length}
                                    </Badge>
                                )}
                            </Button>
                            
                            <Button 
                                variant="outline" 
                                className="flex items-center space-x-2"
                                onClick={() => setShowFiltersModal(true)}
                            >
                                <Filter className="h-4 w-4" />
                                <span>More Filters</span>
                            </Button>
                        </div>
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

                    {/* Active Filters */}
                    {filterOptions.skills.length > 0 && (
                        <div className="mb-4">
                            <p className="text-sm font-medium text-gray-700 mb-2">Active Skill Filters:</p>
                            <div className="flex flex-wrap gap-2">
                                {filterOptions.skills.map(skill => (
                                    <Badge key={skill} variant="secondary" className="flex items-center space-x-1">
                                        <span>{skill}</span>
                                        <X 
                                            className="w-3 h-3 ml-1 cursor-pointer" 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setFilterOptions(prev => ({
                                                    ...prev,
                                                    skills: prev.skills.filter(s => s !== skill)
                                                }));
                                            }}
                                        />
                                    </Badge>
                                ))}
                                {filterOptions.skills.length > 0 && (
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="h-6 text-xs"
                                        onClick={() => setFilterOptions(prev => ({ ...prev, skills: [] }))}
                                    >
                                        Clear All
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Jobs Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredJobs.map((job, index) => (
                        <div 
                            key={job.id}
                            className={`${index < newJobs.length ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}
                        >
                            {index < newJobs.length && (
                                <div className="p-4 pb-0 flex justify-between items-start">
                                    <div>
                                        <Badge className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full flex items-center w-fit">
                                            <Zap className="h-3 w-3 mr-1" />
                                            New Match
                                        </Badge>
                                        <p className="text-sm mt-1">
                                            {newJobs.length} new job{newJobs.length > 1 ? 's' : ''} match your profile
                                        </p>
                                    </div>
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            clearNewJobs();
                                        }}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            )}
                            <JobCard 
                                job={job}
                                onViewDetails={handleJobClick}
                                onApply={handleApplyToJob}
                                onSave={(id) => console.log(`Saving job ${id}`)}
                                showActions={true}
                            />
                        </div>
                    ))}
                </div>

                {/* No jobs found message */}
                {filteredJobs.length === 0 && (
                    <div className="text-center py-10">
                        <p className="text-gray-500">No jobs match your current filters.</p>
                        <Button 
                            variant="outline" 
                            className="mt-4"
                            onClick={() => {
                                setFilterOptions({
                                    search: '',
                                    location: '',
                                    jobType: '',
                                    salaryRange: [0, 200000],
                                    experienceLevel: '',
                                    remoteWork: false,
                                    benefits: [],
                                    skills: [],
                                    companySize: '',
                                    industry: ''
                                });
                                setSearchTerm('');
                                setSelectedCategory('all');
                            }}
                        >
                            Clear Filters
                        </Button>
                    </div>
                )}

            {/* Job Posting Form Modal */}
            <Dialog open={showJobPostingForm} onOpenChange={setShowJobPostingForm}>
                <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Post a New Job</DialogTitle>
                    </DialogHeader>
                    <JobPostingForm
                        onClose={() => setShowJobPostingForm(false)}
                        onJobPosted={handleJobPosted}
                    />
                </DialogContent>
            </Dialog>

            {/* Filters Modal */}
            <Dialog open={showFiltersModal} onOpenChange={setShowFiltersModal}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Filter Jobs</DialogTitle>
                    </DialogHeader>
                    <JobFilters 
                        filters={filterOptions}
                        onFiltersChange={(newFilters) => {
                            setFilterOptions(newFilters);
                            // Update searchTerm and selectedCategory to match the filters
                            setSearchTerm(newFilters.search);
                            setSelectedCategory(newFilters.jobType === '' ? 'all' : newFilters.jobType);
                        }}
                        onClearFilters={() => {
                            setFilterOptions({
                                search: '',
                                location: '',
                                jobType: '',
                                salaryRange: [0, 200000],
                                experienceLevel: '',
                                remoteWork: false,
                                benefits: [],
                                skills: [],
                                companySize: '',
                                industry: ''
                            });
                            setSearchTerm('');
                            setSelectedCategory('all');
                        }}
                        totalJobs={jobs.length}
                        filteredJobs={filteredJobs.length}
                    />
                </DialogContent>
            </Dialog>

            {/* Skills Filter Modal */}
            <Dialog open={showSkillsModal} onOpenChange={setShowSkillsModal}>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Skills Filter</DialogTitle>
                    </DialogHeader>
                    <div className="p-4">
                        <div className="mb-4">
                            <h3 className="text-lg font-medium mb-2">Select Skills</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                {[
                                    'React', 'JavaScript', 'Python', 'Node.js', 'TypeScript',
                                    'AWS', 'Docker', 'Kubernetes', 'Machine Learning', 'UI/UX Design'
                                ].map(skill => (
                                    <div key={skill} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`skill-${skill}`}
                                            checked={filterOptions.skills.includes(skill)}
                                            onCheckedChange={() => {
                                                const newSkills = filterOptions.skills.includes(skill)
                                                    ? filterOptions.skills.filter(s => s !== skill)
                                                    : [...filterOptions.skills, skill];
                                                
                                                setFilterOptions(prev => ({
                                                    ...prev,
                                                    skills: newSkills
                                                }));
                                            }}
                                        />
                                        <label
                                            htmlFor={`skill-${skill}`}
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            {skill}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {filterOptions.skills.length > 0 && (
                             <div className="mb-4">
                                 <h3 className="text-lg font-medium mb-2">Selected Skills</h3>
                                 <div className="flex flex-wrap gap-2">
                                     {filterOptions.skills.map(skill => (
                                         <Badge
                                             key={skill}
                                             variant="secondary"
                                             className="flex items-center gap-1"
                                         >
                                             {skill}
                                             <X
                                                 className="h-3 w-3 cursor-pointer"
                                                 onClick={() => {
                                                     const newSkills = filterOptions.skills.filter(s => s !== skill);
                                                     setFilterOptions(prev => ({
                                                         ...prev,
                                                         skills: newSkills
                                                     }));
                                                 }}
                                             />
                                         </Badge>
                                     ))}
                                 </div>
                             </div>
                         )}

                        <div className="flex justify-between mt-4">
                             <Button
                                 variant="outline"
                                 onClick={() => setFilterOptions(prev => ({ ...prev, skills: [] }))}
                                 disabled={filterOptions.skills.length === 0}
                             >
                                 Clear Skills
                             </Button>
                             <Button onClick={() => setShowSkillsModal(false)}>
                                 Apply Filters
                             </Button>
                         </div>
                    </div>
                </DialogContent>
            </Dialog>
            </div>
        </div>
    );
};

export default JobListingsPage;
function newFunction(setJobs: React.Dispatch<React.SetStateAction<Job[]>>, apiJobs: ApiJob[]) {
    setJobs(apiJobs.map((apiJob): {
        id: string; title: string; company: string; location: string; salary: string; type: string; status: "active" | "closed" | "draft"; applications: number; postedDate: string; description: string; requirements: any[]; benefits: string[]; deadline: string; // 30 days from now
        employerId: string; duration: string; remote_work: true; experience_level: "Mid-level"; skills: any[];
    } => {
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

        // Get skills from the API response or extract from description as fallback
        const skills = [];

        // Use skills from API if available
        if (apiJob.skills && apiJob.skills.length > 0) {
            apiJob.skills.forEach(skill => {
                skills.push(skill.name);
            });
        } else {
            // Fallback: Extract skills from job description
            const popularSkills = ['React', 'JavaScript', 'Python', 'Node.js', 'TypeScript', 'AWS', 'Docker', 'Kubernetes', 'Machine Learning', 'UI/UX Design'];

            // Check if any popular skills are mentioned in the job description
            popularSkills.forEach(skill => {
                if (apiJob.description && apiJob.description.toLowerCase().includes(skill.toLowerCase())) {
                    skills.push(skill);
                }
            });
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
            postedDate: apiJob.posted_date || apiJob.created_at,
            description: apiJob.description,
            requirements: skills.length > 0 ? skills : ['Skills matching your profile'],
            benefits: ['Competitive benefits'],
            deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
            employerId: '1',
            duration: 'Permanent',
            remote_work: true,
            experience_level: 'Mid-level',
            skills: skills
        };
    }));
}

