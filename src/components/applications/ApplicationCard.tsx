import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Clock, MapPin, DollarSign, Star, Eye, MessageSquare } from 'lucide-react';

interface ApplicationCardProps {
  application: {
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
  };
  onViewDetails: (applicationId: string) => void;
  onMessageEmployer: (applicationId: string) => void;
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({
  application,
  onViewDetails,
  onMessageEmployer
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'under_review':
        return 'bg-blue-100 text-blue-800';
      case 'shortlisted':
        return 'bg-green-100 text-green-800';
      case 'interview_scheduled':
        return 'bg-purple-100 text-purple-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'hired':
        return 'bg-emerald-100 text-emerald-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-foreground">
              {application.job.title}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {application.job.company}
            </p>
          </div>
          <Badge className={getStatusColor(application.status)}>
            {getStatusLabel(application.status)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Job Details */}
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <MapPin className="w-4 h-4" />
            <span>{application.job.location}</span>
          </div>
          <div className="flex items-center space-x-1">
            <DollarSign className="w-4 h-4" />
            <span>{application.job.salary}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{formatDate(application.appliedAt)}</span>
          </div>
        </div>

        {/* Match Scores */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Overall Match</span>
            <div className="flex items-center space-x-2">
              <Progress value={application.overallMatchScore} className="w-20" />
              <span className="text-sm font-medium">{application.overallMatchScore}%</span>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1">
                <Star className="w-3 h-3 text-yellow-500" />
                <span>Skills</span>
              </div>
              <span className="font-medium">{application.skillMatchScore}%</span>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1">
                <Star className="w-3 h-3 text-blue-500" />
                <span>Experience</span>
              </div>
              <span className="font-medium">{application.experienceMatchScore}%</span>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1">
                <Star className="w-3 h-3 text-green-500" />
                <span>Location</span>
              </div>
              <span className="font-medium">{application.locationMatchScore}%</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(application.id)}
            className="flex-1"
          >
            <Eye className="w-4 h-4 mr-2" />
            View Details
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onMessageEmployer(application.id)}
            className="flex-1"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Message
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApplicationCard;
