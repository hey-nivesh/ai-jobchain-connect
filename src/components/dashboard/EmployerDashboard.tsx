import React, { useEffect, useState } from 'react';
import { Briefcase, Users, TrendingUp, Eye, MapPin, DollarSign, Clock, Plus } from 'lucide-react';
import StatsCard from './shared/StatsCard';
import JobPostingForm from '../jobs/JobPostingForm';
import { useAuth } from '@/hooks/useAuth';
import apiClient from '@/lib/api';
import { getJobs, ApiJob } from '@/services/jobService';

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

const EmployerDashboard: React.FC = () => {
  const { user, userRole, setUserRole } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [stats, setStats] = useState<EmployerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showJobPostingForm, setShowJobPostingForm] = useState(false);
  const isEmployer = userRole === 'employer';

  const mapApiJobToEmployerJob = (j: ApiJob): Job => ({
    id: j.id.toString(),
    title: j.title,
    location: j.location || 'Remote',
    salary: 'Not specified',
    type: 'Full-time',
    status: 'active',
    applications: 0,
    postedDate: new Date(j.created_at).toISOString(),
  });

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getJobs();
      const employerUid = user?.uid || '';
      const mine = data.filter(j => j.employer_name === employerUid);
      const mapped = mine.map(mapApiJobToEmployerJob);
      setJobs(mapped);
      setStats({
        posted_jobs: mapped.length,
        total_applications: 0,
        active_jobs: mapped.length,
        profile_views: 0,
        employer_name: user?.displayName || user?.email?.split('@')[0] || 'Employer',
      });
    } catch (err: any) {
      console.error('Failed to load dashboard data.', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid]);

  const handleJobPosted = (newJob: ApiJob) => {
    const employerJob: Job = mapApiJobToEmployerJob(newJob);
    setJobs(prevJobs => [employerJob, ...prevJobs]);
    setStats(prev => prev ? {
      ...prev,
      posted_jobs: prev.posted_jobs + 1,
      active_jobs: prev.active_jobs + 1
    } : null);
  };

  const becomeEmployer = async () => {
    try {
      await apiClient.post('/set-role', { role: 'EMPLOYER' });
      setUserRole('employer');
    } catch (e) {
      console.error('Failed to switch to employer role.', e);
    }
  };

  if (loading) return <div className="text-foreground">Loading...</div>;
  if (error) return <div className="text-destructive">{error}</div>;

  if (!isEmployer) {
    return (
      <div className="space-y-6 p-6">
        <div className="bg-card/50 backdrop-blur-md border border-border rounded-2xl p-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">Switch to Employer</h1>
          <p className="text-muted-foreground mb-4">You need an employer role to manage job postings.</p>
          <button 
            onClick={becomeEmployer}
            className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
          >
            Become Employer
          </button>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const statusStyles: Record<string, string> = {
    active: 'bg-green-500/20 text-green-600 dark:text-green-400',
    draft: 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400',
    archived: 'bg-red-500/20 text-red-600 dark:text-red-400',
  };

  const getStatusClasses = (status: string) =>
    statusStyles[status] || 'bg-gray-300 text-gray-700';

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
        {statCards.map((stat) => (
          <StatsCard key={stat.label} label={stat.label} value={stat.value} icon={stat.icon} color={stat.color} />
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
          {jobs.slice(0, 10).map(job => (
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
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusClasses(job.status)}`}>
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
