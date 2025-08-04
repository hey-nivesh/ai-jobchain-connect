import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Header from '@/components/Header';
import { useJobs } from '@/hooks/useJobs';
import { JobCard } from '@/components/JobCard';
import { ProfileSettings } from '@/components/ProfileSettings';

const Dashboard = () => {
  const { filteredJobs, searchTerm, setSearchTerm, totalJobs } = useJobs();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 p-6 rounded-lg glass-card gradient-glass-card">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Job Dashboard</h1>
            <p className="text-muted-foreground">Discover your next career opportunity</p>
          </div>
          <ProfileSettings />
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search jobs, companies, locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 glass-input gradient-glass-input text-foreground"
            />
          </div>
        </div>

        {/* Job Listings */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>

        {/* Results Count */}
        <div className="mt-6 text-sm text-muted-foreground">
          Showing {filteredJobs.length} of {totalJobs} jobs
        </div>

        {filteredJobs.length === 0 && (
          <div className="text-center py-12 p-8 rounded-lg glass-card gradient-glass-card">
            <p className="text-muted-foreground text-lg">No jobs found matching your search.</p>
            <Button 
              variant="outline" 
              onClick={() => setSearchTerm('')}
              className="mt-4 backdrop-blur-sm"
            >
              Clear Search
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;