import React from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import { formatDistanceToNow } from 'date-fns';
import { Job } from '../../hooks/useWebSocket';
import {
  Building2,
  MapPin,
  BriefcaseIcon,
  DollarSignIcon,
  StarIcon
} from 'lucide-react';

interface JobListProps {
  jobs: Job[];
  loading: boolean;
  error: string | null;
  onView: (jobId: string) => void;
  onSave: (jobId: string) => void;
  onApply: (jobId: string) => void;
  showMatchScore?: boolean;
}

const JobList: React.FC<JobListProps> = ({
  jobs,
  loading,
  error,
  onView,
  onSave,
  onApply,
  showMatchScore = false
}) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-6">
            <Skeleton className="h-6 w-2/3 mb-4" />
            <Skeleton className="h-4 w-1/3 mb-2" />
            <Skeleton className="h-4 w-1/4" />
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!jobs.length) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No jobs found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <Card key={job.id} className="p-6 relative">
          {Boolean(showMatchScore && job.match_score) && (
            <div className="absolute top-4 right-4 flex items-center gap-1 text-yellow-600">
              <StarIcon className="h-5 w-5" />
              <span className="font-medium">{job.match_score}% Match</span>
            </div>
          )}
          
          <div className="mb-4">
            <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
            <div className="flex flex-wrap gap-4 text-gray-600">
              <div className="flex items-center gap-1">
                <Building2 className="h-4 w-4" />
                <span>{job.company || job.employer_name}</span>
              </div>
              {job.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{job.location}</span>
                </div>
              )}
              {job.type && (
                <div className="flex items-center gap-1">
                  <BriefcaseIcon className="h-4 w-4" />
                  <span>{job.type}</span>
                </div>
              )}
              {job.salary && (
                <div className="flex items-center gap-1">
                  <DollarSignIcon className="h-4 w-4" />
                  <span>{job.salary}</span>
                </div>
              )}
            </div>
          </div>

          <p className="text-gray-600 mb-4 line-clamp-2">{job.description}</p>

          {showMatchScore && job.reasons_for_match && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Why this matches you:</h4>
              <ul className="list-disc list-inside text-sm text-gray-600">
                {job.reasons_for_match.slice(0, 3).map((reason) => (
                  <li key={`${job.id}-${reason}`}>{reason}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() => onView(job.id.toString())}
            >
              View Details
            </Button>
            <Button
              variant="outline"
              onClick={() => onSave(job.id.toString())}
            >
              Save
            </Button>
            <Button
              onClick={() => onApply(job.id.toString())}
            >
              Apply Now
            </Button>
          </div>

          {job.created_at && (
            <div className="mt-4 text-sm text-gray-500">
              Posted {formatDistanceToNow(new Date(job.created_at))} ago
            </div>
          )}
        </Card>
      ))}
    </div>
  );
};

export default JobList;
