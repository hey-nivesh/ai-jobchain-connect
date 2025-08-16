import React, { useEffect, useState } from 'react';
import { Briefcase, Users, TrendingUp, Eye, MapPin, DollarSign, Clock, Plus } from 'lucide-react';
import StatsCard from './shared/StatsCard';
import JobPostingForm from '../jobs/JobPostingForm';

// Types
interface Job {
  id: string;
  title: string;
  location: string;
  salary: string;
  type: string;
  status: 'active' | 'closed' | 'draft';
  applications: number;
  postedDate: string;
}

interface EmployerStats {
  posted_jobs: number;
  total_applications: number;
  active_jobs: number;
  profile_views: number;
  employer_name: string;
}

// Mock data for demonstration
const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    location: 'San Francisco, CA',
    salary: '$120,000 - $150,000',
    type: 'Full-time',
    status: 'active',
    applications: 15,
    postedDate: '2024-01-15',
  },
  {
    id: '2',
    title: 'Backend Engineer',
    location: 'New York, NY',
    salary: '$110,000 - $140,000',
    type: 'Full-time',
    status: 'active',
    applications: 8,
    postedDate: '2024-01-10',
  },
  {
    id: '3',
    title: 'UI/UX Designer',
    location: 'Remote',
    salary: '$90,000 - $120,000',
    type: 'Contract',
    status: 'draft',
    applications: 0,
    postedDate: '2024-01-05',
  },
];

const mockStats: EmployerStats = {
  posted_jobs: 3,
  total_applications: 23,
  active_jobs: 2,
  profile_views: 156,
  employer_name: 'TechCorp Inc.',
};

const EmployerDashboard: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [stats, setStats] = useState<EmployerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showJobPostingForm, setShowJobPostingForm] = useState(false);

  useEffect(() => {
    // Simulate API call with mock data
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setJobs(mockJobs);
        setStats(mockStats);
      } catch (err: any) {
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="text-foreground">Loading...</div>;
  if (error) return <div className="text-destructive">{error}</div>;
  if (!stats) return null;

  const handleJobPosted = (newJob: any) => {
    // Add the new job to the jobs list
    const employerJob: Job = {
      id: newJob.id.toString(),
      title: newJob.title,
      location: newJob.location,
      salary: newJob.salary_range,
      type: newJob.job_type,
      status: 'active',
      applications: 0,
      postedDate: new Date(newJob.posted_date).toLocaleDateString()
    };
    
    setJobs(prevJobs => [employerJob, ...prevJobs]);
    
    // Update stats
    setStats(prev => prev ? {
      ...prev,
      posted_jobs: prev.posted_jobs + 1,
      active_jobs: prev.active_jobs + 1
    } : null);
    
    console.log('New job posted:', newJob);
  };

  const statCards = [
    { label: 'Posted Jobs', value: stats.posted_jobs, icon: Briefcase, color: 'from-blue-500 to-blue-600' },
    { label: 'Total Applications', value: stats.total_applications, icon: Users, color: 'from-green-500 to-green-600' },
    { label: 'Active Jobs', value: stats.active_jobs, icon: TrendingUp, color: 'from-purple-500 to-purple-600' },
    { label: 'Profile Views', value: stats.profile_views, icon: Eye, color: 'from-yellow-500 to-yellow-600' }
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Welcome Section */}
      <div className="bg-card/50 backdrop-blur-md border border-border rounded-2xl p-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Welcome back, {stats.employer_name}!
        </h1>
        <p className="text-muted-foreground">
          Manage your job postings and track applications from your dashboard.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <StatsCard key={index} label={stat.label} value={stat.value} icon={stat.icon} color={stat.color} />
        ))}
      </div>

      {/* Recent Job Posts */}
      <div className="bg-card/50 backdrop-blur-md border border-border rounded-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-foreground">Recent Job Posts</h2>
          <button 
            onClick={() => setShowJobPostingForm(true)}
            className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Post New Job</span>
          </button>
        </div>
        <div className="space-y-4">
          {jobs.slice(0, 3).map(job => (
            <div
              key={job.id}
              className="bg-card/30 border border-border rounded-xl p-4 hover:bg-card/50 transition-all duration-300"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground text-lg">{job.title}</h3>
                  <div className="flex items-center space-x-4 mt-2 text-muted-foreground text-sm">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <DollarSign className="w-4 h-4" />
                      <span>{job.salary}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{job.type}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 mt-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      job.status === 'active'
                        ? 'bg-green-500/20 text-green-600 dark:text-green-400'
                        : job.status === 'draft'
                        ? 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400'
                        : 'bg-red-500/20 text-red-600 dark:text-red-400'
                    }`}>
                      {job.status}
                    </span>
                    <span className="text-muted-foreground text-sm">
                      {job.applications} applications
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="bg-secondary text-secondary-foreground px-3 py-2 rounded-lg text-sm hover:bg-secondary/80 transition-colors">
                    Edit
                  </button>
                  <button className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-3 py-2 rounded-lg text-sm font-semibold hover:shadow-lg transition-all duration-300">
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* You can add analytics and quick actions here as needed */}

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

export default EmployerDashboard;
