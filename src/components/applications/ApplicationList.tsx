import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Search, Filter, SortAsc, SortDesc } from 'lucide-react';
import ApplicationCard from './ApplicationCard';

interface Application {
  id: string;
  job: {
    id: string;
    title: string;
    company: string;
    location: string;
    salary: string;
    type: string;
  };
  status: string;
  overallMatchScore: number;
  skillMatchScore: number;
  experienceMatchScore: number;
  locationMatchScore: number;
  appliedAt: string;
  coverLetter?: string;
}

interface ApplicationListProps {
  applications: Application[];
  onViewDetails: (applicationId: string) => void;
  onMessageEmployer: (applicationId: string) => void;
}

const ApplicationList: React.FC<ApplicationListProps> = ({
  applications,
  onViewDetails,
  onMessageEmployer
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('appliedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'under_review', label: 'Under Review' },
    { value: 'shortlisted', label: 'Shortlisted' },
    { value: 'interview_scheduled', label: 'Interview Scheduled' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'hired', label: 'Hired' }
  ];

  const sortOptions = [
    { value: 'appliedAt', label: 'Application Date' },
    { value: 'overallMatchScore', label: 'Match Score' },
    { value: 'job.title', label: 'Job Title' },
    { value: 'job.company', label: 'Company' }
  ];

  const filteredAndSortedApplications = applications
    .filter(app => {
      const matchesSearch = 
        app.job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.job.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = !statusFilter || app.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let aValue: string | number | Date, bValue: string | number | Date;
      
      switch (sortBy) {
        case 'overallMatchScore':
          aValue = a.overallMatchScore;
          bValue = b.overallMatchScore;
          break;
        case 'job.title':
          aValue = a.job.title.toLowerCase();
          bValue = b.job.title.toLowerCase();
          break;
        case 'job.company':
          aValue = a.job.company.toLowerCase();
          bValue = b.job.company.toLowerCase();
          break;
        case 'appliedAt':
        default:
          aValue = new Date(a.appliedAt);
          bValue = new Date(b.appliedAt);
          break;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <Filter className="w-5 h-5" />
            <span>Filters & Search</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort By */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort Order */}
            <Button
              variant="outline"
              onClick={toggleSortOrder}
              className="flex items-center space-x-2"
            >
              {sortOrder === 'asc' ? (
                <SortAsc className="w-4 h-4" />
              ) : (
                <SortDesc className="w-4 h-4" />
              )}
              <span>{sortOrder === 'asc' ? 'Ascending' : 'Descending'}</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredAndSortedApplications.length} of {applications.length} applications
        </p>
        {searchTerm || statusFilter ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('');
            }}
          >
            Clear Filters
          </Button>
        ) : null}
      </div>

      {/* Applications Grid */}
      {filteredAndSortedApplications.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredAndSortedApplications.map(application => (
            <ApplicationCard
              key={application.id}
              application={application}
              onViewDetails={onViewDetails}
              onMessageEmployer={onMessageEmployer}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-muted-foreground">
              {searchTerm || statusFilter ? (
                <>
                  <p className="text-lg font-medium mb-2">No applications found</p>
                  <p>Try adjusting your search criteria or filters.</p>
                </>
              ) : (
                <>
                  <p className="text-lg font-medium mb-2">No applications yet</p>
                  <p>Start applying to jobs to see your applications here.</p>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ApplicationList;
