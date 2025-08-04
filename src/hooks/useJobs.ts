import { useState, useEffect } from 'react';

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: 'full-time' | 'part-time';
}

const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    company: 'TechCorp Inc.',
    location: 'San Francisco, CA',
    salary: '$120k - $150k',
    type: 'full-time'
  },
  {
    id: '2',
    title: 'Product Manager',
    company: 'InnovateLabs',
    location: 'New York, NY',
    salary: '$130k - $160k',
    type: 'full-time'
  },
  {
    id: '3',
    title: 'UX Designer',
    company: 'Design Studio',
    location: 'Remote',
    salary: '$80k - $100k',
    type: 'full-time'
  },
  {
    id: '4',
    title: 'Backend Developer',
    company: 'StartupXYZ',
    location: 'Austin, TX',
    salary: '$90k - $120k',
    type: 'part-time'
  },
  {
    id: '5',
    title: 'Data Scientist',
    company: 'DataFlow',
    location: 'Seattle, WA',
    salary: '$140k - $170k',
    type: 'full-time'
  },
  {
    id: '6',
    title: 'Mobile Developer',
    company: 'AppWorks',
    location: 'Los Angeles, CA',
    salary: '$100k - $130k',
    type: 'full-time'
  },
  {
    id: '7',
    title: 'DevOps Engineer',
    company: 'CloudTech',
    location: 'Remote',
    salary: '$110k - $140k',
    type: 'full-time'
  },
  {
    id: '8',
    title: 'UI/UX Designer',
    company: 'Creative Agency',
    location: 'Chicago, IL',
    salary: '$85k - $110k',
    type: 'part-time'
  }
];

export const useJobs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredJobs, setFilteredJobs] = useState<Job[]>(mockJobs);

  useEffect(() => {
    const filtered = mockJobs.filter(job =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredJobs(filtered);
  }, [searchTerm]);

  return {
    jobs: mockJobs,
    filteredJobs,
    searchTerm,
    setSearchTerm,
    totalJobs: mockJobs.length
  };
}; 