import { useState, useEffect } from 'react';
import { getJobs } from '@/services/jobService';

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  status: 'active' | 'closed' | 'draft';
  applications: number;
  postedDate: string;
  description: string;
}

export const useJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const apiJobs = await getJobs();
        console.log('useJobs - Raw API data:', apiJobs); // Debug log
        const transformedJobs: Job[] = apiJobs.map(apiJob => {
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
          };
        });
        console.log('useJobs - Transformed jobs:', transformedJobs); // Debug log
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

  useEffect(() => {
    const filtered = jobs.filter(job =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredJobs(filtered);
  }, [searchTerm, jobs]);

  return {
    jobs,
    filteredJobs,
    searchTerm,
    setSearchTerm,
    totalJobs: jobs.length,
    loading,
    error
  };
}; 