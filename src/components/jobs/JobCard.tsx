import React from 'react';
import { MapPin, DollarSign, Clock, Building, Bookmark, Eye, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  requirements: string[];
  benefits: string[];
  postedDate: string;
  deadline: string;
  applications: number;
  status: 'active' | 'closed' | 'draft';
  employerId: string;
  duration: string;
}

interface JobCardProps {
  job: Job;
  onViewDetails: (job: Job) => void;
  onApply: (jobId: string) => void;
  onSave: (jobId: string) => void;
  isSaved?: boolean;
  isApplied?: boolean;
  showActions?: boolean;
}

const JobCard: React.FC<JobCardProps> = ({
  job,
  onViewDetails,
  onApply,
  onSave,
  isSaved = false,
  isApplied = false,
  showActions = true
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'closed':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'draft':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="bg-card/50 backdrop-blur-md border border-border rounded-xl p-6 hover:bg-card/70 transition-all duration-300 group">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors cursor-pointer" onClick={() => onViewDetails(job)}>
            {job.title}
          </h3>
          <div className="flex items-center space-x-2 mt-1">
            <Building className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground font-medium">{job.company}</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className={`${getStatusColor(job.status)} border`}>
            {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
          </Badge>
          {showActions && (
            <button
              onClick={() => onSave(job.id)}
              className={`p-2 rounded-lg transition-colors ${
                isSaved 
                  ? 'bg-primary/20 text-primary' 
                  : 'bg-muted/50 text-muted-foreground hover:bg-primary/10 hover:text-primary'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </button>
          )}
        </div>
      </div>

      {/* Job Details */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span>{job.location}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <DollarSign className="w-4 h-4" />
          <span>{job.salary}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>{job.type}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>{job.duration}</span>
        </div>
      </div>

      {/* Description */}
      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
        {job.description}
      </p>

      {/* Requirements Preview */}
      <div className="flex flex-wrap gap-2 mb-4">
        {job.requirements.slice(0, 3).map((req, index) => (
          <Badge key={index} variant="secondary" className="text-xs">
            {req}
          </Badge>
        ))}
        {job.requirements.length > 3 && (
          <Badge variant="outline" className="text-xs">
            +{job.requirements.length - 3} more
          </Badge>
        )}
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center pt-4 border-t border-border">
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <span>Posted {job.postedDate}</span>
          <span>•</span>
          <span>{job.applications} applications</span>
        </div>
        
        {showActions && (
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(job)}
              className="flex items-center space-x-2"
            >
              <Eye className="w-4 h-4" />
              <span>View</span>
            </Button>
            <Button
              size="sm"
              onClick={() => onApply(job.id)}
              disabled={isApplied}
              className="flex items-center space-x-2"
            >
              {isApplied ? 'Applied' : 'Apply Now'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobCard;
