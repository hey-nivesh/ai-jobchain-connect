import { MapPin, DollarSign, Briefcase, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Job } from '@/hooks/useJobs';

interface JobCardProps {
  job: Job;
}

export const JobCard = ({ job }: JobCardProps) => {
  const getTypeDisplay = (type: string) => {
    switch (type) {
      case 'FULL_TIME': return 'Full Time';
      case 'PART_TIME': return 'Part Time';
      case 'CONTRACT': return 'Contract';
      case 'INTERNSHIP': return 'Internship';
      case 'FREELANCE': return 'Freelance';
      default: return type;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'closed': return 'secondary';
      case 'draft': return 'outline';
      default: return 'default';
    }
  };

  return (
    <Card className="group hover:shadow-elevation transition-all duration-300 hover:-translate-y-1 glass-card gradient-glass-card">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
              {job.title}
            </CardTitle>
            <p className="text-muted-foreground font-medium flex items-center gap-1 mt-1">
              <Briefcase className="h-4 w-4" />
              {job.company}
            </p>
          </div>
          <div className="flex flex-col gap-2 ml-2">
            <Badge variant={getStatusColor(job.status)} className="capitalize backdrop-blur-sm">
              {job.status}
            </Badge>
            <Badge variant="secondary" className="capitalize backdrop-blur-sm">
              {getTypeDisplay(job.type)}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <DollarSign className="h-4 w-4" />
            <span>{job.salary}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{job.applications} applications</span>
          </div>
          <Button className="w-full btn-primary backdrop-blur-sm glass-button">
            Apply Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}; 